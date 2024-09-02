import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import Image from "next/image";
import { useState, useMemo } from "react";
import { MainComponent } from "@/components/MainComponent";
import { SearchBar } from "@/components/Inputs/SearchBar";
import { Modal } from "@/components/Modal";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import { showToastNotificationSuccess } from "@/components/Custom/ToastNotification";
import { EmployeesAccountTable } from "@/components/Tables/EmployeesAccountTable";
import { SelectDropdown } from "@/components/Inputs/SelectDropdown";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { EmployeesPayoffTable } from "@/components/Tables/EmployeesPayoffTable";

export default function Home() {
  //push to another page once page loads
  const data = useMemo(
    () => [
      {
        name: "Jan Kowalski",
        payment: "Auto",
        merchant: "Salon urody Beauty",
        balance: 1000,
        isPaymentRecurrent: false,
      },
      {
        name: "Jan Pszczoła",
        payment: "Auto",
        merchant: "Salon urody Beauty",
        balance: 1000,
        isPaymentRecurrent: true,
      },
    ],
    []
  );

  const [searchValue, setSearchValue] = useState(null);
  const [merchantType, setMerchantType] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [selectedRowValues, setSelectedRowValues] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <AdminLayout path={["Merchant", "Rozliczenia z pracownikami"]}>
      <MainComponent>
        <div className="flex flex-row justify-between items-center">
          <p className="text-zinc-950 text-base font-semibold leading-normal">
            Rozliczenia z pracownikami
          </p>

          <ButtonGreen
            title="Wyślij przelew"
            onPress={openModal}
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
            <SelectDropdown
              value={paymentType}
              setValue={setPaymentType}
              options={["Płatność", "Auto", "Manual"]}
              extraCss=""
            />
          </div>
          <div className="flex flex-row gap-[8px]">
            <button
              className="p-[8px] bg-[#f6f7f8] rounded-full hover:bg-gray-200 transition-colors disabled:hover:bg-[#f6f7f8]"
              disabled={selectedRowValues.length === 0}
              onClick={() => {
                openModal();
              }}
            >
              <Image
                src="/icons/trash.svg"
                width={16}
                height={16}
                alt="download icon"
              />
            </button>
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
        </div>
        <EmployeesPayoffTable
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