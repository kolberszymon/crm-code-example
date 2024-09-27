import Image from "next/image";
import Link from "next/link";
import { MerchantType } from "@/components/Custom/MerchantType";

export const EmployeeTransactionSender = ({ from, role = "admin" }) => {

  if (from.type === 'merchant') {
      return (
        <div className="p-4 border rounded-md mb-[16px]">
          <h4 className="text-zinc-800 text-sm font-semibold leading-[21px]">
            Nadawca
          </h4>
          {role === "admin" && (
            <Link href={`/${role}/merchants/view/${from.merchantData.id}`} className="flex flex-row mb-[24px]">
              <p className="text-zinc-600 text-xs font-normal">
                zobacz szczegóły nadawcy
              </p>
              <Image
                src="/icons/forward-icon.svg"
                width={16}
                height={16}
                alt="forward icon"
              />
            </Link>
          )}

          <div className={`flex flex-col mb-[16px] ${role === "merchant" ? "mt-[24px]" : ""}`}>
            <p className="text-zinc-800 text-xs font-medium leading-normal">
              Nazwa merchanta:
            </p>
            <div className="flex flex-row items-center gap-[4px]">
              <MerchantType type={from.merchantData.accountType} />
              <p className="text-zinc-600 text-xs font-normal">
                {from.merchantData.merchantName}
              </p>
            </div>
          </div>

          <div className="flex flex-col mb-[16px]">
            <p className="text-zinc-800 text-xs font-medium leading-normal">
              Email:
            </p>
            <p className="text-zinc-600 text-xs font-normal">
              {from.merchantData.email}
            </p>
          </div>

          <div className="flex flex-col mb-[16px]">
            <p className="text-zinc-800 text-xs font-medium leading-normal">
              Numer konta:
            </p>
            <p className="text-zinc-600 text-xs font-normal">
              {from.merchantData.accountNumber?.length > 0 ? from.merchantData.accountNumber : '-'}
            </p>
          </div>
        </div>
    )
  }

  if (from.type === 'employee') {
    return (
      <div className="p-4 border rounded-md mb-[16px]">
        <h4 className="text-zinc-800 text-sm font-semibold leading-[21px]">
          Nadawca
        </h4>

        <Link href={`/${role}/employees/view/${from.employeeData.id}`} className="flex flex-row mb-[24px]">
          <p className="text-zinc-600 text-xs font-normal">
            zobacz szczegóły nadawcy
          </p>
          <Image
            src="/icons/forward-icon.svg"
            width={16}
            height={16}
            alt="forward icon"
          />
        </Link>

        <div className="flex flex-col mb-[16px]">
          <p className="text-zinc-800 text-xs font-medium leading-normal">
            Imię pracownika:
          </p>
          <div className="flex flex-row items-center gap-[4px]">              
            <p className="text-zinc-600 text-xs font-normal">
              {from.employeeData.firstName}
            </p>
          </div>
        </div>

        <div className="flex flex-col mb-[16px]">
          <p className="text-zinc-800 text-xs font-medium leading-normal">
            Nazwisko pracownika:
          </p>
          <div className="flex flex-row items-center gap-[4px]">              
            <p className="text-zinc-600 text-xs font-normal">
              {from.employeeData.lastName}
            </p>
          </div>
        </div>

        <div className="flex flex-col mb-[16px]">
          <p className="text-zinc-800 text-xs font-medium leading-normal">
            Numer telefonu:
          </p>
          <div className="flex flex-row items-center gap-[4px]">              
            <p className="text-zinc-600 text-xs font-normal">
              {from.employeeData.phone}
            </p>
          </div>
        </div>

        <div className="flex flex-col mb-[16px]">
          <p className="text-zinc-800 text-xs font-medium leading-normal">
            Email:
          </p>
          <div className="flex flex-row items-center gap-[4px]">              
            <p className="text-zinc-600 text-xs font-normal">
              {from.employeeData.email?.length > 0 ? from.employeeData.email : '-'}
            </p>
          </div>
        </div>

        <div className="flex flex-col mb-[16px]">
          <p className="text-zinc-800 text-xs font-medium leading-normal">
            Numer konta:
          </p>
          <div className="flex flex-row items-center gap-[4px]">              
            <p className="text-zinc-600 text-xs font-normal">
              {from.employeeData.accountNumber?.length > 0 ? from.employeeData.accountNumber : 'Nie podano'}
            </p>
          </div>
        </div>
      </div>
    )
  }
}