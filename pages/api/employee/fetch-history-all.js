import {prisma} from '@/lib/init/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
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

    console.log(transactions);

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employees' });
  }
}