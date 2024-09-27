import { prisma } from "@/lib/init/prisma";
import { TransactionType, LogIcon } from "@prisma/client";
import { checkIfUserIsAuthorized } from "@/helpers/checkIfUserIsAuthorized";
import { Role } from "@prisma/client";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userIdHeader = req.headers["x-user-id"];
  
  try {
    await checkIfUserIsAuthorized(userIdHeader, [Role.ADMIN, Role.MERCHANT_EDIT, Role.MERCHANT_VIEW]);
  } catch (error) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const { userId, tokens } = JSON.parse(req.body);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await prisma.$transaction(async (prisma) => {

      // Add tokens to user
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          tokens: { increment: tokens },
        },
      });
      
      // Create transaction object
      await prisma.transaction.create({
        data: {
          fromId: userId,
          toId: userId,          
          balanceAfter: updatedUser.tokens,
          transactionAmount: tokens,
          type: TransactionType.GENERATE_TOKENS,
        },
      });


      // Create log
      await prisma.log.create({
        data: {      
          message: `Dodano ${tokens} tokenów do użytkownika ${updatedUser.email}`,
          icon: LogIcon.COIN,
        },
      });

    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error updating user tokens' });
  }
}