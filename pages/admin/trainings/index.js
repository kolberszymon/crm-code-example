import { MainComponent } from "@/components/MainComponent";
import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import { SearchBar } from "@/components/Inputs/SearchBar";
import { useState } from "react";
import Image from "next/image";
import { TrainingTile } from "@/components/Custom/TrainingTile";
import Link from "next/link";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { SelectDropdown } from "@/components/Inputs/SelectDropdown";

export default function Home() {
  const [searchValue, setSearchValue] = useState(null);
  const [trainingCategory, setTrainingCategory] = useState("");
  const [merchantType, setMerchantType] = useState("");

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
          {[...Array(6)].map((_, i) => (
            <TrainingTile key={i} />
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
      </MainComponent>
    </AdminLayout>
  );
}
