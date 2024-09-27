import { TransactionType, TransactionStatus, TransferStatus, Role } from "@prisma/client";
import { prisma } from "@/lib/init/prisma";
import { addSeconds } from "date-fns";

export const sendAutomaticMerchantEdit = async (employeeData) => {

  const merchantUser = employeeData.merchant.user;

  const toUser = await prisma.user.findUnique({
    where: { id: employeeData.user.id }
  });

  const adminUser = await prisma.user.findFirst({
    where: {
      role: Role.ADMIN
    }
  });

  if (merchantUser.tokens < employeeData.paymentAmount + employeeData.paymentAmountPit) {

      // Create unsuccessful transaction from merchant to employee
      await prisma.transaction.create({
        data: {
          type: TransactionType.TRANSFER_TOKENS_UNSUCCESSFUL,
          transactionAmount: employeeData.paymentAmount,
          pit4Amount: employeeData.paymentAmountPit,
          fromId: merchantUser.id,
          toId: toUser.id,
          transactionStatus: TransactionStatus.BLAD_ZASILENIA
        }
      })
  
      console.log("Brak środków, stworzono transakcję TRANSFER_TOKENS_UNSUCCESSFUL")

    throw new Error("Merchant nie ma wystarczającej ilości tokenów");
  }

  await prisma.$transaction(async (prisma) => {

    // Create transaction from merchant to employee
    await prisma.transaction.create({
      data: {
        type: TransactionType.TRANSFER_TOKENS_RECURRENT,
        balanceAfter: toUser.tokens + employeeData.paymentAmount,
        transactionAmount: employeeData.paymentAmount,
        pit4Amount: employeeData.paymentAmountPit,
        fromId: merchantUser.id,
        toId: toUser.id,
        merchantId: merchantUser.id,
        transactionStatus: TransactionStatus.ZASILONO,
      }
    })

     // Create transaction from merchant to admin for pit4Amount
     await prisma.transaction.create({
      data: {
        type: TransactionType.TRANSFER_TOKENS_PIT,
        transactionAmount: employeeData.paymentAmountPit,
        fromId: merchantUser.id,
        toId: adminUser.id,
        merchantId: merchantUser.id,
        pit4Amount: employeeData.paymentAmountPit,
        createdAt: addSeconds(new Date(), 1)
      }
    })

    // Decrement merchant tokens
    await prisma.user.update({
      where: { id: merchantUser.id },
      data: { tokens: { decrement: employeeData.paymentAmount + employeeData.paymentAmountPit } }
    });

    if (employeeData.automaticReturnOn) {         
      // Create transaction from employee to admin
      await prisma.transaction.create({
        data: {
          type: TransactionType.TRANSFER_TOKENS_RECURRENT,
          transactionAmount: employeeData.paymentAmount,              
          pit4Amount: employeeData.paymentAmountPit,
          fromId: toUser.id,
          toId: adminUser.id,
          merchantId: merchantUser.id,
          transactionStatus: TransactionStatus.DO_ROZLICZENIA,
          transferStatus: TransferStatus.NIEROZLICZONE,
          createdAt: addSeconds(new Date(), 2),
          wasPaymentAutomatic: true
        }
      })
    } else {
      // If there's no automatic return on, increment employee tokens
      await prisma.user.update({
        where: { id: toUser.id },
        data: { tokens: { increment: employeeData.paymentAmount } }
      })
    }

  })

}