import { prisma } from "@/lib/init/prisma";
import { Role, TransactionType } from "@prisma/client";
import { checkIfUserIsAuthorized } from "@/helpers/checkIfUserIsAuthorized";



export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const userId = req.headers["x-user-id"];
  
  try {
    await checkIfUserIsAuthorized(userId, [Role.ADMIN]);
  } catch (error) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const userId = req.headers["x-user-id"];
    let merchants = req.body;

    // Check if admin has enough tokens to send
    const admin = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    merchants = merchants.map(merchant => ({
      ...merchant,
      topUpAmount: Number(merchant.topUpAmount)
    }));

    const totalTokensToSend = merchants.reduce((total, merchant) => total + merchant.topUpAmount, 0);

    if (!admin || admin.role !== Role.ADMIN) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (admin.tokens < totalTokensToSend) {
      return res.status(400).json({ success: false, message: "Nie masz wystarczającej ilości tokenów (doładuj je w Konta merchantów)" });
    }

    let numberOfTransactionsMade = 0

    await prisma.$transaction(async (prisma) => {
      // Decrement admin's token balance
      await prisma.user.update({
        where: { id: admin.id },
        data: { tokens: { decrement: totalTokensToSend } }
      });

      for (const merchant of merchants) {
        if (merchant.topUpAmount === 0) {
          console.log("Omijanie transakcji 0")
          continue;
        }

        // Increment merchant's token balance
        const updatedMerchant = await prisma.user.update({
          where: { id: merchant.userId },
          data: { tokens: { increment: merchant.topUpAmount } }
        });

        await prisma.merchantData.update({
          where: { id: merchant.merchantId },
          data: { lastTopupAmount: merchant.topUpAmount }
        });

        // Create transaction record
        const transaction = await prisma.transaction.create({
          data: {            
            type: TransactionType.TRANSFER_TOKENS,
            fromId: admin.id,
            toId: merchant.userId,
            balanceAfter: updatedMerchant.tokens,
            transactionAmount: merchant.topUpAmount,
          }
        });

        numberOfTransactionsMade++;

        // Create log entry
        await prisma.log.create({
          data: {
            message: `Przesłano ${merchant.topUpAmount} tokenów do ${merchant.merchantName} z admina ${admin.email}`
          }
        });
      }
    });


    res.status(200).json({ success: true, message: "Tokeny zostały przesłane", numberOfTransactionsMade });
  } catch (error) {
    console.error("Error updating token balances:", error);
    res.status(500).json({ success: false, message: "Error updating token balances", error: error.message });
  }
}