import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import Image from "next/image";
import { useState, useMemo } from "react";
import { MainComponent } from "@/components/MainComponent";
import { SearchBar } from "@/components/Inputs/SearchBar";
import { MerchantPayoffTable } from "@/components/Tables/MerchantPayoffTable";
import { Modal } from "@/components/Modal";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import { showToastNotificationSuccess } from "@/components/Custom/ToastNotification";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { SelectDropdown } from "@/components/Inputs/SelectDropdown";

export default function Home() {
  //push to another page once page loads
  const data = useMemo(
    () => [
      {
        merchantName: "Mechanik Good car",
        merchantType: "View",
        merchantBalance: 100000,
        topUpAmount: 100000,
        transactionAmount: 100000,
      },
      {
        merchantName: "Masazysta relax",
        merchantType: "Edit",
        merchantBalance: 100000,
        topUpAmount: 100000,
        transactionAmount: 100000,
      },
    ],
    []
  );

  const [searchValue, setSearchValue] = useState(null);
  const [merchantType, setMerchantType] = useState("");
  const [selectedRowValues, setSelectedRowValues] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <AdminLayout path={["Merchant", "Rozliczenia z Merchantami"]}>
      <MainComponent>
        <div className="flex flex-row justify-between items-center">
          <p className="text-zinc-950 text-base font-semibold leading-normal">
            Rozliczenia z Merchantami
          </p>
          <ButtonGreen
            title="Wyślij przelew"
            onPress={() => {
              openModal();
            }}
            disabled={selectedRowValues.length === 0}
          />
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-4 my-[32px]">
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
          <button
            className="p-[8px] bg-[#f6f7f8] rounded-full hover:bg-gray-200 transition-colors disabled:hover:bg-[#f6f7f8]"
            disabled={selectedRowValues.length === 0}
          >
            <Image
              src="/icons/download-icon.svg"
              width={16}
              height={16}
              alt="download icon"
            />
          </button>
        </div>
        <MerchantPayoffTable
          tableData={data}
          setSelectedRowValues={setSelectedRowValues}
        />

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          closeModal={closeModal}
          title="Czy na pewno chcesz przesłać tokeny?"
        >
          <div className="text-sm text-gray-500 mb-4">
            Zatwierdź, by potwierdzić
          </div>
          <div className="flex flex-row gap-[8px]">
            <ButtonGreen
              title="Zatwierdź"
              onPress={() => {
                closeModal();
                showToastNotificationSuccess(
                  "Sukces!",
                  "Tokeny zostały przesłane"
                );
              }}
            />
            <ButtonGray title="Anuluj" onPress={closeModal} />
          </div>
        </Modal>
      </MainComponent>
    </AdminLayout>
  );
}
