import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Role } from "@prisma/client";

export function AuthLayout({ children }) {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && session.user.role === Role.ADMIN) {
      router.push("/admin/dashboard");
    } else if (session && (session.user.role === Role.MERCHANT_EDIT || session.user.role === Role.MERCHANT_VIEW)) {
      router.push("/merchant/dashboard");
    }
  }, [session, router]);

  return (
    <div className="w-full min-h-screen bg-[#ebefee] flex flex-col items-center pt-[60px]">
      {children}
    </div>
  );
}
