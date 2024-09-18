"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainComponent } from "@/components/MainComponent";
import MerchantLayout from "@/components/Layouts/MerchantLayout";
import TokenBalanceMerchant from "@/components/pages/dashboard/TokenBalanceMerchant";
import { SearchBar } from "@/components/Inputs/SearchBar";
import { TokenTable } from "@/components/Tables/TokenTable";
import Image from "next/image";
import { format } from 'date-fns';

export default function Home() {
  const [tableSearch, setTableSearch] = useState('');
  const [selectedRowValues, setSelectedRowValues] = useState([]);

  const { data: rawTransactions } = useQuery({
    queryKey: ['fetch-generate-token-transactions'],
    queryFn: async () => {
      const res = await fetch('/api/transactions/fetch-for-merchant')

      const data = await res.json();
      console.log(data)

      return data;
    }
  });

  const transactions = useMemo(() => {
    if (!rawTransactions) return [];
    
    console.log(rawTransactions.length)

    return rawTransactions.map(transaction => ({
      id: transaction.id,
      date: format(new Date(transaction.createdAt), 'dd.MM.yyyy'),
      time: format(new Date(transaction.createdAt), 'HH:mm:ss'),
      balance: transaction.balanceAfter, // Assuming 'to' user's tokens represent the balance
      transactionAmount: transaction.transactionAmount,      
    }));    
  }, [rawTransactions]);

  return (
    <MerchantLayout path={["Strona główna", "Saldo tokenów"]}>
      <MainComponent>
        <TokenBalanceMerchant />

        <div className="flex flex-row items-center justify-between mb-[32px]">
          <SearchBar
            value={tableSearch}
            setValue={setTableSearch}
            extraCss="mt-[32px]"
          />
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
        <TokenTable data={transactions} setSelectedRowValues={setSelectedRowValues} />

      </MainComponent>
    </MerchantLayout>
  );
}
