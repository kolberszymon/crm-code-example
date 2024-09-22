import Image from "next/image";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

export default function TokenBalance() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: userData, isLoading } = useQuery({
    queryKey: ['user-token-balance', userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();
    
      return data;
    },
    enabled: !!userId, // Only run query when userId is available
  });

  return (
    <div className="flex flex-row gap-1 items-center mt-[8px] mb-[24px]">
    <p className="text-[#0e1726] text-xs font-semibold">Saldo:</p>
    <Image
      src="/icons/coin.svg"
      width={16}
      height={16}
      className="w-[16px] h-[16px]"
      alt="coin"
    />
      <p className="text-[#0e1726] text-xs font-normal">{userData?.tokens ? userData?.tokens : 0}</p>
    </div>
  );
}