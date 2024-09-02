import { MainComponent } from "@/components/MainComponent";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import { SearchBar } from "@/components/Inputs/SearchBar";
import Image from "next/image";
import { useState } from "react";
import { Modal } from "@/components/Modal";
import { ButtonRed } from "@/components/Buttons/ButtonRed";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import Link from "next/link";
import { TrainingsBoughtTable } from "@/components/Tables/TrainingsBoughtTable";
import { SelectDropdown } from "@/components/Inputs/SelectDropdown";

export default function Settings() {
  const [searchValue, setSearchValue] = useState("");
  const [merchantType, setMerchantType] = useState("");
  const [selectedRowValues, setSelectedRowValues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([{id: '5435', buyer: "Pracownik", price: 500, name: "Marketing internetowy", category: "Marketing"}]);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false); 

  return (
    <AdminLayout path={["Szkolenia", "Lista szkoleń", "Kupione szkolenia"]}>
      <MainComponent>
      <div className="flex flex-row justify-between items-center">
          <p className="text-zinc-950 text-base font-semibold leading-normal">
            Kupione szkolenia
          </p>
          <Link href="/admin/trainings/create">
            <ButtonGreen title="Dodaj szkolenie" />
          </Link>
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
            options={["Kategoria", "Marketing"]}
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
        <TrainingsBoughtTable tableData={data} setSelectedRowValues={setSelectedRowValues} />

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          closeModal={closeModal}
          title="Czy na pewno chcesz usunąć Pracownika?"
        >
          <div className="text-sm text-gray-500 mb-4">
            Zatwierdź, by potwierdzić
          </div>
          <div className="flex flex-row gap-[8px]">
            <ButtonRed
              title="Zatwierdź"
              onPress={() => {
                closeModal();
                showToastNotificationSuccess(
                  "Sukces!",
                  "Pracownik został usunięty"
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
