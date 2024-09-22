import Image from "next/image";
import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

export default function TokenBalance() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: userData, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();
    
      return data;
    },
    enabled: !!userId, // Only run query when userId is available
  });

  return (
    <div className="min-h-[150px] bg-white w-full flex flex-col py-[22px] pl-[16px] items-start justify-between rounded shadow relative overflow-hidden">
      <div className="flex flex-col z-10">
        <p className="text-base font-semibold">Saldo tokenów</p>
        <div className="flex flex-row gap-2">
          <Image src="/icons/coin.svg" width={16} height={16} alt="coin" />
          <p className="text-sm">{isLoading ? 0 : userData?.tokens ?? 0}</p>
        </div>
      </div>
      <Link href="tokens/generate">
        <ButtonGreen title="Sprawdź saldo" className="z-10" />
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
}