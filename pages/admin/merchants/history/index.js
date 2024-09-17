import { useState, useMemo } from "react";
import { MainComponent } from "@/components/MainComponent";
import { SearchBar } from "@/components/Inputs/SearchBar";
import { MerchantHistoryTable } from "@/components/Tables/MerchantHistoryTable";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export default function Home() {
  const [tableSearch, setTableSearch] = useState("");

  const { data: transactionsRaw, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await fetch('/api/transactions/fetch-all-merchants');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      return data;
    },
  });
  
  const transactions = useMemo(() => {
    if (!transactionsRaw) return [];

    const transactions = transactionsRaw.map((transaction) => ({
      id: transaction.id,
      merchant: transaction.to.merchantData.merchantName,
      date: format(new Date(transaction.createdAt), 'dd.MM.yyyy'),
      time: format(new Date(transaction.createdAt), 'HH:mm:ss'),
      balance: transaction.balanceAfter,
      transactionAmount: transaction.transactionAmount,
    }));

    return transactions;
  }, [transactionsRaw]);

  return (
    <AdminLayout path={["Merchant", "Historia transakcji merchantów"]}>
      <MainComponent>
        <p className="text-zinc-950 text-base font-semibold leading-normal mb-[32px]">
          Historia rozliczeń merchantów
        </p>

        <SearchBar
          value={tableSearch}
          setValue={setTableSearch}
          extraCss="mb-[32px]"
        />
        <MerchantHistoryTable tableData={transactions} />

      </MainComponent>
    </AdminLayout>
  );
}
