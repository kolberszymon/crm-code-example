import { prisma } from "@/lib/init/prisma";
import { Role, TransactionType, TransactionStatus, TransferStatus } from "@prisma/client";
import { addSeconds } from 'date-fns';
import { checkIfUserIsAuthorized } from "@/helpers/checkIfUserIsAuthorized";

// This endpoint is used to send payoff to employees from admin
// It means that transaction needs to go from admin to merchant and from merchant to employee

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

    let employees = req.body;

    // Check if admin has enough tokens to send
    const admin = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    employees = employees.filter(employee => (parseFloat(employee.pit4Amount) >= 0) && (parseFloat(employee.topUpAmount) >= 1)).map(employee => ({
      ...employee,
      topUpAmount: Number(employee.topUpAmount),
      pit4Amount: Number(employee.pit4Amount)
    }));
    
    const totalTokensToSend = employees.reduce((total, employee) => total + employee.topUpAmount, 0);

    if (admin.tokens < totalTokensToSend) {
      return res.status(400).json({ success: false, message: "Nie masz wystarczającej ilości tokenów (doładuj je w Konta merchantów)" });
    }

    let numberOfTransactionsMade = 0;
    
    for (const employee of employees) {
      if (employee.topUpAmount === 0) {
        console.log("Omijanie transakcji 0")
        continue;
      }

      await prisma.$transaction(async (prisma) => {
        const merchant = await prisma.user.findUnique({
          where: {
            id: employee.merchantUserId
          }
        })

        let adminTokens = admin.tokens;
        let merchantTokens = merchant.tokens;
        let employeeTokens = employee.tokens;

        merchantTokens += employee.topUpAmount + employee.pit4Amount;
        adminTokens -= employee.pit4Amount + employee.topUpAmount;

        // Create transaction from admin to merchant ALWAYS
        await prisma.transaction.create({
          data: {
            type: TransactionType.TRANSFER_TOKENS,
            transactionAmount: employee.topUpAmount + employee.pit4Amount,
            fromId: admin.id,
            toId: employee.merchantUserId,
            balanceAfter: merchantTokens,
            merchantId: employee.merchantUserId,
            pit4Amount: employee.pit4Amount
          }
        })

        merchantTokens -= employee.pit4Amount;
        adminTokens += employee.pit4Amount;

        // Create transaction from merchant to admin for pit4Amount
        if (employee.pit4Amount > 0) {
          await prisma.transaction.create({
            data: {
              type: TransactionType.TRANSFER_TOKENS_PIT,
              transactionAmount: employee.pit4Amount,
              fromId: employee.merchantUserId,
              toId: admin.id,
              merchantId: employee.merchantUserId,
              pit4Amount: employee.pit4Amount,
              createdAt: addSeconds(new Date(), 1),
              balanceAfter: adminTokens
            }
          })
        }

        merchantTokens -= employee.topUpAmount;
        employeeTokens += employee.topUpAmount;

        // Create transaction from merchant to employee ALWAYS
        await prisma.transaction.create({
          data: {
            type: TransactionType.TRANSFER_TOKENS,
            transactionAmount: employee.topUpAmount,
            pit4Amount: employee.pit4Amount,
            fromId: employee.merchantUserId,
            toId: employee.id,
            merchantId: employee.merchantUserId,
            transactionStatus: TransactionStatus.ZASILONO, 
            createdAt: addSeconds(new Date(), 2),
            balanceAfter: employeeTokens
          }
        })
        
        if (employee.automaticReturnOn) {         
          adminTokens += employee.topUpAmount;
          employeeTokens -= employee.topUpAmount;
          // Create transaction from employee to admin
          await prisma.transaction.create({
            data: {
              type: TransactionType.TRANSFER_TOKENS,
              transactionAmount: employee.topUpAmount,
              pit4Amount: employee.pit4Amount,
              fromId: employee.id,
              toId: admin.id,
              merchantId: employee.merchantUserId,
              transactionStatus: TransactionStatus.DO_ROZLICZENIA,
              transferStatus: TransferStatus.NIEROZLICZONE,
              createdAt: addSeconds(new Date(), 3),
              wasPaymentAutomatic: true,
              balanceAfter: adminTokens
            }
          })
        } else {
          // Decrement admin tokens
          await prisma.user.update({
            where: { id: admin.id },
            data: { tokens: { decrement: employee.topUpAmount} }
          });

          await prisma.user.update({
            where: { id: employee.id },
            data: { tokens: { increment: employee.topUpAmount } }
          })
        }

        numberOfTransactionsMade++;
      })
    }

    res.status(200).json({ success: true, message: "Tokeny zostały przesłane", numberOfTransactionsMade });
  } catch (error) {
    console.error("Error updating token balances:", error);
    res.status(500).json({ success: false, message: "Error updating token balances", error: error.message });
  }
}