import { prisma } from '@/lib/init/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.headers['x-user-id'];

  try {
    // Transactions to merchants can go only from admin, merchants can't transfer between other merchants
    const transactions = await prisma.transaction.findMany({
      include: {
        to: {
          select: {
            role: true,            
            merchantData: true
          }
        },
        from: {
          select: {
            role: true,
            merchantData: true
          }
        }
      },
      where: {
        to: {
          id: token                
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching merchants:', error);
    res.status(500).json({ message: 'Error fetching merchants' });
  }
}