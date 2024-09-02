import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import { useState } from "react";
import { MainComponent } from "@/components/MainComponent";
import { SearchBar } from "@/components/Inputs/SearchBar";
import { Modal } from "@/components/Modal";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import { MerchantHistoryTable } from "@/components/Tables/MerchantHistoryTable";
import AdminLayout from "@/components/Layouts/AdminLayout";

const data = [
  {
    id: 5485,
    merchant: "Mechanik Good car",
    date: "12.06.2024",
    time: "12:54:00",
    balance: 100000,
    transactionAmount: 100000,
  },
  {
    id: 5486,
    merchant: "Mechanik Good car",
    date: "12.06.2024",
    time: "12:54:00",
    balance: 110000,
    transactionAmount: 110000,
  },
];

export default function Home() {
  //push to another page once page loads
  const [tokenNumber, setTokenNumber] = useState(0);
  const [tableSearch, setTableSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <AdminLayout path={["Merchant", "Historia transakcji merchantów"]}>
      <MainComponent>
        <p className="text-zinc-950 text-base font-semibold leading-normal mb-[32px]">
          Historia rozliczeń merchantów
        </p>

        <SearchBar
          value={tableSearch}
          setValue={setTableSearch}
          extraCss="mb-[32px]"
        />
        <MerchantHistoryTable tableData={data || []} />
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
            <ButtonGreen title="Zatwierdź" onPress={() => {}} />
            <ButtonGray title="Anuluj" onPress={closeModal} />
          </div>
        </Modal>
      </MainComponent>
    </AdminLayout>
  );
}
