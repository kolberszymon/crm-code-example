import { createMerchant } from "@/lib/api-functions/create-merchant";
import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const body = {
      email,
      password,
      role,
    };

    const results = await createMerchant(body);

    return res.status(200).json(results);
  } catch (error) {
    console.log("Error creating user:", error);
    return res.status(400).json({ error: "Internal server error" });
  }
}
