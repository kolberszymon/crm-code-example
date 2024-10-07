import { prisma } from '@/lib/init/prisma';
import { checkIfUserIsAuthorized } from "@/helpers/checkIfUserIsAuthorized";
import { Role } from "@prisma/client";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userId = req.headers["x-user-id"];
  
  try {
    await checkIfUserIsAuthorized(userId, [Role.ADMIN]);
  } catch (error) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const { name } = req.body;

  try {
    const trainingCategory = await prisma.trainingCategory.create({
      data: { name },
    });

    res.status(200).json({ success: true, message: "Utworzono nową kategorię szkolenia" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Błąd podczas tworzenia kategorii szkolenia" });
  }
}