import {prisma} from '@/lib/init/prisma';
import { Role } from '@prisma/client';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.headers["x-user-id"];

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: token
      },
      include: {
        merchantData: true
      }
    });

    if (!user) {
      return res.status(403).json({ message: "There's no user with this token" });
    }

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
          merchantId: user.merchantData.id
        }
      }
    });

    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employees' });
  }
}