import { MainComponent } from "@/components/MainComponent";
import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import { SearchBar } from "@/components/Inputs/SearchBar";
import { useState } from "react";
import Image from "next/image";
import { TrainingTile } from "@/components/Custom/TrainingTile";
import Link from "next/link";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { SelectDropdown } from "@/components/Inputs/SelectDropdown";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/Modal";
import { ButtonRed } from "@/components/Buttons/ButtonRed";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import { showToastNotificationSuccess, showToastNotificationError } from "@/components/Custom/ToastNotification";

export default function Home() {
  const [searchValue, setSearchValue] = useState(null);  
  const [merchantType, setMerchantType] = useState("");
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isModalDuplicateOpen, setIsModalDuplicateOpen] = useState(false);
  const [trainingIdToDelete, setTrainingIdToDelete] = useState(null);
  const [trainingIdToDuplicate, setTrainingIdToDuplicate] = useState(null);
  const queryClient = useQueryClient();
  
  // useQuery for fetching all trainings
  const { data: trainigs, isPending } = useQuery({
    queryKey: ['trainings'],
    queryFn: async () => {
      const response = await fetch("/api/trainings/fetch-all");
      const data = await response.json();

      console.log(data);
      return data;
    },    
  });

  // useMutation for deleting a training
  const { mutate: deleteTraining, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/trainings/delete?id=${trainingIdToDelete}`);
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      showToastNotificationSuccess("Sukces", "Szkolenie zostało usunięte");
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
      setIsModalDeleteOpen(false);
    },
    onError: () => {
      showToastNotificationError("Błąd", "Wystąpił błąd podczas usuwania szkolenia");
    },
  });

  // useMutation for duplicating a training
  const { mutate: duplicateTraining, isPending: isDuplicating } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/trainings/duplicate?id=${trainingIdToDuplicate}`);
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      showToastNotificationSuccess("Sukces", "Szkolenie zostało zduplikowane");
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
      setIsModalDuplicateOpen(false);
    },
    onError: () => {
      showToastNotificationError("Błąd", "Wystąpił błąd podczas zduplikowania szkolenia");
    },
  });

  const openDeleteModal = (id) => {
    setIsModalDeleteOpen(true);
    setTrainingIdToDelete(id);
  }

  const openDuplicateModal = (id) => {
    setIsModalDuplicateOpen(true);
    setTrainingIdToDuplicate(id);
  }

  if (isPending) return <div className="flex items-center justify-center h-screen">Ładowanie...</div>;

  return (
    <AdminLayout path={["Szkolenia", "Lista Szkoleń"]}>
      <MainComponent>
        <div className="flex flex-row justify-between items-center mb-6">
          <p className="text-zinc-950 text-base font-semibold leading-normal">
            Lista Szkoleń
          </p>
          <Link href="/admin/trainings/create">
            <ButtonGreen title="Dodaj szkolenie" />
          </Link>
        </div>
        <div className="flex flex-row items-center gap-4 mb-6">
          <SearchBar value={searchValue} setValue={setSearchValue} />
          <SelectDropdown
              value={merchantType}
            setValue={setMerchantType}
            options={["Kategoria", "Marketing"]}
            extraCss=""
          />
        </div>
        <div className="space-y-4">
          {trainigs.map((training, i) => (
            <TrainingTile key={i} training={training} onDelete={() => openDeleteModal(training.id)} onDuplicate={() => openDuplicateModal(training.id)} />
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
          isOpen={isModalDeleteOpen}
          closeModal={() => setIsModalDeleteOpen(false)}
          title="Czy na pewno chcesz usunąć szkolenie?"
        >
          <div className="text-sm text-gray-500 mb-4">
            Zatwierdź, by potwierdzić
          </div>
          <div className="flex flex-row gap-[8px]">
            <ButtonRed title="Usuń" onPress={() => deleteTraining()} />
            <ButtonGray title="Anuluj" onPress={() => setIsModalDeleteOpen(false)} />
          </div>
        </Modal>
        <Modal
          isOpen={isModalDuplicateOpen}
          closeModal={() => setIsModalDuplicateOpen(false)}
          title="Czy na pewno chcesz zduplikować szkolenie?"
        >
          <div className="text-sm text-gray-500 mb-4">
            Zatwierdź, by potwierdzić
          </div>
          <div className="flex flex-row gap-[8px]">
            <ButtonGreen title="Zduplikuj" onPress={() => duplicateTraining()} />
            <ButtonGray title="Anuluj" onPress={() => setIsModalDuplicateOpen(false)} />
          </div>
        </Modal>
      </MainComponent>
    </AdminLayout>
  );
}
