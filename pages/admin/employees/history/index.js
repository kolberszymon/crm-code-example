import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import Image from "next/image";
import { useState, useEffect } from "react";
import { MainComponent } from "@/components/MainComponent";
import { SearchBar } from "@/components/Inputs/SearchBar";
import { Modal } from "@/components/Modal";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import { showToastNotificationError, showToastNotificationSuccess } from "@/components/Custom/ToastNotification";
import { SelectDropdown } from "@/components/Inputs/SelectDropdown";
import { EmployeesHistoryTable } from "@/components/Tables/EmployeesHistoryTable";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { TransferStatus, TransactionStatus, Role } from "@prisma/client";
import { DatePickerWithRange } from "@/components/Custom/DatePickerRange";
import { useRouter } from "next/router";
import { CSVLink } from "react-csv";

const formatTransaction = (transaction) => {
  const transactionData = {
    id: transaction.id,
    employee: null,
    date: format(new Date(transaction.createdAt), 'dd.MM.yyyy'),
    hour: format(new Date(transaction.createdAt), 'HH:mm:ss'),
    accountNumber: null,
    amount: transaction.transactionAmount,
    transactionStatus: transaction.transactionStatus,
    transferStatus: transaction.transferStatus,
  }
  
  if (transaction.from.role === Role.EMPLOYEE) {
    transactionData.employee = transaction.from.employeeData.firstName + " " + transaction.from.employeeData.lastName
    transactionData.accountNumber = transaction.from.employeeData.accountNumber
  } else if (transaction.to.role === Role.EMPLOYEE) {
    transactionData.employee = transaction.to.employeeData.firstName + " " + transaction.to.employeeData.lastName
    transactionData.accountNumber = transaction.to.employeeData.accountNumber
  }

  return transactionData
}

