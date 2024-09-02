"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";
import { lucia } from "@/lib/init/lucia";
import { prisma } from "@/lib/init/prisma";

const signIn = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Niepoprawny email lub hasło");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "Niepoprawny email lub hasło" };
    }

    const validPassword = await new Argon2id().verify(
      user.hashedPassword,
      password
    );

    if (!validPassword) {
      return { error: "Niepoprawny email lub hasło" };
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return { success: true };
  } catch (error) {
    return { error: "Wystąpił błąd podczas logowania" };
  }
};

export { signIn };
