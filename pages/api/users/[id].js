import { prisma } from "@/lib/init/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error fetching user' });
  }
}