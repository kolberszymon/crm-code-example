import { useState, useMemo, useEffect } from "react";
import { MainComponent } from "@/components/MainComponent";
import { SearchBar } from "@/components/Inputs/SearchBar";
import { MerchantHistoryTable } from "@/components/Tables/MerchantHistoryTable";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CSVLink } from "react-csv";
import Image from "next/image";
import { DatePickerWithRange } from "@/components/Custom/DatePickerRange";

export default function Home() {
  const [tableSearch, setTableSearch] = useState("");
  const [selectedRowValues, setSelectedRowValues] = useState({});
  const [csvData, setCsvData] = useState([]);
  const [date, setDate] = useState(null);


  const { data: transactionsRaw, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await fetch('/api/transactions/fetch-all-merchants');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();      
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

  useEffect(() => {
    const data = Object.values(selectedRowValues).map(row => ({
      id: row.id,
      merchantName: row.merchant,
      date: row.date,
      time: row.time,
      balance: row.balance ?? 0,
      transactionAmount: row.transactionAmount ?? 0,
    }));
    setCsvData(data);
  }, [selectedRowValues]);

  const csvHeaders = [
    { label: "ID Transakcji", key: "id" },
    { label: "Nazwa merchanta", key: "merchantName" },
    { label: "Data", key: "date" },
    { label: "Czas", key: "time" },
    { label: "Saldo po transakcji", key: "balance" },
    { label: "Kwota transakcji", key: "transactionAmount" },
  ];

  return (
    <AdminLayout path={["Merchant", "Historia transakcji merchantów"]}>
      <MainComponent>
        <p className="text-zinc-950 text-base font-semibold leading-normal mb-[32px]">
          Historia rozliczeń merchantów
        </p>
        <div className="flex flex-row items-start justify-between mb-[32px]">
        <div className="flex flex-row items-center gap-[8px]">
          <SearchBar
            value={tableSearch}
            setValue={setTableSearch}          
            placeholder="Szukaj po id, merchancie"
          />
          <DatePickerWithRange className="w-[235px] bg-white border border-zinc-400 rounded-md" date={date} setDate={setDate} />
        </div>
        <CSVLink
          data={csvData}
          headers={csvHeaders}
          filename="historia_rozliczen_merchantow.csv"
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
            onClick={() => console.log(selectedRowValues)}
          />
          </CSVLink>
        </div>
        <MerchantHistoryTable tableData={transactions} searchValue={tableSearch} setSelectedRowValues={setSelectedRowValues} date={date} />

      </MainComponent>
    </AdminLayout>
  );
}
