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
  const { title, introduction, category, description, fileUrl, priceTokens, pricePln } = req.body;

  try {
    const training = await prisma.training.create({
      data: { title, introduction, category, description, fileUrl, priceTokens, pricePln },
    });

    res.status(200).json({ success: true, message: "Utworzono nowe szkolenie" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Błąd podczas tworzenia szkolenia" });
  }
}