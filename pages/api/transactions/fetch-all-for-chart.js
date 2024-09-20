import { prisma } from '@/lib/init/prisma';
import { Role } from '@prisma/client';
import { startOfMonth, subMonths, endOfMonth, eachMonthOfInterval, format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { startCase } from 'lodash';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const endDate = new Date();
  const startDate = subMonths(endDate, 5); // 6 months including current

  const transactionsOut = await prisma.transaction.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: {
        gte: startOfMonth(startDate),
        lte: endOfMonth(endDate),
      },
      from: {
        role: Role.ADMIN
      }
    },
    _sum: {
      transactionAmount: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const transactionsIn = await prisma.transaction.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: {
        gte: startOfMonth(startDate),
        lte: endOfMonth(endDate),
      },
      to: {
        role: 'ADMIN'
      }
    },
    _sum: {
      transactionAmount: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const last6Months = eachMonthOfInterval({
    start: startDate,
    end: endDate
  });

  // Initialize monthlyData with all 6 months
  const monthlyData = last6Months.reduce((acc, date) => {
    const monthName = startCase(format(date, 'LLL', { locale: pl }));
    acc[monthName] = { wyslane: 0, zwrocone: 0 };
    return acc;
  }, {});

  // Update these lines as well
  transactionsOut.forEach(t => {
    const monthName = startCase(format(t.createdAt, 'LLL', { locale: pl }));
    monthlyData[monthName].wyslane += t._sum.transactionAmount || 0;
  });

  transactionsIn.forEach(t => {
    const monthName = startCase(format(t.createdAt, 'LLL', { locale: pl }));
    monthlyData[monthName].zwrocone += t._sum.transactionAmount || 0;
  });

  const chartData = Object.entries(monthlyData).map(([name, data]) => ({
    name,
    wyslane: data.wyslane,
    zwrocone: data.zwrocone,
  }));

  res.status(200).json(chartData);
}