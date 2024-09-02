import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import Image from "next/image";
import { useState, useMemo } from "react";
import { TokenTable } from "@/components/Tables/TokenTable";
import { MainComponent } from "@/components/MainComponent";
import { SearchBar } from "@/components/Inputs/SearchBar";
import { Modal } from "@/components/Modal";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { showToastNotificationSuccess } from "@/components/Custom/ToastNotification";

const data = [
  {
    id: 5485,
    date: "12.06.2024",
    time: "12:54:00",
    balance: 100000,
    transactionAmount: 100000,
  },
  {
    id: 5486,
    date: "11.06.2024",
    time: "12:54:00",
    balance: 110000,
    transactionAmount: 110000,
  },
];

export default function Home() {
  //push to another page once page loads
  const [tokenNumber, setTokenNumber] = useState(0);
  const [tableSearch, setTableSearch] = useState("");
  const [selectedRowValues, setSelectedRowValues] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <AdminLayout path={["Tokeny", "Generowanie nowych tokenów"]}>
      <MainComponent>
        <p className="text-zinc-950 text-base font-semibold leading-normal">
          Generowanie nowych tokenów
        </p>
        <div className="flex flex-row gap-1 items-center mt-[8px] mb-[24px]">
          <p className="text-[#0e1726] text-xs font-semibold">Saldo:</p>
          <Image
            src="/icons/coin.svg"
            width={16}
            height={16}
            className="w-[16px] h-[16px]"
            alt="coin"
          />
          <p className="text-[#0e1726] text-xs font-normal">100 000</p>
        </div>
        <p className="text-[#0e1726] text-xs font-medium leading-normal mb-[8px]">
          Wpisz liczbę tokenów
        </p>
        <div className="flex flex-row gap-[16px]">
          <input
            type="text"
            placeholder="100 000"
            value={tokenNumber}
            className="border border-zinc-400  px-[16px] py-[8px] rounded-md text-black text-neutral-600 text-sm font-normal" 
            onChange={(e) => setTokenNumber(e.target.value)}
          />
          <ButtonGreen title={"Wygeneruj tokeny"} onPress={openModal} disabled={tokenNumber <= 0} />
        </div>
        <p className="text-[#0e1726] text-base font-medium leading-normal my-[32px]">
          Wygenerowane tokeny
        </p>
        <div className="flex flex-row items-center justify-between mb-[32px]">
          <SearchBar
            value={tableSearch}
            setValue={setTableSearch}
          extraCss=""
          />
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
        <TokenTable tableData={data || []} setSelectedRowValues={setSelectedRowValues} />
        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          closeModal={closeModal}
          title="Czy na pewno chcesz wygenerować tokeny?"
        >
          <div className="text-sm text-gray-500 mb-4">
            Zatwierdź, by potwierdzić
          </div>
          <div className="flex flex-row gap-[8px]">
            <ButtonGreen title="Zatwierdź" onPress={() => {
              closeModal();
              showToastNotificationSuccess("Generowanie Tokenów", "Tokeny zostały wygenerowane");
            }} />
            <ButtonGray title="Anuluj" onPress={closeModal} />
          </div>
        </Modal>
      </MainComponent>
    </AdminLayout>
  );
}
