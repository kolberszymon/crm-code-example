import { prisma } from "@/lib/init/prisma";
import { Role, TransactionType, TransactionStatus, TransferStatus } from "@prisma/client";
import { addSeconds } from 'date-fns';

// This endpoint is used to send payoff to employees from admin
// It means that transaction needs to go from admin to merchant and from merchant to employee

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const userId = req.headers["x-user-id"];
    let employees = req.body;

    // Check if admin has enough tokens to send
    const admin = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    employees = employees.filter(employee => employee.pit4Amount && employee.topUpAmount).map(employee => ({
      ...employee,
      topUpAmount: Number(employee.topUpAmount),
      pit4Amount: Number(employee.pit4Amount)
    }));

    console.log(employees)

    const totalTokensToSend = employees.reduce((total, employee) => total + employee.topUpAmount, 0);

    if (!admin || admin.role !== Role.ADMIN) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (admin.tokens < totalTokensToSend) {
      return res.status(400).json({ success: false, message: "Nie masz wystarczającej ilości tokenów (doładuj je w Konta merchantów)" });
    }
    
    for (const employee of employees) {
      await prisma.$transaction(async (prisma) => {
        // Create transaction from admin to merchant ALWAYS
        await prisma.transaction.create({
          data: {
            type: TransactionType.TRANSFER_TOKENS,
            transactionAmount: employee.topUpAmount + employee.pit4Amount,
            fromId: admin.id,
            toId: employee.merchantUserId,
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
            createdAt: addSeconds(new Date(), 2)           
          }
        })
        
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
              createdAt: addSeconds(new Date(), 3),
              wasPaymentAutomatic: true
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
      })
    }

    res.status(200).json({ success: true, message: "Tokeny zostały przesłane" });
  } catch (error) {
    console.error("Error updating token balances:", error);
    res.status(500).json({ success: false, message: "Error updating token balances", error: error.message });
  }
}