import { prisma } from "@/lib/init/prisma";
import { Role, TransactionType, TransactionStatus, TransferStatus } from "@prisma/client";
import { addSeconds } from "date-fns";
import { checkIfUserIsAuthorized } from "@/helpers/checkIfUserIsAuthorized";

// This endpoint is used to send payoff to employees from admin
// It means that transaction needs to go from admin to merchant and from merchant to employee

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    let employees = req.body;
    
    const userId = req.headers["x-user-id"];
  
    try {
      await checkIfUserIsAuthorized(userId, [Role.ADMIN, Role.MERCHANT_EDIT, Role.MERCHANT_VIEW]);
    } catch (error) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Check if admin has enough tokens to send
    const merchant = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        merchantData: true
      }
    });

    if (!merchant || ( merchant.role !== Role.MERCHANT_EDIT && merchant.role !== Role.MERCHANT_VIEW )) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    employees = employees.filter(employee => employee.merchantId === merchant.merchantData.id).map(employee => ({
      ...employee,
      topUpAmount: Number(employee.topUpAmount),
      pit4Amount: Number(employee.pit4Amount)
    }));

    const totalTokensToSend = employees.reduce((total, employee) => total + employee.topUpAmount, 0);

    if (merchant.tokens < totalTokensToSend) {
      return res.status(400).json({ success: false, message: "Nie masz wystarczającej ilości tokenów (Admin musi je doładować)" });
    }

    const admin = await prisma.user.findFirst({
      where: {
        role: Role.ADMIN,
        merchantData: {
          isNot: null
        }
      }
    })

    for (const employee of employees) {
      console.log(employee)

      await prisma.$transaction(async (prisma) => {
        // Create transaction from merchant to employee
        await prisma.transaction.create({
          data: {
            type: TransactionType.TRANSFER_TOKENS,
            balanceAfter: employee.balance + employee.topUpAmount, // to ma sens bo balance przesyłamy z componentu, nie z bazy danych
            transactionAmount: employee.topUpAmount,
            pit4Amount: employee.pit4Amount,
            fromId: merchant.id,
            toId: employee.id,
            merchantId: merchant.id,
            transactionStatus: TransactionStatus.ZASILONO,
          }
        })

        // Create transaction from merchant to admin for pit4Amount
        await prisma.transaction.create({
          data: {
            type: TransactionType.TRANSFER_TOKENS_PIT,
            transactionAmount: employee.pit4Amount,
            fromId: employee.merchantUserId,
            toId: admin.id,
            merchantId: employee.merchantUserId,
            pit4Amount: employee.pit4Amount,
            createdAt: addSeconds(new Date(), 1)
          }
        })

        // Decrement merchant tokens
        await prisma.user.update({
          where: { id: merchant.id },
          data: { tokens: { decrement: employee.topUpAmount } }
        });

        if (employee.automaticReturnOn) {         
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
              createdAt: addSeconds(new Date(), 2),
              wasPaymentAutomatic: true
            }
          })
        } else {
          // If there's no automatic return on, increment employee tokens
          await prisma.user.update({
            where: { id: employee.id },
            data: { tokens: { increment: employee.topUpAmount } }
          })
        }
      })
    }

    res.status(200).json({ success: true, message: "Tokeny zostały przesłane" });
  } catch (error) {
    console.error("Error updating token balances:", error);
    res.status(500).json({ success: false, message: "Error updating token balances", error: error.message });
  }
}