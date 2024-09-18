"use client";

import { useState } from "react";
import { ButtonGreen } from "../Buttons/ButtonGreen";
import { SearchBar } from "../Inputs/SearchBar";
import Link from "next/link";
import { NotificationBell } from "./NotificationBell";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";

export const HeaderMerchant = () => {
  const { data: session } = useSession();
  const [searchValue, setSearchValue] = useState("");

  if (!session) {
    return null;
  }

  return (
    <header className="w-full bg-white shadow h-[56px] flex flex-row justify-between items-center px-[32px]">
      {/* Top bar content (e.g., search, buttons) */}

      <SearchBar value={searchValue} setValue={setSearchValue} />
      <div className="flex flex-row gap-[16px] items-center">
        {session.user.role === Role.MERCHANT_EDIT && (     
        <Link href="/merchant/employees/create">
          <ButtonGreen title={"Dodaj pracownika"} />
        </Link>
        )}        
      </div>
    </header>
  );
};
