import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import Image from "next/image";
import { useState, useEffect } from "react";
import { MainComponent } from "@/components/MainComponent";
import { SearchBar } from "@/components/Inputs/SearchBar";
import { Modal } from "@/components/Modal";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import { showToastNotificationError, showToastNotificationSuccess } from "@/components/Custom/ToastNotification";
import { SelectDropdown } from "@/components/Inputs/SelectDropdown";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { EmployeesPayoffTable } from "@/components/Tables/EmployeesPayoffTable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CSVLink } from "react-csv";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState("");
  const [merchantType, setMerchantType] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [selectedRowValues, setSelectedRowValues] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const queryClient = useQueryClient();

  // useQuery to get employees data
  const { data: employees, isPending } = useQuery({
    queryKey: ['employees-fetch-all-payoff'],
    queryFn: async () => {
      const res = await fetch("/api/employee/fetch-all-payoff")
      const data = await res.json()

      const employees = data.map(employee => {
        return {
          id: employee.id,
          name: employee.employeeData.firstName + " " + employee.employeeData.lastName,
          automaticReturnOn: employee.employeeData.automaticReturnOn,
          merchantName: employee.employeeData.merchant.merchantName,
          balance: employee.tokens,
          recurrentPaymentOn: employee.employeeData.recurrentPaymentOn,
          merchantUserId: employee.employeeData.merchant.userId,
          merchantId: employee.employeeData.merchant.id,
        }
      })

      return employees
    },
  })

  const updateEmployeeTokenBalancesMutation = useMutation({
    mutationFn: async (selectedEmployees) => {
      const response = await fetch('/api/employee/send-payoff-from-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedEmployees),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {        
        throw new Error(data.message || "Wystąpił błąd podczas przesyłania tokenów");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['employees-fetch-all-payoff', "transactions-fetch-history-all"]);
      showToastNotificationSuccess("Sukces!", "Tokeny zostały przesłane");
    },
    onError: (error) => {
      console.error("Error updating token balances:", error);
      showToastNotificationError("Błąd!", error.message);
    },
  });

  const submitPayoff = () => {    
    updateEmployeeTokenBalancesMutation.mutate(selectedRowValues)
    setIsModalOpen(false)
  }

  useEffect(() => {
    const data = Object.values(selectedRowValues).map(row => ({
      employeeName: row.name,
      automaticReturnOn: row.automaticReturnOn,
      merchantName: row.merchantName,
      balance: row.balance,
      recurrentPaymentOn: row.recurrentPaymentOn,
    }));
    setCsvData(data);
  }, [selectedRowValues]);

  useEffect(() => {
    if (router.isReady) {
      setSearchValue(router.query.searchValue ?? "")
    }
  }, [router])

  const csvHeaders = [
    { label: "Imię i nazwisko pracownika", key: "employeeName" },
    { label: "Automatyczny zwrot", key: "automaticReturnOn" },
    { label: "Nazwa merchanta", key: "merchantName" },
    { label: "Saldo", key: "balance" },
    { label: "Powtarzalna płatność", key: "recurrentPaymentOn" },
  ];

  if (isPending) {
    return <div className="flex justify-center items-center h-screen">Ładowanie...</div>
  }

  return (
    <AdminLayout path={["Merchant", "Rozliczenia z pracownikami"]}>
      <MainComponent>
        <div className="flex flex-row justify-between items-center">
          <p className="text-zinc-950 text-base font-semibold leading-normal">
            Rozliczenia z pracownikami
          </p>

          <ButtonGreen
            title="Wyślij przelew"
            onPress={() => setIsModalOpen(true)}
            disabled={selectedRowValues.length === 0}
          />
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-4 my-[32px]">
            <SearchBar
              value={searchValue}
              setValue={setSearchValue}
              extraCss="my-[32px]"
            />
            <SelectDropdown
              value={merchantType}
              setValue={setMerchantType}
              options={["Merchant", "View", "Edit"]}
              extraCss=""
            />
            <SelectDropdown
              value={paymentType}
              setValue={setPaymentType}
              options={["Płatność", "Auto", "Manual"]}
              extraCss=""
            />
          </div>
          <div className="flex flex-row gap-[8px]">            
            <CSVLink
              data={csvData}
              headers={csvHeaders}
              filename="rozliczenia_z_pracownikami.csv"
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
        {isPending ? <div>Ładowanie...</div> : (
          <EmployeesPayoffTable
          tableData={employees}
          setSelectedRowValues={setSelectedRowValues}
          />
        )}

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          title="Czy na pewno chcesz przesłać tokeny?"
        >
          <div className="text-sm text-gray-500 mb-4">
            Zatwierdź, by potwierdzić
          </div>
          <div className="flex flex-row gap-[8px]">
            <ButtonGreen
              title="Zatwierdź"
              onPress={submitPayoff}
            />
            <ButtonGray title="Anuluj" onPress={() => setIsModalOpen(false)} />
          </div>
        </Modal>
      </MainComponent>
    </AdminLayout>
  );
}
