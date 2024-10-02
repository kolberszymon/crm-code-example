import { prisma } from "@/lib/init/prisma";
import { Role, TransactionType, TransactionStatus, TransferStatus } from "@prisma/client";
import { addSeconds } from "date-fns";
import { checkIfUserIsAuthorized } from "@/helpers/checkIfUserIsAuthorized";
import { Argon2id } from "oslo/password";
import { isSaturday, isSunday, lastDayOfMonth, subDays, setMilliseconds, setSeconds, setMinutes, setHours } from "date-fns";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

async function ensureMerchantAccounts(uniqueMerchantsEmailName) {
  const errors = [];

  for (const merchantEmailName of uniqueMerchantsEmailName) {
    try {
      await prisma.user.upsert({
        where: { email: merchantEmailName.email },
        update: {}, // If exists, don't update
        create: {
          email: merchantEmailName.email,
          hashedPassword: await getRandomHashedPassword(),
          role: Role.MERCHANT_VIEW,
          merchantData: {
            create: {
              accountType: "View",
              merchantName: merchantEmailName.merchantName
            }
          }
        }
      });
    } catch (error) {
      console.error(`Error creating merchant account for ${merchantEmailName.email}:`, error);
      errors.push(`Failed to create merchant account for ${merchantEmailName.email}: ${error.message}`);
    }    
  }

  return errors;
}

async function processRow(row, year, month, admin) {
  const amountNetto = Number((parseFloat(row.amountNetto) || 0).toFixed(2));
  const amountPit4 = Number((parseFloat(row.amountPit4) || 0).toFixed(2));

  const createdTransactions = [];

  console.log("Przetwarzanie wiersza:", row);

  try {
    // Upsert merchant
    const merchant = await prisma.user.upsert({
      where: { email: row.merchantEmail },
      update: {}, // If the user exists, don't update anything
      create: {
        email: row.merchantEmail,
        hashedPassword: await getRandomHashedPassword(),
        role: Role.MERCHANT_VIEW,
        merchantData: {
          create: {
            accountType: "View",
            merchantName: row.merchantName
          }
        }
      },
      include: { merchantData: true }
    });

    // Upsert employee
    const employee = await prisma.user.upsert({
      where: { phone: row.employeePhone },
      update: {
        employeeData: {
          upsert: {
            create: {
              merchantId: merchant.merchantData.id,
              firstName: row.employeeFirstName,
              lastName: row.employeeLastName,
              automaticReturnOn: true,
            },
            update: {
              merchantId: merchant.merchantData.id,
              firstName: row.employeeFirstName,
              lastName: row.employeeLastName,
              automaticReturnOn: true,
            }
          }
        }
      },
      create: {
        email: row.employeeEmail,
        phone: row.employeePhone,
        hashedPassword: await getRandomHashedPassword(),
        role: Role.EMPLOYEE,
        employeeData: {
          create: {
            merchantId: merchant.merchantData.id,
            firstName: row.employeeFirstName,
            lastName: row.employeeLastName,
            automaticReturnOn: true,
          }
        }
      },
      include: { employeeData: true }
    });

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
    createdTransactions.push(transaction1.id);

    // Create transaction from merchant to admin for pit4Amount if pit4Amount is greater than 0
    if (amountPit4 > 0) {
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
      createdTransactions.push(transaction2.id);
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
    createdTransactions.push(transaction3.id);

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
    createdTransactions.push(transaction4.id);

    console.log("Przesłano tokeny do: ", merchant.email, employee.email, admin.email)

    return createdTransactions;
  } catch (error) {
    // If there's an error, delete all transactions created for this row
    if (createdTransactions.length > 0) {
      await prisma.transaction.deleteMany({
        where: {
          id: {
            in: createdTransactions
          }
        }
      });
    }
    throw error;
  }
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

    const fileData = req.body.fileData;
    const month = req.body.month;
    const year = req.body.year;
    const uniqueMerchantsEmailName = req.body.uniqueMerchantsEmailName;


    if (!fileData) {
      return res.status(400).json({ message: "File data is required" });
    }

    // Get admin user for cleaner code
    const admin = await prisma.user.findFirst({
      where: {
        role: Role.ADMIN
      }
    });

    // Create merchant accounts before processing transactions
    const merchantErrors = await ensureMerchantAccounts(uniqueMerchantsEmailName);
    if (merchantErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Failed to create some merchant accounts",
        errors: merchantErrors
      });
    }
  
    const BATCH_SIZE = 50;
    const allTransactions = [];
    const errors = [];

    for (let i = 0; i < fileData.length; i += BATCH_SIZE) {
      const batch = fileData.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map((row, index) => 
        processRow(row, year, month, admin)
          .then(transactions => ({ success: true, transactions }))
          .catch(error => ({ success: false, error: `Error processing row ${i + index + 1}: ${error.message}` }))
      );

      const batchResults = await Promise.all(batchPromises);

      batchResults.forEach(result => {
        if (result.success) {
          allTransactions.push(...result.transactions);
        } else {
          errors.push(result.error);
        }
      });
    }

    if (errors.length > 0) {
      await prisma.transaction.deleteMany({
        where: {
          id: {
            in: allTransactions
          }
        }
      });

      res.status(207).json({ 
        success: false, 
        message: "Wystąpiły błędy podczas przetwarzania. Żadne tokeny nie zostały przesłane.", 
        errors: errors
      });
    } else {
      res.status(200).json({ 
        success: true, 
        message: "Wszystkie tokeny zostały przesłane", 
        transactionIds: allTransactions 
      });
    }
  } catch (error) {
    console.error("Error updating token balances:", error);
    res.status(500).json({ success: false, message: "Error updating token balances", error: error.message });
  }
}