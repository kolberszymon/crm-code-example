import { prisma } from "@/lib/init/prisma";
import { Argon2id } from "oslo/password";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {token, password} = JSON.parse(req.body);

  try {

  const passwordSetLink = await prisma.passwordSetLink.findUnique({
    where: {
      token,
    },
  });

  if (!passwordSetLink || !passwordSetLink.isActive || passwordSetLink.expiresAt < new Date()) {
    return res.status(400).json({ success: false, message: 'Niewłaściwy lub nieważny link' });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: passwordSetLink.userId,
    },
  });

  if (!user) {
    return res.status(400).json({ success: false, message: 'Nie znaleziono użytkownika' });
  }

  const hashedPassword = await new Argon2id().hash(password);


  await prisma.$transaction(async (prisma) => {
    
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        hashedPassword,
      },
    });

    await prisma.passwordSetLink.update({
      where: {
        id: passwordSetLink.id,
      },
      data: {
        isActive: false,
      },
    });

  });

  return res.status(200).json({ success: true, message: 'Hasło zostało zaktualizowane' });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Wystąpił błąd podczas aktualizacji hasła' });
  }
}