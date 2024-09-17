import {prisma} from '@/lib/init/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
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