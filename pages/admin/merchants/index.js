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
import { showToastNotificationSuccess, showToastNotificationError } from "@/components/Custom/ToastNotification";
import { SelectDropdown } from "@/components/Inputs/SelectDropdown";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [merchantType, setMerchantType] = useState("Merchant");
  const [tableSize, setTableSize] = useState(10);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMerchantId, setSelectedMerchantId] = useState(null);

  const { data: merchantsRaw } = useQuery({
    queryKey: ["merchants-all"],
    queryFn: async () => {
      const response = await fetch("/api/merchant/fetch-all");
      const data = await response.json();
      return data;
    }
  });

  // useMutation to deactivate merchant
  const { mutate: deactivateMerchant, isPending } = useMutation({
    mutationFn: async (merchantId) => {
      console.log("Deactivating merchant:", merchantId);
      const response = await fetch(`/api/merchant/deactivate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: merchantId }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      return data;
    },
    onSuccess: () => {
      setIsModalOpen(false);
      showToastNotificationSuccess("Sukces", "Merchant został zdeaktywowany");
    },
    onError: () => {
      setIsModalOpen(false);
      showToastNotificationError("Błąd", "Wystąpił błąd podczas deaktywowania merchanta");
    }
  });

  const merchants = useMemo(() => {
    if (!merchantsRaw) return [];
    
    console.log(merchantsRaw)



    const merchants = merchantsRaw.map((merchant) => {

      let merchantName;

      if (!merchant.merchantData.firstName && !merchant.merchantData.lastName) {
        merchantName = "-";
      } else {
        merchantName = merchant.merchantData.firstName + " " + merchant.merchantData.lastName;
      }

      return {
        id: merchant.merchantData.id,
        merchantName,
        merchantCompany: merchant.merchantData.merchantName,
        accountType: merchant.merchantData.accountType,
      }
    });

    return merchants;
  }, [merchantsRaw]);


  const filteredData = useMemo(() => {
    let filteredMerchants = merchants;

    if (!merchants) return [];
    
    if (merchantType === "Edit") {
      filteredMerchants = merchants.filter((merchant) => merchant.accountType === "Edit");
    } else if (merchantType === "View") {
      filteredMerchants = merchants.filter((merchant) => merchant.accountType === "View");
    }

    return filteredMerchants.filter((merchant) => merchant.merchantName.toLowerCase().includes(searchValue.toLowerCase()) || merchant.merchantCompany.toLowerCase().includes(searchValue.toLowerCase()));
  }, [merchants, merchantType, searchValue]);

  const handleOpenModal = (merchantId) => {
    setSelectedMerchantId(merchantId);
    setIsModalOpen(true);    
  }

  const handleDeactivateMerchant = () => {
    if (selectedMerchantId) {
      deactivateMerchant(selectedMerchantId);
    }
  }

  if (isPending) {
    return <div className="flex justify-center items-center h-screen">Ładowanie...</div>
  }

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
            filteredData.slice((page - 1) * tableSize, page * tableSize).map((item, index) => (
              <MerchantCard item={item} openModal={() => handleOpenModal(item.id)} key={index} />
            )) :
            <div className="text text-gray-500 text-sm">Brak merchantów</div>
          }
        </div>

        <div className="w-full flex flex-row justify-between text-sm mt-[32px] h-[50px] items-center">
          <div className="text-zinc-950 flex flex-row items-center gap-[16px]">
            <p>Wyświetlono {filteredData.length < tableSize ? filteredData.length : tableSize} z {merchants.length} elementów</p>
            <select
              value={tableSize}
              onChange={(e) => setTableSize(e.target.value)}
              className="border border-main-gray rounded-md px-[16px] py-[6px]"
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size} onChange={(e) => setTableSize(e.target.value)}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-row gap-2 items-center justify-stretch text-black">
            <button className="rounded-full bg-[#ebefee] w-[24px] h-[24px] flex items-center justify-center" onClick={() => {setPage(page - 1)}} disabled={page === 1}>
              <Image
                src="/icons/arrow-left-black.svg"
                width={16}
                height={16}
                alt="arrow-left"
              />
            </button>
            <p className="rounded-full bg-main-green text-white w-[30px] h-[30px] flex items-center justify-center">
              {page}
            </p>
            <button className="rounded-full bg-[#ebefee] w-[24px] h-[24px] flex items-center justify-center" onClick={() => setPage(page + 1)} disabled={page === Math.ceil(filteredData.length / tableSize)}>
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
            <ButtonRed title="Zatwierdź" onPress={handleDeactivateMerchant} />
            <ButtonGray title="Anuluj" onPress={() => setIsModalOpen(false)} />
          </div>
        </Modal>
      </MainComponent>
    </AdminLayout>
  );
}
