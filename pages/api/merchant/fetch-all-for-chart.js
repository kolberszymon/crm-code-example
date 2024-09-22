import { prisma } from '@/lib/init/prisma';
import { startOfMonth, subMonths, endOfMonth, eachMonthOfInterval, format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { startCase } from 'lodash';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const endDate = new Date();
  const startDate = subMonths(endDate, 5); // 6 months including current

  const merchantsView = await prisma.user.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: {
        gte: startOfMonth(startDate),
        lte: endOfMonth(endDate),
      },
      role: 'MERCHANT_VIEW',
      isActive: true
    },
    _count: {
      id: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const merchantsEdit = await prisma.user.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: {
        gte: startOfMonth(startDate),
        lte: endOfMonth(endDate),
      },
      role: 'MERCHANT_EDIT',
      isActive: true
    },
    _count: {
      id: true,
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
    acc[monthName] = { view: 0, edit: 0 };
    return acc;
  }, {});

  merchantsView.forEach(m => {
    const monthName = startCase(format(m.createdAt, 'LLL', { locale: pl }));
    monthlyData[monthName].view += m._count.id;
  });

  merchantsEdit.forEach(m => {
    const monthName = startCase(format(m.createdAt, 'LLL', { locale: pl }));
    monthlyData[monthName].edit += m._count.id;
  });

  const chartData = Object.entries(monthlyData).map(([name, data]) => ({
    name,
    view: data.view,
    edit: data.edit,
  }));

  res.status(200).json(chartData);
}