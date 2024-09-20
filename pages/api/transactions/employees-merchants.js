import { prisma } from '@/lib/init/prisma';
import { TransferStatus, Role } from '@prisma/client';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {

    const { from, to } = req.query;

    if (!from || !to) {
      const transactions = await prisma.transaction.count({
        where: {
          transferStatus: TransferStatus.ROZLICZONE,
        },
      });

      const employees = await prisma.user.count({
        where: {
          role: Role.EMPLOYEE
        }
      });

      const merchants = await prisma.user.count({
        where: {
          role: {
            in: [Role.MERCHANT_EDIT, Role.MERCHANT_VIEW]
          }
        }
      });

      return res.status(200).json({
        transactions,
        employees,
        merchants
      });
    } else {
      // Transactions to merchants can go only from admin, merchants can't transfer between other merchants
      const transactions = await prisma.transaction.count({     
        where: {
          transferStatus: TransferStatus.ROZLICZONE,
          createdAt: {
            gte: from ? new Date(from) : null,
            lte: to ? new Date(to) : null,
          },
        },
      });

      const employees = await prisma.user.count({
        where: {
          role: Role.EMPLOYEE,
          createdAt: {
            gte: from ? new Date(from) : null,
            lte: to ? new Date(to) : null,
          },
        }
      });

      const merchants = await prisma.user.count({
        where: {
          role: {
            in: [Role.MERCHANT_EDIT, Role.MERCHANT_VIEW]
          },
          createdAt: {
            gte: from ? new Date(from) : null,
            lte: to ? new Date(to) : null,
          },
        }
      });

      return res.status(200).json({
        transactions,
        employees,
        merchants
      });
    }

  } catch (error) {
    console.error('Error fetching merchants:', error);
    res.status(500).json({ message: 'Error fetching merchants' });
  }
}