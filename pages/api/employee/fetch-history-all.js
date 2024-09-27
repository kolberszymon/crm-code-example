import {prisma} from '@/lib/init/prisma';
import { Role } from "@prisma/client";
import { checkIfUserIsAuthorized } from "@/helpers/checkIfUserIsAuthorized";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userId = req.headers["x-user-id"];
  
  try {
    await checkIfUserIsAuthorized(userId, [Role.ADMIN, Role.MERCHANT_EDIT, Role.MERCHANT_VIEW]);
  } catch (error) {
    return res.status(403).json({ message: 'Unauthorized' });
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