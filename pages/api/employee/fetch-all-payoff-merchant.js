import {prisma} from '@/lib/init/prisma';
import { Role } from '@prisma/client';

// In payoff we should show only employees which merchant accountType is View

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
    const employees = await prisma.user.findMany({
      include: {
        employeeData: {
          include: {
            merchant: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        role: Role.EMPLOYEE,
        employeeData: {
          merchant: {
            userId: userId
          }
        },
        isActive: true,
      }
    });

    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employees' });
  }
}