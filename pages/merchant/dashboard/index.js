import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainComponent } from "@/components/MainComponent";
import MerchantLayout from "@/components/Layouts/MerchantLayout";
import TokenBalanceMerchant from "@/components/pages/dashboard/TokenBalanceMerchant";
import { SearchBar } from "@/components/Inputs/SearchBar";
import { TokenTable } from "@/components/Tables/TokenTable";
import Image from "next/image";
import { format } from 'date-fns';
import { CSVLink } from "react-csv";

export default function Home() {
  const [tableSearch, setTableSearch] = useState('');
  const [selectedRowValues, setSelectedRowValues] = useState([]);
  const [csvData, setCsvData] = useState([]);

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
      
    return rawTransactions.map(transaction => ({
      id: transaction.id,
      date: format(new Date(transaction.createdAt), 'dd.MM.yyyy'),
      time: format(new Date(transaction.createdAt), 'HH:mm:ss'),
      balance: transaction.balanceAfter, // Assuming 'to' user's tokens represent the balance
      transactionAmount: transaction.transactionAmount,      
    }));    
  }, [rawTransactions]);

  useEffect(() => {
    const data = Object.values(selectedRowValues).map(row => ({
      ID: row.id,
      Data: row.date,
      Czas: row.time,
      "Saldo po transakcji": row.balance,
      "Kwota transakcji": row.transactionAmount
    }));
    setCsvData(data);
  }, [selectedRowValues]);

  const csvHeaders = [
    { label: "ID", key: "ID" },
    { label: "Data", key: "Data" },
    { label: "Czas", key: "Czas" },
    { label: "Saldo po transakcji", key: "Saldo po transakcji" },
    { label: "Kwota transakcji", key: "Kwota transakcji" }
  ];

  return (
    <MerchantLayout path={["Strona główna", "Saldo tokenów"]}>
      <MainComponent>
        <TokenBalanceMerchant />

        <div className="flex flex-row items-center justify-between mb-[32px] mt-[32px]">
          <SearchBar
            value={tableSearch}
            setValue={setTableSearch}
            extraCss=""
          />
          <CSVLink
            data={csvData}
            headers={csvHeaders}
            filename="wygenerowane_tokeny.csv"
            className={`p-[8px] bg-[#f6f7f8] rounded-full hover:bg-gray-200 transition-colors ${
              Object.keys(selectedRowValues).length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            target="_blank"
          >
            <Image
              src="/icons/download-icon.svg"
              width={16}
              height={16}
              alt="download icon"
            />
          </CSVLink>
        </div>
        <TokenTable data={transactions} setSelectedRowValues={setSelectedRowValues} searchValue={tableSearch} />

      </MainComponent>
    </MerchantLayout>
  );
}
