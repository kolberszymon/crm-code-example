import {prisma} from '@/lib/init/prisma';
import { checkIfUserIsAuthorized } from "@/helpers/checkIfUserIsAuthorized";
import { Role } from "@prisma/client";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userId = req.headers["x-user-id"];
  
  try {
    await checkIfUserIsAuthorized(userId, [Role.ADMIN]);
  } catch (error) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        type: 'GENERATE_TOKENS'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
}