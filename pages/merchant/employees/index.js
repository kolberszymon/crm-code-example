import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import Image from "next/image";
import { useState, useEffect } from "react";
import { MainComponent } from "@/components/MainComponent";
import { SearchBar } from "@/components/Inputs/SearchBar";
import { Modal } from "@/components/Modal";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import { showToastNotificationSuccess, showToastNotificationError } from "@/components/Custom/ToastNotification";
import Link from "next/link";
import { ButtonRed } from "@/components/Buttons/ButtonRed";
import { SelectDropdown } from "@/components/Inputs/SelectDropdown";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MerchantLayout from "@/components/Layouts/MerchantLayout";
import { EmployeesAccountTableMerchant } from "@/components/Tables/EmployeesAccountTableMerchant";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import { CSVLink } from "react-csv";

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [isRecurrentPaymentOn, setIsRecurrentPaymentOn] = useState(null);
  const [automaticReturnOn, setAutomaticReturnOn] = useState("");
  const [selectedRowValues, setSelectedRowValues] = useState({});
  const { data: session} = useSession();
  const queryClient = useQueryClient()

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetTableSelection, setResetTableSelection] = useState(() => () => {});

  const [csvData, setCsvData] = useState([]);

  const { data: employees, isPending } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const res = await fetch("/api/employee/fetch-all-for-merchant")
      const data = await res.json()

      const employees = data.map(employee => {
        return {
          id: employee.id,
          name: employee.employeeData.firstName + " " + employee.employeeData.lastName,
          automaticReturnOn: employee.employeeData.automaticReturnOn,
          merchantName: employee.employeeData.merchant.merchantName,
          balance: employee.tokens,
          recurrentPaymentOn: employee.employeeData.recurrentPaymentOn,
        }
      })

      return employees
    },
  })

  // useMutation for deactivating employees
  const { mutate: deactivateEmployee } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/employee/deactivate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeIds: selectedRowValues.map(employee => employee.id)
        })
      });

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message)
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      showToastNotificationSuccess("Sukces", "Pracownicy zostali pomyślnie dezaktywowani")
      setIsModalOpen(false)
      resetTableSelection()
    },
    onError: (error) => {
      showToastNotificationError("Błąd", error.message)
      setIsModalOpen(false)
    }
  });

  const handleDeactivateEmployee = () => {
    deactivateEmployee()
  }

  const csvHeaders = [
    { label: "Nazwa pracownika", key: "employeeName" },
    { label: "Automatyczny zwrot", key: "automaticReturnOn" },
    { label: "Nazwa merchanta", key: "merchantName" },
    { label: "Saldo pracownika", key: "balance" },
    { label: "Płatność cykliczna", key: "recurrentPaymentOn" },
  ];

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

  return (
    <MerchantLayout path={["Pracownicy", "Konta pracowników"]} firstPath="employees">
      <MainComponent>
        <div className="flex flex-row justify-between items-center">
          <p className="text-zinc-950 text-base font-semibold leading-normal">
            Konta pracowników
          </p>
          {session?.user?.role === Role.MERCHANT_EDIT ? (
            <Link href="/merchant/employees/create">
              <ButtonGreen title="Dodaj pracownika" />
            </Link>
          ) : null}
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-4 my-[32px]">
            <SearchBar
              value={searchValue}
              setValue={setSearchValue}
              extraCss="my-[32px]"
            />
            <SelectDropdown
              value={isRecurrentPaymentOn}
              setValue={setIsRecurrentPaymentOn}
              options={["Płatność cykliczna", "Aktywna", "Nieaktywna"]}
              extraCss=""
            />
            <SelectDropdown
              value={automaticReturnOn}
              setValue={setAutomaticReturnOn}
              options={["Zwrot", "Auto", "Manualny"]}
              extraCss=""
            />
          </div>
          <div className="flex flex-row gap-[8px]">
            {session?.user?.role === Role.MERCHANT_EDIT ? (
              <button
                className={`p-[8px] bg-[#f6f7f8] rounded-full hover:bg-gray-200 transition-colors ${
                  Object.keys(selectedRowValues).length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={selectedRowValues.length === 0}
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
              <Image
                src="/icons/trash.svg"
                width={16}
                height={16}
                alt="download icon"
              />
            </button>
            ) : null}
            
            <CSVLink
              data={csvData}
              headers={csvHeaders}
              filename="konta_pracownikow.csv"
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
          <EmployeesAccountTableMerchant
            tableData={employees || []}
            setSelectedRowValues={setSelectedRowValues}
            searchValue={searchValue}            
            isRecurrentPaymentOn={isRecurrentPaymentOn}
            automaticReturnOn={automaticReturnOn}
            setResetTableSelection={setResetTableSelection}
          />
        )}

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          title="Czy na pewno chcesz usunąć Pracownika?"
        >
          <div className="text-sm text-gray-500 mb-4">
            Zatwierdź, by potwierdzić
          </div>
          <div className="flex flex-row gap-[8px]">
            <ButtonRed
              title="Zatwierdź"
              onPress={handleDeactivateEmployee}
            />
            <ButtonGray title="Anuluj" onPress={() => setIsModalOpen(false)} />
          </div>
        </Modal>
      </MainComponent>
    </MerchantLayout>
  );
}
