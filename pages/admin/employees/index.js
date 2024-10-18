import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import Image from "next/image";
import { useState, useEffect } from "react";
import { MainComponent } from "@/components/MainComponent";
import { SearchBar } from "@/components/Inputs/SearchBar";
import { Modal } from "@/components/Modal";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import { showToastNotificationSuccess, showToastNotificationError } from "@/components/Custom/ToastNotification";
import { EmployeesAccountTable } from "@/components/Tables/EmployeesAccountTable";
import Link from "next/link";
import { ButtonRed } from "@/components/Buttons/ButtonRed";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { SelectDropdown } from "@/components/Inputs/SelectDropdown";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CSVLink } from "react-csv";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [searchValue, setSearchValue] = useState("");
  const [searchMerchantValue, setSearchMerchantValue] = useState("");
  const [automaticReturnOn, setAutomaticReturnOn] = useState("");
  const [isRecurrentPaymentOn, setIsRecurrentPaymentOn] = useState("");
  const [selectedRowValues, setSelectedRowValues] = useState({});
  const [csvData, setCsvData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetTableSelection, setResetTableSelection] = useState(() => () => {});


  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees-list'],
    queryFn: async () => {
      const res = await fetch("/api/employee/fetch-all")
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
      showToastNotificationSuccess("Sukces", "Pracownicy zostali pomyślnie dezaktywowani")
      setIsModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['employees-list'] })      
      resetTableSelection()
    },
    onError: (error) => {
      showToastNotificationError("Błąd", error.message)
      setIsModalOpen(false)
    }
  });

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
      setSearchMerchantValue(router.query.merchantSearch ?? "")
    }
  }, [router])

  const csvHeaders = [
    { label: "Nazwa pracownika", key: "employeeName" },
    { label: "Automatyczny zwrot", key: "automaticReturnOn" },
    { label: "Nazwa merchanta", key: "merchantName" },
    { label: "Saldo pracownika", key: "balance" },
    { label: "Płatność cykliczna", key: "recurrentPaymentOn" },
  ];

  const handleDeactivateEmployee = () => {
    deactivateEmployee()
  }

  return (
    <AdminLayout path={["Pracownicy", "Konta pracowników"]} firstPath="employees">
      <MainComponent>
        <div className="flex flex-row justify-between items-center">
          <p className="text-zinc-950 text-base font-semibold leading-normal">
            Konta pracowników
          </p>
          <Link href="/admin/employees/create">
            <ButtonGreen title="Dodaj pracownika" />
          </Link>
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-4 my-[64px]">
            <SearchBar
              value={searchValue}
              setValue={setSearchValue}
              extraCss=""
              placeholder="Szukaj po pracowniku"
            />
            <SearchBar
              value={searchMerchantValue}
              setValue={setSearchMerchantValue}
              extraCss=""
              placeholder="Szukaj po merchancie"
            />

            <SelectDropdown
              value={automaticReturnOn}
              setValue={setAutomaticReturnOn}
              options={["Zwrot", "Auto", "Manualny"]}
              extraCss=""
            />
            <SelectDropdown
              value={isRecurrentPaymentOn}
              setValue={setIsRecurrentPaymentOn}
              options={["Płatność cykliczna", "Aktywna", "Nieaktywna"]}
              extraCss=""
            />
          </div>
          <div className="flex flex-row gap-[8px]">
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
        {isLoading ? <div>Ładowanie...</div> : (
          <EmployeesAccountTable
            tableData={employees}
            setSelectedRowValues={setSelectedRowValues}
            searchValue={searchValue}
            merchantSearchValue={searchMerchantValue}
            automaticReturnOn={automaticReturnOn}
            isRecurrentPaymentOn={isRecurrentPaymentOn}
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
    </AdminLayout>
  );
}
