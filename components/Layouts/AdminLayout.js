import { HeaderAdmin } from "@/components/Header/HeaderAdmin";
import { NavbarAdmin } from "@/components/Navbar/NavbarAdmin";
import React, { useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Role } from "@prisma/client";
import Link from "next/link";

const AdminLayout = ({ path = [], children, firstPath }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session && status !== "loading") {
      router.push("/login");
    } else if (session &&session.user.role !== Role.ADMIN && status !== "loading") {
      router.push("/merchant/dashboard");
    }

  }, [session, router, status]);

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
          {path.map((pathItem, index) => {
            if (index === 0) {
              if (firstPath) {
                return (
                  <Link href={`/admin/${firstPath}`} key={index}>
                    <p className="text-[#015640] text-xs font-normal cursor-pointer">
                      {pathItem}
                    </p>
                  </Link>
                );
              } else {
                return (
                  <p className="text-[#015640] text-xs font-normal" key={index}>
                    {pathItem}
                  </p>
                );
              }
            } else {
              return (
                <>
                  <Image src="/icons/arrow-right.svg" width={16} height={16} alt="arrow-right" key={`${index}-arrow`} />
                  <p className="text-[#0e1726] text-xs font-normal" key={`${index}-path`}>
                    {pathItem}
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
