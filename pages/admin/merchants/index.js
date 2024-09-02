"use client";

import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { useTable, usePagination } from "@tanstack/react-table";
import { TokenTable } from "@/components/Tables/TokenTable";
import { MainComponent } from "@/components/MainComponent";
import { SearchBar } from "@/components/Inputs/SearchBar";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import { ButtonWhiteWithBorder } from "@/components/Buttons/ButtonWhiteWithBorder";
import Link from "next/link";
import { Modal } from "@/components/Modal";
import { ButtonRed } from "@/components/Buttons/ButtonRed";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { MulticolorTitleTile } from "@/components/Custom/MulticolorTitleTile";
import { MerchantCard } from "@/components/Custom/MerchantCard";
import { showToastNotificationSuccess } from "@/components/Custom/ToastNotification";

const data = [
  {
    id: 1234,
    merchantName: "KFC",
    merchantCompany: "KFC Sp. z o.o.",
    merchantType: "View",
  },
  {
    id: 1234,
    merchantName: "KFC",
    merchantCompany: "KFC Sp. z o.o.",
    merchantType: "View",
  },
  {
    id: 1234,
    merchantName: "KFC",
    merchantCompany: "KFC Sp. z o.o.",
    merchantType: "Edit",
  },
  {
    id: 1234,
    merchantName: "KFC",
    merchantCompany: "KFC Sp. z o.o.",
    merchantType: "View",
  },
  {
    id: 1234,
    merchantName: "KFC",
    merchantCompany: "KFC Sp. z o.o.",
    merchantType: "View",
  },
  {
    id: 1234,
    merchantName: "KFC",
    merchantCompany: "KFC Sp. z o.o.",
    merchantType: "View",
  },
  {
    id: 1234,
    merchantName: "KFC",
    merchantCompany: "KFC Sp. z o.o.",
    merchantType: "View",
  },
  {
    id: 1234,
    merchantName: "KFC",
    merchantCompany: "KFC Sp. z o.o.",
    merchantType: "Edit",
  },
  {
    id: 1234,
    merchantName: "KFC",
    merchantCompany: "KFC Sp. z o.o.",
    merchantType: "View",
  },
  {
    id: 1234,
    merchantName: "KFC",
    merchantCompany: "KFC Sp. z o.o.",
    merchantType: "View",
  },
  {
    id: 1234,
    merchantName: "KFC",
    merchantCompany: "KFC Sp. z o.o.",
    merchantType: "View",
  },
  {
    id: 1234,
    merchantName: "KFC",
    merchantCompany: "KFC Sp. z o.o.",
    merchantType: "View",
  },
  {
    id: 1234,
    merchantName: "KFC",
    merchantCompany: "KFC Sp. z o.o.",
    merchantType: "Edit",
  },
  {
    id: 1234,
    merchantName: "KFC",
    merchantCompany: "KFC Sp. z o.o.",
    merchantType: "View",
  },
  {
    id: 1234,
    merchantName: "KFC",
    merchantCompany: "KFC Sp. z o.o.",
    merchantType: "View",
  },
];

export default function Home() {
  //push to another page once page loads
  const [searchValue, setSearchValue] = useState(null);
  const [merchantType, setMerchantType] = useState("Merchant");
  const [filteredData, setFilteredData] = useState(data);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (merchantType === "View" || merchantType === "Edit") {
      const filtered = data.filter(
        (item) => item.merchantType === merchantType
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [merchantType]);

  return (
    <AdminLayout path={["Merchant", "Konta merchantów"]}>
      <MainComponent>
        <div className="w-full flex flex-row justify-between items-center">
          <h3 className="text-base font-semibold">Konta merchanta</h3>
          <Link href="merchants/create">
            <ButtonGray title="Dodaj merchanta" onPress={() => {}} />
          </Link>
        </div>
        <div className="flex flex-row items-center gap-4">
          <SearchBar
            value={searchValue}
            setValue={setSearchValue}
            extraCss="my-[32px]"
          />
          <select
            value={merchantType} // Bind value to merchantType state
            onChange={(e) => {
              setMerchantType(e.target.value);
            }}
            className="border border-main-gray rounded-md px-[8px] py-[6px] text-xs text-zinc-400 font-medium w-[220px]"
          >
            {["Merchant", "View", "Edit"].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
          {filteredData.length > 0 &&
            filteredData.map((item, index) => (
              <MerchantCard item={item} openModal={openModal} key={index} />
            ))}
        </div>

        <div className="w-full flex flex-row justify-between text-sm mt-[32px] h-[50px] items-center">
          <div className="text-zinc-950 flex flex-row items-center gap-[16px]">
            <p>Wyświetlono 11 z 11 elementów</p>
            <select
              value={10}
              onChange={(e) => {}}
              className="border border-main-gray rounded-md px-[16px] py-[6px]"
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-row gap-2 items-center justify-stretch text-black">
            <button className="rounded-full bg-[#ebefee] w-[24px] h-[24px] flex items-center justify-center">
              <Image src="/icons/arrow-left-black.svg" width={16} height={16} />
            </button>
            <p className="rounded-full bg-main-green text-white w-[30px] h-[30px] flex items-center justify-center">
              1
            </p>
            <button className="rounded-full bg-[#ebefee] w-[24px] h-[24px] flex items-center justify-center">
              <Image
                src="/icons/arrow-right-black.svg"
                width={16}
                height={16}
              />
            </button>
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          closeModal={closeModal}
          title="Czy na pewno chcesz usunąć Merchanta?"
        >
          <div className="text-sm text-gray-500 mb-4">
            Zatwierdź, by potwierdzić
          </div>
          <div className="flex flex-row gap-[8px]">
            <ButtonRed title="Zatwierdź" onPress={() => {
              closeModal();
              showToastNotificationSuccess("Usunięto konto merchanta", "Konto merchanta zostało usunięte");
            }} />
            <ButtonGray title="Anuluj" onPress={closeModal} />
          </div>
        </Modal>
      </MainComponent>
    </AdminLayout>
  );
}
