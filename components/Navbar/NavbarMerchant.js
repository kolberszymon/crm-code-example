"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Modal } from "@/components/Modal";
import { ButtonMustard } from "../Buttons/ButtonMustard";
import { ButtonGray } from "../Buttons/ButtonGray";
import Image from "next/image";
import { signOut } from "next-auth/react";

const NavbarSection = ({ title }) => {
  return (
    <div className="py-[12px] pl-[16px] w-full bg-main-gray font-medium text-[#0e1726] text-xs mt-[16px] mb-[16px]">
      <p>{title}</p>
    </div>
  );
};

const NavbarButton = ({ title, path }) => {
  const currentPath = usePathname();

  return (
    <Link
      className={`w-full py-[12px] pl-[16px] bg-white text-[#0e1726] text-xs flex items-start hover:font-semibold transition-all ${
        path === currentPath ? "font-semibold" : ""
      }`}
      href={path}
    >
      <p>{title}</p>
    </Link>
  );
};

export const NavbarMerchant = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <nav className="w-64 bg-white rounded-tr-md rounded-br-md shadow flex-col justify-start items-start inline-flex">
      <div className="w-full px-2 my-[24px]">
        <Image src="/logo.svg" alt="Logo" width={136} height={70} />
      </div>
      <NavbarSection title="Strona Główna" />
      <NavbarButton title="Saldo tokenów" path="/merchant/dashboard" />
      <NavbarSection title="Pracownik" />
      <NavbarButton
        title="Konta pracowników"
        path="/merchant/employees"
      />      
      <NavbarButton title="Rozliczenia z pracownikami" path="/merchant/employees/payoff" />
      <NavbarButton
        title="Historia transakcji pracowników"
        path="/merchant/employees/transactions"
      />
      <NavbarSection title="Szkolenia" />
      <NavbarButton title="Lista szkoleń" path="/merchant/trainings" />
      <NavbarSection title="Konto" />
      <NavbarButton title="Ustawienia" path="/merchant/settings" />      
      <button
        className="w-full py-[12px] pl-[16px] bg-white text-mustard text-xs flex items-start hover:font-semibold transition-all border-t border-main-gray"
        onClick={openModal}
      >
        Wyloguj
      </button>

      {/* Modal */}
      <Modal isOpen={isModalOpen} closeModal={closeModal} title="Wyloguj się">
        <div className="text-sm text-gray-500 mb-4">
          Czy na pewno chcesz się wylogować?
        </div>
        <div className="flex flex-row gap-4">
          <ButtonMustard
            title="Wyloguj"
            onPress={() => signOut({ redirect: false })}
          />
          <ButtonGray title="Anuluj" onPress={closeModal} />
        </div>
      </Modal>
    </nav>
  );
};
