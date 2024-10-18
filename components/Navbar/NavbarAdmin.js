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
    <div className="py-[12px] pl-[16px] w-full bg-main-gray font-medium text-[#0e1726] text-xs mt-[16px] mb-[16px] ">
      <p>{title}</p>
    </div>
  );
};

const NavbarButton = ({ title, path, firstPath }) => {
  const currentPath = usePathname();
  const isActive = path === currentPath || path === `/admin/${firstPath}`;

  return (
    <Link
      className={`w-full py-[12px] pl-[16px] bg-white text-[#0e1726] text-xs flex items-start ${
        isActive ? "font-semibold" : ""
      }`}
      href={path}
    >
      <p className="hover:cursor-pointer hover:font-semibold w-full">{title}</p>
    </Link>
  );
};

export const NavbarAdmin = ({ firstPath}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <nav className="w-64 bg-white rounded-tr-md rounded-br-md shadow flex-col justify-start items-start inline-flex">
      <div className="w-full px-2 my-[24px]">
        <Link href="/admin/dashboard">
          <Image src="/logo.svg" alt="Logo" width={136} height={70} />
        </Link>
      </div>
      <NavbarSection title="Strona Główna" />
      <NavbarButton title="Dashboard" path="/admin/dashboard" firstPath={firstPath} />
      <NavbarSection title="Tokeny" />
      <NavbarButton
        title="Generowanie nowych tokenów"
        path="/admin/tokens/generate"
        firstPath={firstPath}
      />
      <NavbarSection title="Merchant" />
      <NavbarButton title="Konta merchantów" path="/admin/merchants" firstPath={firstPath} />
      <NavbarButton
        title="Rozliczenia z merchantami"
        path="/admin/merchants/payoff"
        firstPath={firstPath}
      />
      <NavbarButton
        title="Historia transkacji merchantów"
        path="/admin/merchants/history"
        firstPath={firstPath}
      />
      <NavbarButton title="Konta pracowników" path="/admin/employees" firstPath={firstPath} />
      <NavbarButton
        title="Rozliczenia z pracownikami"
        path="/admin/employees/payoff"
        firstPath={firstPath}
      />
      <NavbarButton
        title="Historia transakcji pracowników"
        path="/admin/employees/history"
        firstPath={firstPath}
      />
      <NavbarSection title="Szkolenia" />
      <NavbarButton title="Lista szkoleń" path="/admin/trainings" firstPath={firstPath} />
      <NavbarButton title="Kupione szkolenia" path="/admin/trainings/bought" firstPath={firstPath} />
      <NavbarSection title="Konto" />
      <NavbarButton title="Ustawienia" path="/admin/settings" firstPath={firstPath} />
      <NavbarButton title="Historia zmian" path="/admin/change-history" firstPath={firstPath} />
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
