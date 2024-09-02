import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import Image from "next/image";
import { useState, useMemo } from "react";
import { MainComponent } from "@/components/MainComponent";
import { SearchBar } from "@/components/Inputs/SearchBar";
import { Modal } from "@/components/Modal";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import { showToastNotificationSuccess } from "@/components/Custom/ToastNotification";
import { SelectDropdown } from "@/components/Inputs/SelectDropdown";
import { EmployeesHistoryTable } from "@/components/Tables/EmployeesHistoryTable";
import AdminLayout from "@/components/Layouts/AdminLayout";

export default function Home() {
  //push to another page once page loads
  const [data, setData] = useState([
      {
        id: 5485,
        recipent: "Jan Kowalski",
        date: "20.06.2024",
        hour: "12:00:00",
        accountNumber: "1234567890",
        amount: 2000,
        transactionStatus: "Do rozliczenia",
        transferStatus: "Nierozliczone",
      },
      {
        id: 5485,
        recipent: "Jan Kowalski",
        date: "20.06.2024",
        hour: "12:00:00",
        accountNumber: "1234567890",
        amount: 2000,
        transactionStatus: "Pracownik-pracownik",
        transferStatus: "Rozliczone",
      },
      {
        id: 5485,
        recipent: "Jan Kowalski",
        date: "20.06.2024",
        hour: "12:00:00",
        accountNumber: "1234567890",
        amount: 2000,
        transactionStatus: "Zakup szkolenia",
        transferStatus: null,
      },
      {
        id: 5485,
        recipent: "Jan Kowalski",
        date: "20.06.2024",
        hour: "12:00:00",
        accountNumber: "1234567890",
        amount: 2000,
        transactionStatus: "Zasilono",
        transferStatus: null,
      },
      {
        id: 5485,
        recipent: "Jan Kowalski",
        date: "20.06.2024",
        hour: "12:00:00",
        accountNumber: "1234567890",
        amount: 2000,
        transactionStatus: "Zakończono",
        transferStatus: "Rozliczone",
    },
  ]);

  const [searchValue, setSearchValue] = useState(null);
  const [merchantType, setMerchantType] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [selectedRowValues, setSelectedRowValues] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <AdminLayout path={["Merchant", "Historia transakcji pracowników"]}>
      <MainComponent>
        <div className="flex flex-row justify-between items-center">
          <p className="text-zinc-950 text-base font-semibold leading-normal">
            Historia transkacji pracowników
          </p>

          <ButtonGreen
            title="Zmień status"
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
        <EmployeesHistoryTable
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
