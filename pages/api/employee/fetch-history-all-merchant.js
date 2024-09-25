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
        from: true,
        to: {
          include: {
            employeeData: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        from: {
          id: user.id,
          role: {
            in: ['MERCHANT_VIEW', 'MERCHANT_EDIT', 'ADMIN']
          }
        },
        to: {
          role: 'EMPLOYEE'
        }
      },      
    });



    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employees' });
  }
}