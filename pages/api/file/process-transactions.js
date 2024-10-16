import { prisma } from "@/lib/init/prisma";
import { Role, TransactionType, TransactionStatus, TransferStatus } from "@prisma/client";
import { addSeconds } from "date-fns";
import { checkIfUserIsAuthorized } from "@/helpers/checkIfUserIsAuthorized";
import { Argon2id } from "oslo/password";
import { setMilliseconds, setSeconds, setMinutes, setHours } from "date-fns";

const getRandomHashedPassword = async () => {
  const password = Math.random().toString(36).slice(2, 10);
  const hashedPassword = await new Argon2id().hash(password);
  return hashedPassword;
}

function getRandomTime(date) {
  const startHour = 8;
  const endHour = 16;
  const randomHour = Math.floor(Math.random() * (endHour - startHour)) + startHour;
  const randomMinute = Math.floor(Math.random() * 60);
  const randomSecond = Math.floor(Math.random() * 60);
  return setMilliseconds(setSeconds(setMinutes(setHours(date, randomHour), randomMinute), randomSecond), 0);
}

async function batchCreateMerchants(uniqueMerchantsEmailName) {
  const uniqueMerchantsEmail = [...new Set(uniqueMerchantsEmailName.map(m => m.email))];
  const existingMerchants = await prisma.user.findMany({
    where: { email: { in: uniqueMerchantsEmail } },
    select: { email: true }
  });
  const existingEmails = new Set(existingMerchants.map(m => m.email));
  
  const newMerchants = uniqueMerchantsEmailName.filter((obj) => !existingEmails.has(obj.email));
  
  const hashedPassword = await getRandomHashedPassword();

  if (newMerchants.length > 0) {
    // Create users
    await prisma.user.createMany({
      data: newMerchants.map(m => ({
        email: m.email,
        hashedPassword,
        role: Role.MERCHANT_VIEW,
      })),
      skipDuplicates: true,
    });

    // Fetch the newly created users
    const createdUsers = await prisma.user.findMany({
      where: { email: { in: newMerchants.map(m => m.email) } },
      select: { id: true, email: true }
    });

    // Create merchantData for new users
    await prisma.merchantData.createMany({
      data: createdUsers.map(user => {
        const merchant = newMerchants.find(m => m.email === user.email);
        return {
          userId: user.id,
          accountType: "View",
          merchantName: merchant.merchantName
        };
      }),
      skipDuplicates: true,
    });
  }
}

async function processRow(row, year, month, admin) {
  const amountNetto = Number((parseFloat(row.amountNetto) || 0).toFixed(2));
  const amountPit4 = Number((parseFloat(row.amountPit4) || 0).toFixed(2));

  const createdTransactions = [];

  try {
    // Upsert merchant
    let merchant = await prisma.user.findUnique({
      where: { email: row.merchantEmail },
      include: { merchantData: true }
    });
    
    if (!merchant) {
      merchant = await prisma.user.create({
        data: {
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
    }

    let employee = await prisma.user.findUnique({
      where: { phone: row.employeePhone },
      include: { employeeData: true }
    });

    if (!employee) {
      employee = await prisma.user.create({
        data: {
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
    } else if (employee.employeeData.merchantId !== merchant.merchantData.id) {      
      await prisma.employeeData.update({
        where: { id: employee.employeeData.id },
        data: {
          merchantId: merchant.merchantData.id
        }
      });
    }

    let adminTokens = admin.tokens;
    let merchantTokens = merchant.tokens;
    let employeeTokens = employee.tokens;

    const transactionDate = getRandomTime(row.transactionDate);

    merchantTokens += amountNetto + amountPit4;
    adminTokens -= amountNetto + amountPit4;

    // Create transaction from admin to merchant
    const transaction1 = await prisma.transaction.create({
      data: {
        type: TransactionType.TRANSFER_TOKENS,
        transactionAmount: amountNetto + amountPit4,
        pit4Amount: amountPit4,
        fromId: admin.id,
        toId: merchant.id,
        createdAt: transactionDate,
        balanceAfter: merchantTokens,
        merchantId: merchant.id
      }
    });
    createdTransactions.push(transaction1.id);

    merchantTokens -= amountPit4;
    adminTokens += amountPit4;

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
          createdAt: addSeconds(transactionDate, 1),
          balanceAfter: adminTokens
        }
      });
      createdTransactions.push(transaction2.id);
    }

    merchantTokens -= amountNetto;
    employeeTokens += amountNetto;

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
        createdAt: addSeconds(transactionDate, 2),
        balanceAfter: employeeTokens
      }
    });
    createdTransactions.push(transaction3.id);


    adminTokens += amountNetto;
    employeeTokens -= amountNetto;
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
        wasPaymentAutomatic: true,
        balanceAfter: adminTokens
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
    await batchCreateMerchants(uniqueMerchantsEmailName);
  
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