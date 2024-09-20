import { prisma } from '@/lib/init/prisma';
import { TransferStatus } from '@prisma/client';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Transactions to merchants can go only from admin, merchants can't transfer between other merchants
    const transactions = await prisma.transaction.findMany({     
      where: {
        transferStatus: TransferStatus.NIEROZLICZONE
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(transactions.length);
  } catch (error) {
    console.error('Error fetching merchants:', error);
    res.status(500).json({ message: 'Error fetching merchants' });
  }
}