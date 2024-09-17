import { HeaderAdmin } from "@/components/Header/HeaderAdmin";
import { NavbarAdmin } from "@/components/Navbar/NavbarAdmin";
import React, { useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";

const AdminLayout = ({ path = [], children }) => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log(session);

    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-row min-h-screen w-full bg-[#fafbfa]">
      <NavbarAdmin />
      <div className="flex-1 flex-col h-full">
        <HeaderAdmin />
        <main className="flex flex-1 flex-col items-start justify-start px-[32px] pt-[16px] h-full">
          <div className="flex flex-row gap-[4px] mb-[42px]">
          {path.map((path, index) => {
            if (index === 0) {
              return (
                <p className="text-[#015640] text-xs font-normal">
                  {path}
                </p>
              );
            } else {
              return (
                <>
                  <Image src="/icons/arrow-right.svg" width={16} height={16} alt="arrow-right" />
                  <p className="text-[#0e1726] text-xs font-normal">
                    {path}
                  </p>
                </>
              )
            }
          })}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
