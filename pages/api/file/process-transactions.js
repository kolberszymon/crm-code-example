import { prisma } from "@/lib/init/prisma";
import { Role, TransactionType, TransactionStatus, TransferStatus } from "@prisma/client";
import { addSeconds } from "date-fns";
import { checkIfUserIsAuthorized } from "@/helpers/checkIfUserIsAuthorized";
import { Argon2id } from "oslo/password";
import { isSaturday, isSunday, lastDayOfMonth, subDays, setMilliseconds, setSeconds, setMinutes, setHours } from "date-fns";

const getRandomHashedPassword = async () => {
  const password = Math.random().toString(36).slice(2, 10);
  const hashedPassword = await new Argon2id().hash(password);

  return hashedPassword;
}

function getLastWorkingDayOfMonth(year, month) {
  let lastDay = lastDayOfMonth(new Date(year, month - 1));
  
  while (isSaturday(lastDay) || isSunday(lastDay)) {
    lastDay = subDays(lastDay, 1);
  }
  
  return lastDay;
}

function getRandomTime(date) {
  const startHour = 8;
  const endHour = 16;
  
  const randomHour = Math.floor(Math.random() * (endHour - startHour)) + startHour;
  const randomMinute = Math.floor(Math.random() * 60);
  const randomSecond = Math.floor(Math.random() * 60);
  
  return setMilliseconds(setSeconds(setMinutes(setHours(date, randomHour), randomMinute), randomSecond), 0);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {    
    const userId = req.headers["x-user-id"];
  
    try {
      await checkIfUserIsAuthorized(userId, [Role.ADMIN]);
    } catch (error) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const fileData = req.body.fileData
    const month = req.body.month
    const year = req.body.year

    if (!fileData) {
      return res.status(400).json({ message: "File data is required" });
    }

    const BATCH_SIZE = 50; // Adjust based on your needs

    // Get admin user for cleaner code
    const admin = await prisma.user.findFirst({
      where: {
        role: Role.ADMIN
      }
    });

    const batchPromises = [];
    const batchResults = [];

    for (let i = 0; i < fileData.length; i += BATCH_SIZE) {
      const batch = fileData.slice(i, i + BATCH_SIZE);

      batchPromises.push(
        prisma.$transaction(async (prisma) => {
          const batchTransactions = [];

          for (const row of batch) {
            const amountNetto = Number((parseFloat(row.amountNetto) || 0).toFixed(2));
            const amountPit4 = Number((parseFloat(row.amountPit4) || 0).toFixed(2));

            // Check if merchant exists
            let merchant = await prisma.user.findFirst({
              where: {
                email: row.merchantEmail
              },
              include: {
                merchantData: true
              }
            });        

            // If no, create new merchant and merchant data
            if (!merchant) {          
              merchant = await prisma.user.create({
                data: {
                  email: row.merchantEmail,
                  hashedPassword: await getRandomHashedPassword(),
                  role: Role.MERCHANT_VIEW                            
                }
              });

              await prisma.merchantData.create({
                data: {
                  accountType: "View",
                  merchantName: row.merchantName,
                  userId: merchant.id
                }
              });

              // refetch with merchantData
              merchant = await prisma.user.findFirst({
                where: {
                  email: row.merchantEmail
                },
                include: {
                  merchantData: true
                }
              });
            }

            // Check if employee exists
            let employee = await prisma.user.findFirst({
              where: {
                phone: row.employeePhone
              }
            });

            // If no, create new employee and employee data
            if (!employee) {
              employee = await prisma.user.create({
                data: {
                  email: row.employeeEmail,
                  hashedPassword: await getRandomHashedPassword(),
                  role: Role.EMPLOYEE
                }
              });

              await prisma.employeeData.create({
                data: {
                  userId: employee.id,
                  merchantId: merchant.merchantData.id,
                  firstName: row.employeeFirstName,
                  lastName: row.employeeLastName,    
                  automaticReturnOn: true,                  
                }
              });
            } else {
              // If exists, update merchantId
              await prisma.employeeData.update({
                where: {
                  userId: employee.id
                },
                data: {
                  merchantId: merchant.id,              
                }
              });
            }

            // Get the last working day of the month with hour between 8 and 16
            const transactionDate = getRandomTime(getLastWorkingDayOfMonth(year, month));

            // Create transaction from admin to merchant
            const transaction1 = await prisma.transaction.create({
              data: {
                type: TransactionType.TRANSFER_TOKENS,
                transactionAmount: amountNetto + amountPit4,
                pit4Amount: amountPit4,
                fromId: admin.id,
                toId: merchant.id,
                createdAt: transactionDate
              }
            });
            batchTransactions.push(transaction1.id);

            // Create transaction from merchant to admin for pit4Amount if pit4Amount is greater than 0
            if (row.amountPit4 > 0) {
              const transaction2 = await prisma.transaction.create({
                data: {
                  type: TransactionType.TRANSFER_TOKENS_PIT,
                  transactionAmount: amountPit4,
                  fromId: merchant.id,
                  toId: admin.id,
                  merchantId: merchant.id,
                  pit4Amount: amountPit4,
                  createdAt: addSeconds(transactionDate, 1)
                }
              });
              batchTransactions.push(transaction2.id);
            }

            // Create transaction from merchant to employee ALWAYS
            const transaction3 = await prisma.transaction.create({
              data: {
                type: TransactionType.TRANSFER_TOKENS,
                transactionAmount: amountNetto,
                pit4Amount: amountPit4,
                fromId: merchant.id,
                toId: employee.id,
                merchantId: merchant.id,
                transactionStatus: TransactionStatus.ZASILONO, 
                createdAt: addSeconds(transactionDate, 2)           
              }
            });
            batchTransactions.push(transaction3.id);

            // Create transaction from employee to admin
            const transaction4 = await prisma.transaction.create({
              data: {
                type: TransactionType.TRANSFER_TOKENS,
                transactionAmount: amountNetto,
                pit4Amount: amountPit4,
                fromId: employee.id,
                toId: admin.id,
                merchantId: merchant.id,
                transactionStatus: TransactionStatus.DO_ROZLICZENIA,
                transferStatus: TransferStatus.NIEROZLICZONE,
                createdAt: addSeconds(transactionDate, 3),
                wasPaymentAutomatic: true
              }
            });
            batchTransactions.push(transaction4.id);
          }

          return batchTransactions;
        }, 
        {
          maxWait: 5000, // 5 seconds max wait to connect to prisma
          timeout: 20000, // 20 seconds
        })
      );
    }

    try {
      const results = await Promise.all(batchPromises);
      batchResults.push(...results.flat());
      
      res.status(200).json({ success: true, message: "Tokeny zostały przesłane", transactionIds: batchResults });
    } catch (error) {
      // If any batch fails, delete all created transactions
      await prisma.transaction.deleteMany({
        where: {
          id: {
            in: batchResults.flat()
          }
        }
      });

      throw error; // Re-throw the error to be caught by the outer try-catch
    }
  } catch (error) {
    console.error("Error updating token balances:", error);
    res.status(500).json({ success: false, message: "Error updating token balances", error: error.message });
  }
}