import Image from "next/image";
import { useState, useMemo } from "react";
import { MainComponent } from "@/components/MainComponent";
import { SearchBar } from "@/components/Inputs/SearchBar";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import Link from "next/link";
import { Modal } from "@/components/Modal";
import { ButtonRed } from "@/components/Buttons/ButtonRed";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { MerchantCard } from "@/components/Custom/MerchantCard";
import { showToastNotificationSuccess } from "@/components/Custom/ToastNotification";
import { SelectDropdown } from "@/components/Inputs/SelectDropdown";
import { useQuery } from "@tanstack/react-query";


export default function Home() {
  const [searchValue, setSearchValue] = useState(null);
  const [merchantType, setMerchantType] = useState("Merchant");
  const [tableSize, setTableSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: merchantsRaw, isLoading } = useQuery({
    queryKey: ["merchants-all"],
    queryFn: async () => {
      const response = await fetch("/api/merchant/fetch-all");
      const data = await response.json();
      return data;
    }
  });

  const merchants = useMemo(() => {
    if (!merchantsRaw) return [];
    
    const merchants = merchantsRaw.map((merchant) => ({
      id: merchant.id,
      merchantName: merchant.firstName + " " + merchant.lastName,
      merchantCompany: merchant.merchantName,
      accountType: merchant.accountType,
    }));

    return merchants;
  }, [merchantsRaw]);


  const filteredData = useMemo(() => {
    if (!merchants) return [];
    
    if (merchantType === "Merchant") {
      return merchants;
    }

    return merchants.filter((merchant) => merchant.accountType === merchantType);
  }, [merchants, merchantType]);

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
          <SelectDropdown
            value={merchantType}
            setValue={setMerchantType}
            options={["Merchant", "View", "Edit"]}
            extraCss=""
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
          {filteredData.length > 0 ?
            filteredData.map((item, index) => (
              <MerchantCard item={item} openModal={() => setIsModalOpen(true)} key={index} />
            )) :
            <div className="text text-gray-500 text-sm">Brak merchantów</div>
          }
        </div>

        <div className="w-full flex flex-row justify-between text-sm mt-[32px] h-[50px] items-center">
          <div className="text-zinc-950 flex flex-row items-center gap-[16px]">
            <p>Wyświetlono {merchants.length < tableSize ? merchants.length : tableSize} z {merchants.length} elementów</p>
            <select
              value={tableSize}
              onChange={(e) => setTableSize(e.target.value)}
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
              <Image
                src="/icons/arrow-left-black.svg"
                width={16}
                height={16}
                alt="arrow-left"
              />
            </button>
            <p className="rounded-full bg-main-green text-white w-[30px] h-[30px] flex items-center justify-center">
              1
            </p>
            <button className="rounded-full bg-[#ebefee] w-[24px] h-[24px] flex items-center justify-center">
              <Image
                src="/icons/arrow-right-black.svg"
                width={16}
                height={16}
                alt="arrow-right"
              />
            </button>
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          title="Czy na pewno chcesz usunąć Merchanta?"
        >
          <div className="text-sm text-gray-500 mb-4">
            Zatwierdź, by potwierdzić
          </div>
          <div className="flex flex-row gap-[8px]">
            <ButtonRed title="Zatwierdź" onPress={() => {
              setIsModalOpen(false);
              showToastNotificationSuccess("Usunięto konto merchanta", "Konto merchanta zostało usunięte");
            }} />
            <ButtonGray title="Anuluj" onPress={() => setIsModalOpen(false)} />
          </div>
        </Modal>
      </MainComponent>
    </AdminLayout>
  );
}
