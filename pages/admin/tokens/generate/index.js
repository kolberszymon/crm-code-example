import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { TokenTable } from "@/components/Tables/TokenTable";
import { MainComponent } from "@/components/MainComponent";
import { SearchBar } from "@/components/Inputs/SearchBar";
import { Modal } from "@/components/Modal";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { showToastNotificationSuccess, showToastNotificationError } from "@/components/Custom/ToastNotification";
import TokenBalance from "@/components/pages/tokens-generate/TokenBalance";
import GenerateTokensInput from "@/components/pages/tokens-generate/GenerateTokensInput";
import { useSession } from "next-auth/react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { format } from 'date-fns';
import { CSVLink } from "react-csv";

export default function Home() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [tokenNumber, setTokenNumber] = useState("");
  const [tableSearch, setTableSearch] = useState("");
  const [selectedRowValues, setSelectedRowValues] = useState({});
  const [csvData, setCsvData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addTokensMutation = useMutation({
    mutationFn: async (tokens) => {
      const response = await fetch('/api/users/add-tokens', { method: 'POST', body: JSON.stringify({ userId: session?.user?.id, tokens }) });
      if (!response.ok) {
        throw new Error('Failed to add tokens');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user', session?.user?.id, 'fetch-generate-token-transactions']);      
      showToastNotificationSuccess("Generowanie Tokenów", "Tokeny zostały wygenerowane");
    },
    onError: (error) => {
      showToastNotificationError("Generowanie Tokenów", "Wystąpił błąd podczas generowania tokenów");
    }
  });

  const { data: rawTransactions } = useQuery({
    queryKey: ['fetch-generate-token-transactions'],
    queryFn: async () => {
      const res = await fetch('/api/transactions/generate-tokens');
      const data = await res.json();
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

  const handleModalSuccess = () => {
    addTokensMutation.mutate(Number(tokenNumber));
    setIsModalOpen(false);
    setTokenNumber("");
  };

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
    <AdminLayout path={["Tokeny", "Generowanie nowych tokenów"]}>
      <MainComponent>
        <p className="text-zinc-950 text-base font-semibold leading-normal">
          Generowanie nowych tokenów
        </p>
        <TokenBalance />
        <GenerateTokensInput tokenNumber={tokenNumber} setTokenNumber={setTokenNumber} setIsModalOpen={setIsModalOpen} />
        <p className="text-[#0e1726] text-base font-medium leading-normal my-[32px]">
          Wygenerowane tokeny
        </p>
        <div className="flex flex-row items-center justify-between mb-[32px]">
          <SearchBar
            value={tableSearch}
            setValue={setTableSearch}
            extraCss=""
            placeholder="Szukaj po ID"
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
        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          title="Czy na pewno chcesz wygenerować tokeny?"
        >
          <div className="text-sm text-gray-500 mb-4">
            Zatwierdź, by potwierdzić
          </div>
          <div className="flex flex-row gap-[8px]">
            <ButtonGreen title="Zatwierdź" onPress={handleModalSuccess} />
            <ButtonGray title="Anuluj" onPress={() => setIsModalOpen(false)} />
          </div>
        </Modal>
      </MainComponent>
    </AdminLayout>
  );
}
