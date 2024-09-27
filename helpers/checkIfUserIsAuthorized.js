import { prisma } from "@/lib/init/prisma";

export const checkIfUserIsAuthorized = async (userId, roles) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user || !roles.includes(user.role)) {
    throw new Error("Unauthorized");
  }
};