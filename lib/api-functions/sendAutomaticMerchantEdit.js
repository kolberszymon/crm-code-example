import { TransactionType } from "@prisma/client";
import { prisma } from "@/lib/init/prisma";
import { Role } from "@prisma/client";

export const sendAutomaticMerchantEdit = async (employeeData) => {

  const merchantUser = employeeData.merchant.user;

  const adminUser = await prisma.user.findFirst({
    where: {
      role: Role.ADMIN
    }
  });

  if (merchantUser.tokens < employeeData.paymentAmount + employeeData.paymentAmountPit) {
    throw new Error("Merchant nie ma wystarczającej ilości tokenów");
  }

  await prisma.$transaction(async (prisma) => {

    // Create transaction from merchant to employee
    await prisma.transaction.create({
      data: {
        type: TransactionType.TRANSFER_TOKENS_RECURRENT,
        balanceAfter: employeeData.user.tokens + employeeData.paymentAmount,
        transactionAmount: employeeData.paymentAmount,
        pit4Amount: employeeData.paymentAmountPit,
        fromId: employeeData.merchantId,
        toId: employeeData.user.id,
        merchantId: employeeData.merchantId,
        transactionStatus: TransactionStatus.ZASILONO,
      }
    })

     // Create transaction from merchant to admin for pit4Amount
     await prisma.transaction.create({
      data: {
        type: TransactionType.TRANSFER_TOKENS_RECURRENT,
        transactionAmount: employeeData.paymentAmountPit,
        fromId: employeeData.merchantId,
        toId: adminUser.id,
        merchantId: employeeData.merchantId,
        pit4Amount: employeeData.paymentAmountPit,
        createdAt: addSeconds(new Date(), 1)
      }
    })

    // Decrement merchant tokens
    await prisma.user.update({
      where: { id: employeeData.merchantId },
      data: { tokens: { decrement: employeeData.paymentAmount + employeeData.paymentAmountPit } }
    });

    if (employeeData.automaticReturnOn) {         
      // Create transaction from employee to admin
      await prisma.transaction.create({
        data: {
          type: TransactionType.TRANSFER_TOKENS_RECURRENT,
          transactionAmount: employeeData.paymentAmount,              
          pit4Amount: employeeData.paymentAmountPit,
          fromId: employeeData.id,
          toId: adminUser.id,
          merchantId: employeeData.merchantId,
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
        data: { tokens: { increment: employeeData.paymentAmount } }
      })
    }

  })

}