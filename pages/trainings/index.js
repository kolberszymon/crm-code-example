import Image from "next/image";
import { AuthLayout } from "@/components/Layouts/AuthLayout";
import { SearchBar } from "@/components/Inputs/SearchBar";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import { ButtonWhiteWithBorder } from "@/components/Buttons/ButtonWhiteWithBorder";

const TrainingStoreTile = ({ training }) => {
  return (
    <div className="flex flex-row px-[16px] py-[8px] border border-zinc-200 rounded-md gap-[30px]">
      <div className="flex flex-col justify-between w-[80%]">
        <p className="text-zinc-950 text-sm font-medium leading-normal">{training.title}</p>
        <p className="text-zinc-600 text-xs font-normal">{training.introduction}</p>
        <p className="text-main-green text-sm font-semibold">Cena: {training.pricePln} zł</p>
      </div>
      <div className="flex flex-col flex-1 justify-center gap-[8px]">
        <ButtonGreen title="Kupuję szkolenie" />
        <ButtonWhiteWithBorder title="Zobacz opis" />
      </div>
    </div>
  );
}

export default function Trainings() {
  const [searchValue, setSearchValue] = useState("");

  // useQuery to fetch trainings
  const { data: trainings, isPending } = useQuery({
    queryKey: ['trainings'],
    queryFn: async () => {
      const res = await fetch(`/api/trainings/fetch-all`);

      const data = await res.json();
      console.log(data);
      return data;
    },
  });

  return (
    <AuthLayout>
      <div className="flex flex-col items-center">
        <Image src="/logo.svg" width={241} height={62} alt="logo" />
        <div className="flex flex-col p-[16px] my-[40px] rounded-3xl overflow-hidden border border-main-green w-[1100px] min-h-screen bg-white">
          <p className="text-zinc-950 text-base font-semibold mb-[32px]">Lista do 99% taniej dla użytkowników naszej platformy</p>
          <p className="text-zinc-950 text-base font-semibold mb-[32px]">Lista szkoleń</p>
          <SearchBar value={searchValue} setValue={setSearchValue} placeholder="Wpisz nazwę szkolenia" extraCss="mb-[32px]" />
          {isPending ? <div>Ładowanie...</div> : <div className="flex flex-col gap-[16px]">{trainings.map((training) => <TrainingStoreTile key={training.id} training={training} />)}</div>}
        </div>
      </div>
    </AuthLayout>
  );
}
