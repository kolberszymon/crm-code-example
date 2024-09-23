import { prisma } from "@/lib/init/prisma";

export async function createTrainingPurchase(trainingId, email, price, currency) {
  try {
    const trainingPurchase = await prisma.trainingPurchase.create({
      data: {
        trainingId,
        email,
        price,
        currency,
      },
    });

    return { success: true, msg: "Training purchase created", trainingPurchaseId: trainingPurchase.id };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Error creating training purchase" };
  }
}