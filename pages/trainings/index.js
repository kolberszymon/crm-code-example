import Image from "next/image";
import { AuthLayout } from "@/components/Layouts/AuthLayout";
import { SearchBar } from "@/components/Inputs/SearchBar";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import { ButtonWhiteWithBorder } from "@/components/Buttons/ButtonWhiteWithBorder";
import Link from "next/link";
import { useRouter } from "next/router";

const TrainingStoreTile = ({ training }) => {
  const router = useRouter();
  
  return (
    <div className="flex flex-row px-[16px] py-[8px] border border-zinc-200 rounded-md gap-[30px]">
      <div className="flex flex-col justify-between w-[80%]">
        <p className="text-zinc-950 text-sm font-medium leading-normal">{training.title}</p>
        <p className="text-zinc-600 text-xs font-normal">{training.introduction}</p>
        <p className="text-main-green text-sm font-semibold">Cena: {training.pricePln} zł</p>
      </div>
      <div className="flex flex-col flex-1 justify-center gap-[8px]">        
        <ButtonGreen title="Kupuję szkolenie" onPress={() => {
          router.push(`/trainings/buy/${training.id}`);
        }}/>        
        <ButtonWhiteWithBorder title="Zobacz opis" onPress={() => {
          router.push(`/trainings/${training.id}`);
        }}/>        
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
        <Link href="/login">
          <Image src="/logo.svg" width={241} height={62} alt="logo" />
        </Link>
        <div className="flex flex-col p-[16px] my-[40px] rounded-3xl overflow-hidden border border-main-green w-[1100px] min-h-screen bg-white">
          <div className="text-white text-base font-normal mb-[32px] bg-[#015640] py-[6px] flex items-center justify-center rounded-[6px]"><p>Szkolenia do 97% taniej dla użytkowników naszej platformy <Link href="/" className="text-white text-base font-semibold underline">zobacz więcej</Link></p></div>
          <p className="text-zinc-950 text-base font-semibold mb-[32px]">Lista szkoleń</p>
          <SearchBar value={searchValue} setValue={setSearchValue} placeholder="Wpisz nazwę szkolenia" extraCss="mb-[32px]" />
          {isPending ? <div>Ładowanie...</div> : <div className="flex flex-col gap-[16px]">{trainings.filter((training) => training.title.toLowerCase().includes(searchValue.toLowerCase())).map((training) => <TrainingStoreTile key={training.id} training={training} />)}</div>}
        </div>
      </div>
    </AuthLayout>
  );
}
