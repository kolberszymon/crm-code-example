import { TransactionType, Role, TransactionStatus, TransferStatus } from "@prisma/client";
import { prisma } from "@/lib/init/prisma";
import { addSeconds } from "date-fns";

export const sendAutomaticMerchantView = async (employeeData) => {

  // 1. For merchant view tokens go from admin account
  const adminUser = await prisma.user.findFirst({
    where: {
      role: Role.ADMIN
    }
  });

  const toUser = await prisma.user.findUnique({
    where: { id: employeeData.user.id }
  });
  

  if (!adminUser || !toUser) {
    throw new Error("Nie znaleziono użytkownika admina");
  }

  // 2. Check if admin has enough tokens to send
  if (adminUser.tokens < employeeData.paymentAmount + employeeData.paymentAmountPit) {
    throw new Error("Admin nie ma wystarczającej ilości tokenów");
  }
  
  try {
    await prisma.$transaction(async (prisma) => {

      console.log("Done0")
      // Create transaction from admin to merchant ALWAYS
      await prisma.transaction.create({
        data: {
          type: TransactionType.TRANSFER_TOKENS_RECURRENT,
          transactionAmount: employeeData.paymentAmount + employeeData.paymentAmountPit,
          fromId: adminUser.id,
          toId: employeeData.merchant.user.id,
        }
      })

      console.log("Done1")

      // Create transaction from merchant to admin for pit4Amount
      await prisma.transaction.create({
        data: {
          type: TransactionType.TRANSFER_TOKENS_PIT,
          transactionAmount: employeeData.paymentAmountPit,
          fromId: employeeData.merchant.user.id,
          toId: adminUser.id,
          merchantId: employeeData.merchant.user.id,
          pit4Amount: employeeData.paymentAmountPit,
          createdAt: addSeconds(new Date(), 1)
        }
      })

      console.log("Done2")

      // Create transaction from merchant to employee ALWAYS
      await prisma.transaction.create({
        data: {
          type: TransactionType.TRANSFER_TOKENS_RECURRENT,
          transactionAmount: employeeData.paymentAmount,
          pit4Amount: employeeData.paymentAmountPit,
          fromId: employeeData.merchant.user.id,
          toId: toUser.id,
          merchantId: employeeData.merchant.user.id,
          transactionStatus: TransactionStatus.ZASILONO, 
          createdAt: addSeconds(new Date(), 2)           
        }
      })

      console.log("Done3")

      if (employeeData.automaticReturnOn) {         
        // Create transaction from employee to admin
        await prisma.transaction.create({
          data: {
            type: TransactionType.TRANSFER_TOKENS_RECURRENT,
            transactionAmount: employeeData.paymentAmount,
            pit4Amount: employeeData.paymentAmountPit,
            fromId: toUser.id,
            toId: adminUser.id,
            merchantId: employeeData.merchant.user.id,
            transactionStatus: TransactionStatus.DO_ROZLICZENIA,
            transferStatus: TransferStatus.NIEROZLICZONE,
            createdAt: addSeconds(new Date(), 3),
            wasPaymentAutomatic: true
          }
        })
      } else {
        // Decrement admin tokens
        await prisma.user.update({
          where: { id: adminUser.id },
          data: { tokens: { decrement: employeeData.paymentAmount} }
        });

        await prisma.user.update({
          where: { id: toUser.id },
          data: { tokens: { increment: employeeData.paymentAmount } }
        })
      }
    })
  } catch (error) {
    console.error('Error sending automatic merchant view:', error);
    throw error;
  }

  
}