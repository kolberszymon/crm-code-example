import { prisma } from '@/lib/init/prisma';

export default async function handler(req, res) {
  console.log(req.body);

  const { id, title, introduction, category, description, fileUrl, priceTokens, pricePln } = req.body;

  try {
    const training = await prisma.training.update({
      where: { id },
      data: { title, introduction, category, description, fileUrl, priceTokens, pricePln },
    });

    res.status(200).json({ success: true, message: "Szkolenie zostało zaktualizowane" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Błąd podczas aktualizowania szkolenia" });
  }
}