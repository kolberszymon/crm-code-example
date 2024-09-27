import {prisma} from '@/lib/init/prisma';
import { Role } from '@prisma/client';

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
            in: [Role.MERCHANT_VIEW, Role.MERCHANT_EDIT, Role.ADMIN]
          }
        },
        to: {
          role: Role.EMPLOYEE
        }
      },      
    });

    const transactionFromEmployee = await prisma.transaction.findMany({
      include: {
        from: {
          include: {
            employeeData: true
          }
        },
        to: true
      },
      where: {
        to: {
          role: "ADMIN"
        },
        from: {
          role: "EMPLOYEE",
        },
        merchantId: user.id
      }
    });

    


    res.status(200).json(transactions.concat(transactionFromEmployee).sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employees' });
  }
}