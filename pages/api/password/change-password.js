import { prisma } from "@/lib/init/prisma";
import { Argon2id } from "oslo/password";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // get token from x-user-id header
  const token = req.headers['x-user-id'];
  const { currentPassword, newPassword } = JSON.parse(req.body);
  try {

  const user = await prisma.user.findUnique({
    where: {
      id: token,
    },
  });

  if (!user) {
    return res.status(400).json({ success: false, message: 'Nie znaleziono użytkownika' });
  }

  const currentPasswordMatch = await new Argon2id().verify(user.hashedPassword, currentPassword);

  if (!currentPasswordMatch) {
    return res.status(400).json({ success: false, message: 'Podano nieprawidłowe aktualne hasło' });
  }

  const hashedPassword = await new Argon2id().hash(newPassword);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      hashedPassword,
    },
  });

  return res.status(200).json({ success: true, message: 'Hasło zostało zaktualizowane' });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Wystąpił błąd podczas aktualizacji hasła' });
  }
}