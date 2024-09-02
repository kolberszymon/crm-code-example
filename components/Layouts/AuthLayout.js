import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function AuthLayout({ children }) {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/admin/dashboard");
    }
  }, [session, router]);

  return (
    <div className="w-full h-screen bg-[#ebefee] flex flex-col items-center pt-[60px]">
      {children}
    </div>
  );
}
