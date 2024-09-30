import { prisma } from "@/lib/init/prisma";
import { Role } from "@prisma/client";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { totalTokenAmount, uniqueMerchants, month, year } = req.body;
    let errors = [];
    
    try {
      // Check if admin has enough tokens
      const admin = await prisma.user.findFirst({
        where: {
          role: Role.ADMIN,
        },
      });

      if (admin.tokens < totalTokenAmount) {
        errors.push(`Niewystarczająca ilość tokenów na koncie admina. Doładuj ${parseFloat((totalTokenAmount - admin.tokens).toFixed(2))} tokenów`);
      }

      // Check if merchants exist and are of type 'edit'
      for (const merchantEmail of uniqueMerchants) {
        const merchant = await prisma.user.findUnique({
          where: {
            email: merchantEmail,
          },
          include: {
            merchantData: true
          }
        });

        if (!merchant) {
          continue;
        }

        if (merchant.role === Role.EMPLOYEE) {
          errors.push(`Nieprawidłowy email merchanta: ${merchant.name}. Ten email jest przypisany do pracownika`);
        }

        if (merchant.role === Role.MERCHANT_EDIT) {
          errors.push(`Nieprawidłowy typ merchanta: ${merchant.merchantData?.merchantName} (Obecny typ: ${merchant.role}, powinien być: ${Role.MERCHANT_VIEW}). Jeśli chcesz edytować dane merchanta, zmień typ na "Merchant view" w zakładce "Konta merchantów"`);
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({ success: false, errors, message: 'Znaleziono błędy w pliku:' });
      }

      // If all checks pass
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Server error:', error);
      return res.status(500).json({ success: false, errors: [], message: 'Błąd po stronie serwera, spróbuj ponownie' });
    }
  } 
}