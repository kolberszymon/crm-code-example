import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import Link from "next/link";

export const TransactionsToSend = () => {
  const { data: transactionsToSend } = useQuery({
    queryKey: ["transactions-fetch-all-nierozliczone"],
    queryFn: async () => {
      const res = await fetch("/api/transactions/fetch-all-nierozliczone");
      const data = await res.json();

      console.log(data)
      return data;
    },
  });

  return (
    <div className="min-h-[150px] bg-white w-full flex flex-col py-[22px] pl-[16px] items-start justify-between rounded shadow relative overflow-hidden">
      <div className="flex flex-col z-10">
        <p className="text-base font-semibold">
          Transakcje do zrealizowania
        </p>

        <p className="text-sm">{transactionsToSend ?? 0}</p>
      </div>
      <Link href="/admin/employees/history?transferStatus=NIEROZLICZONE">
        <ButtonGreen title="Sprawdź transakcje" className="z-10" />
      </Link>
      <Image
        src="/icons/elipse.png"
        width={180}
        height={400}
        className="absolute right-0 top-0 bottom-0 opacity-30"
        alt="elipse"
      />
      <Image
        src="/icons/horse.png"
        width={216}
        height={240}
        className="absolute right-0 bottom-0"
        alt="horse"
      />
    </div>
  );
};