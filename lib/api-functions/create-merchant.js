import { Argon2id } from "oslo/password";
import { prisma } from "@/lib/init/prisma";

export async function createMerchant({ merchantName, email, password, role }) {
  const hashedPassword = await new Argon2id().hash(password);

  const userData = {
    email,
    hashedPassword,
    role,
  };

  try {
    await prisma.user.create({
      data: userData,
    });

    return { success: true, msg: "User created" };
  } catch (error) {
    console.log(error);

    return { error };
  }
}
