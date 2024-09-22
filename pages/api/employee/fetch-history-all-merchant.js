import {prisma} from '@/lib/init/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userId = req.headers['x-user-id']

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        from: {
          include: {
            employeeData: true,
            merchantData: true
          }
        },
        to: {
          include: {
            employeeData: true,
            merchantData: true
          }
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        from: {
          merchantId: user.merchantId
        },
        to: {
          merchantId: user.merchantId
        },
        OR: [
          {
            transactionStatus: {
              not: null
            },
          },
          {
            transferStatus: {
              not: null
            },
          }
        ]
      },      
    });

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employees' });
  }
}