"use client";

import { useState } from "react";
import { ButtonGray } from "../Buttons/ButtonGray";
import { ButtonGreen } from "../Buttons/ButtonGreen";
import { SearchBar } from "../Inputs/SearchBar";

import Link from "next/link";
import { NotificationBell } from "./NotificationBell";
import { showToastNotificationSuccess } from "../Custom/ToastNotification";

export const HeaderAdmin = () => {
  const [searchValue, setSearchValue] = useState("");

  const displayMsg = () => {
    showToastNotificationSuccess(
      "Nowe szkolenie",
      "Szkolenie zostało dodane do listy szkoleń"
    );
  };

  return (
    <header className="w-full bg-white shadow h-[56px] flex flex-row justify-between items-center px-[32px]">
      {/* Top bar content (e.g., search, buttons) */}

      <SearchBar value={searchValue} setValue={setSearchValue} />
      <div className="flex flex-row gap-[16px] items-center">
        <Link href="/admin/merchants/create">
          <ButtonGray title={"Dodaj merchanta"} />
        </Link>
        <Link href="/admin/employees/create">
          <ButtonGreen title={"Dodaj pracownika"} />
        </Link>
        <NotificationBell />
      </div>
    </header>
  );
};
