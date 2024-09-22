import { prisma } from '@/lib/init/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { employeeIds } = req.body;

  if (!employeeIds || !Array.isArray(employeeIds)) {
    return res.status(400).json({ success: false, message: 'Employee IDs is required and must be an array' });
  }

  console.log(employeeIds)

  try {
    await prisma.user.updateMany({
      where: { id: { in: employeeIds } },
      data: {
        isActive: false
      }
    });

    res.status(200).json({ success: true, message: 'Pracownicy zdezaktywowani' });
  } catch (error) {
    console.error('Error deactivating merchant:', error);
    res.status(500).json({ success: false, message: 'Wystąpił błąd' });
  }
}