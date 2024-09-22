import Image from "next/image";
import { AuthLayout } from "@/components/Layouts/AuthLayout";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import Link from "next/link";
import { useRouter } from "next/router";
import { format } from "date-fns";

export default function Trainings() {
  const router = useRouter();
  const { id } = router.query;

  const [searchValue, setSearchValue] = useState("");

  // useQuery to fetch trainings
  const { data: training, isPending } = useQuery({
    queryKey: ['training-store'],
    queryFn: async () => {
      const res = await fetch(`/api/trainings/fetch-one-without-pdf?id=${id}`);

      const data = await res.json();
      console.log(data);
      return data;
    },
    enabled: !!id,
  });

  if (isPending) return <div className="flex items-center justify-center h-screen">Ładowanie...</div>;

  return (
    <AuthLayout>
      <div className="flex flex-col items-center">
        <Link href="/login">
          <Image src="/logo.svg" width={241} height={62} alt="logo" />
        </Link>
        <div className="flex flex-col p-[16px] my-[40px] rounded-3xl overflow-hidden border border-main-green w-[1100px] min-h-screen bg-white">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col w-full">
            <div className="flex flex-row gap-[4px] mb-[42px]">
              {["Lista szkoleń", "Opis szkolenia"].map((path, index) => {
                if (index === 0) {
                  return (
                    <p className="text-[#015640] text-xs font-normal">
                      {path}
                    </p>
                  );
                } else {
                  return (
                    <>
                      <Image src="/icons/arrow-right.svg" width={16} height={16} alt="arrow-right" />
                      <p className="text-[#0e1726] text-xs font-normal">
                        {path}
                      </p>
                    </>
                  )
                }
              })}
            </div>
            <div className="flex flex-row gap-4 text-gray-600 mt-2 justify-between w-full">
              <h3 className="text-base font-semibold text-zinc-950">
                {training.title}
              </h3>
              <Link href={`/trainings/buy/${training.id}`}>
                <ButtonGreen title={"Przejdź do zamówienia"} />
              </Link>
            </div>
            <div className="flex flex-row gap-4 text-gray-600 mt-2">
              <div className="flex items-center gap-1">
                <Image
                  src="/icons/calendar-icon.svg"
                  alt="calendar"
                  width={16}
                  height={16}
                />
                <span className="text-sm font-normal">{format(new Date(training.createdAt), 'dd.MM.yyyy')}</span>
              </div>
            </div>
            <p className="text-zinc-950 text-sm font-normal mt-[16px]">Po wykonanej płatności otrzymasz na swoją skrzynkę mailową plik z gotowym szkoleniem.</p>
            <p className="text-[#015640] text-sm font-semibold mt-[16px]">Cena: {training.pricePln} zł</p>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-6 mt-6">
          <p className="text-gray-700 text-sm">
            {training.introduction}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          <p className="text-sm">
            {training.description}
          </p>
        </div>

          
          
        </div>
      </div>
    </AuthLayout>
  );
}
