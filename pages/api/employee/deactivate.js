import { prisma } from '@/lib/init/prisma';
import { Role } from "@prisma/client";
import { checkIfUserIsAuthorized } from "@/helpers/checkIfUserIsAuthorized";
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const userId = req.headers["x-user-id"];
  
  try {
    await checkIfUserIsAuthorized(userId, [Role.ADMIN, Role.MERCHANT_EDIT, Role.MERCHANT_VIEW]);
  } catch (error) {
    return res.status(403).json({ message: 'Unauthorized' });
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