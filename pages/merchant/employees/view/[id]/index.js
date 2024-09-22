import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import Image from "next/image";
import { useState, useMemo } from "react";
import { MainComponent } from "@/components/MainComponent";
import { SearchBar } from "@/components/Inputs/SearchBar";
import { Modal } from "@/components/Modal";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import { showToastNotificationSuccess } from "@/components/Custom/ToastNotification";
import Link from "next/link";
import { ButtonRed } from "@/components/Buttons/ButtonRed";
import { SelectDropdown } from "@/components/Inputs/SelectDropdown";
import { useQuery } from "@tanstack/react-query";
import MerchantLayout from "@/components/Layouts/MerchantLayout";
import { EmployeesAccountTableMerchant } from "@/components/Tables/EmployeesAccountTableMerchant";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
export default function Home() {
  const [searchValue, setSearchValue] = useState(null);
  const [merchantType, setMerchantType] = useState("");
  const [selectedRowValues, setSelectedRowValues] = useState({});
  const session = useSession();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: employees, isLoading } = useQuery({
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

  return (
    <MerchantLayout path={["Merchant", "Konta pracowników"]}>
      <MainComponent>
        <div className="flex flex-row justify-between items-center">
          <p className="text-zinc-950 text-base font-semibold leading-normal">
            Konta pracowników
          </p>
          {session?.user?.role === Role.MERCHANT_EDIT ? (
            <Link href="/admin/employees/create">
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
              value={merchantType}
              setValue={setMerchantType}
              options={["Merchant", "View", "Edit"]}
              extraCss=""
            />
          </div>
          <div className="flex flex-row gap-[8px]">
            <button
              className="p-[8px] bg-[#f6f7f8] rounded-full hover:bg-gray-200 transition-colors disabled:hover:bg-[#f6f7f8]"
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
        </div>
        {isLoading ? <div>Ładowanie...</div> : (
          <EmployeesAccountTableMerchant
            tableData={employees}
            setSelectedRowValues={setSelectedRowValues}
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
              onPress={() => {
                setIsModalOpen(false);
                showToastNotificationSuccess(
                  "Sukces!",
                  "Pracownik został usunięty"
                );
              }}
            />
            <ButtonGray title="Anuluj" onPress={() => setIsModalOpen(false)} />
          </div>
        </Modal>
      </MainComponent>
    </MerchantLayout>
  );
}