export default function Home() {
  const router = useRouter()

  const [searchValue, setSearchValue] = useState("");
  const [selectedRowValues, setSelectedRowValues] = useState({});
  const [modalPayoffStatus, setModalPayoffStatus] = useState(TransferStatus.ROZLICZONE);
  const queryClient = useQueryClient()
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedTransactionStatus, setSelectedTransactionStatus] = useState("Status transakcji");
  const [selectedTransferStatus, setSelectedTransferStatus] = useState("Status przelewu");
  const [csvData, setCsvData] = useState([]);
  const [date, setDate] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: transactions, isPending } = useQuery({
    queryKey: ['transactions-fetch-history-all'],
    queryFn: async () => {
      const res = await fetch("/api/employee/fetch-history-all")
      const data = await res.json()

      try {

        const transactions = data.map(transaction => formatTransaction(transaction))
        
        return transactions
      } catch (error) {
        console.log(error)
      }
      },
      onError: (error) => {
        console.log(error)
      }
  })

  // useMutation to change transaction status
  const { mutate: changeTransactionStatus, isPending: isChangeTransactionStatusPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/transactions/change-transaction-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          transactions: selectedRowValues.map(transaction => transaction.id),
          status: modalPayoffStatus
        })
      })
      const data = await res.json()
      
      return data
    },
    onSuccess: (data) => {      
      showToastNotificationSuccess("Sukces", data.message)
      queryClient.invalidateQueries({ queryKey: ['transactions-fetch-history-all'] })
    },
    onError: (error) => {
      showToastNotificationError("Wystąpił błąd", error.message)
    }
  })

  const updateTransactionsStatus = () => {
    changeTransactionStatus()
    setIsModalOpen(false)
  }

  useEffect(() => {
    if (router.isReady) {
      setSelectedMerchant(router.query.merchantId)
      setSelectedEmployee(router.query.employeeId)
      setSelectedTransactionStatus(router.query.transactionStatus)
      setSelectedTransferStatus(router.query.transferStatus)
    }
  }, [router])


  useEffect(() => {
    const data = Object.values(selectedRowValues).map(row => ({
      id: row.id,
      employee: row.employee,
      date: row.date,
      hour: row.hour,
      accountNumber: row.accountNumber,
      amount: row.amount,
      transactionStatus: row.transactionStatus,
      transferStatus: row.transferStatus,
    }));
    setCsvData(data);
  }, [selectedRowValues]);

  const csvHeaders = [
    { label: "ID Doładowania", key: "id" },
    { label: "Pracownik", key: "recipent" },
    { label: "Data", key: "date" },
    { label: "Godzina", key: "hour" },
    { label: "Numer konta", key: "accountNumber" },
    { label: "Kwota", key: "amount" },
    { label: "Status transakcji", key: "transactionStatus" },
    { label: "Status przelewu", key: "transferStatus" }
  ];

  
  if (isPending) {
    return <div className="flex justify-center items-center h-screen">Ładowanie...</div>
  }

  return (
    <AdminLayout path={["Merchant", "Historia transakcji pracowników"]}>
      <MainComponent>
        <div className="flex flex-row justify-between items-center">
          <p className="text-zinc-950 text-base font-semibold leading-normal">
            Historia transkacji pracowników
          </p>

          <ButtonGreen
            title="Zmień status"
            onPress={() => {
              setModalPayoffStatus(TransferStatus.ROZLICZONE)
              setIsModalOpen(true)              
            }}
            disabled={selectedRowValues.length === 0}
          />

           
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col items-start my-[32px]">
            <div className="flex flex-row items-center gap-[8px]">
              <SearchBar
                value={searchValue}
                setValue={setSearchValue}
                extraCss="my-[32px]"
              />
              <DatePickerWithRange className="w-[235px] bg-white border border-zinc-400 rounded-md" date={date} setDate={setDate}/>
            </div>
            <div className="flex flex-row items-start gap-[8px]">
              <SelectDropdown
                value={selectedTransactionStatus}
                setValue={setSelectedTransactionStatus}
                options={["Status transakcji", TransactionStatus.ZASILONO, TransactionStatus.DO_ROZLICZENIA, TransactionStatus.ZAKONCZONO, TransactionStatus.PRACOWNIK_PRACOWNIK, TransactionStatus.ZAKUP_SZKOLENIA]}
                extraCss=""
              />
              <SelectDropdown
                value={selectedTransferStatus}
                setValue={setSelectedTransferStatus}
                options={["Status przelewu", TransferStatus.ROZLICZONE, TransferStatus.NIEROZLICZONE]}
                extraCss=""
              />
            </div>
          </div>
          <div className="flex flex-row gap-[8px]">
            <CSVLink
              data={csvData}
              headers={csvHeaders}
              filename="historia_transakcji_pracownikow.csv"
              className={`p-[8px] bg-[#f6f7f8] rounded-full hover:bg-gray-200 transition-colors ${
                Object.keys(selectedRowValues).length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              target="_blank"
              onClick={(event) => {
                if (Object.keys(selectedRowValues).length === 0) {
                  event.preventDefault();
                }
              }}   
            >
              <Image
                src="/icons/download-icon.svg"
                width={16}
                height={16}
                alt="download icon"
              />
            </CSVLink>
          </div>
        </div>
        <EmployeesHistoryTable
          tableData={transactions || []}
          setSelectedRowValues={setSelectedRowValues}
          searchValue={searchValue}
          selectedTransactionStatus={selectedTransactionStatus}
          selectedTransferStatus={selectedTransferStatus}
          date={date}
        />

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          title="Zamiana statusu"
        >
          <div className="text-xs text-gray-500 mb-4">
            Zamiana statusu będzie przeprowadzona na {selectedRowValues.length} zaznaczonym pracowniku
          </div>
          <select className={`p-[8px] mb-[24px] rounded-md outline-none ${modalPayoffStatus === TransferStatus.ROZLICZONE ? "bg-[#d9fbe8] text-[#00a155]" : "bg-[#ef4444] text-red-50"}`} onChange={(e) => setModalPayoffStatus(e.target.value)}>
            <option value={TransferStatus.ROZLICZONE}>Rozliczone</option>
            <option value={TransferStatus.NIEROZLICZONE}>Nierozliczone</option>
          </select>
          <div className="flex flex-row gap-[8px]">
            <ButtonGreen
              title="Zatwierdź"
              onPress={updateTransactionsStatus}
            />
            <ButtonGray title="Anuluj" onPress={() => setIsModalOpen(false)} />
          </div>
        </Modal>
      </MainComponent>
    </AdminLayout>
  );
}
