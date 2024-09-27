import { prisma } from '@/lib/init/prisma';
import { Role } from "@prisma/client";
import { checkIfUserIsAuthorized } from "@/helpers/checkIfUserIsAuthorized";

export default async function fetchLogs(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userId = req.headers["x-user-id"];
  
  try {
    await checkIfUserIsAuthorized(userId, [Role.ADMIN]);
  } catch (error) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const logs = await prisma.log.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 100
    });

    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: 'Error fetching logs' });
  }
}
