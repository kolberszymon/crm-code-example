import Image from "next/image";
import Link from "next/link";
import { MerchantType } from "@/components/Custom/MerchantType";

export const EmployeeTransactionRecipient = ({ to }) => {

  if (to.type === 'merchant') {
      return (
        <div className="p-4 border rounded-md mb-[16px]">
          <h4 className="text-zinc-800 text-sm font-semibold leading-[21px]">
            Odbiorca
          </h4>
          <Link href={`/admin/merchants/view/${to.merchantData.id}`} className="flex flex-row mb-[24px]">
            <p className="text-zinc-600 text-xs font-normal">
              zobacz szczegóły odbiorcy
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
              Nazwa merchanta:
            </p>
            <div className="flex flex-row items-center gap-[4px]">
              <MerchantType type={"View"} />
              <p className="text-zinc-600 text-xs font-normal">
                {to.merchantData.merchantName}
              </p>
            </div>
          </div>

          <div className="flex flex-col mb-[16px]">
            <p className="text-zinc-800 text-xs font-medium leading-normal">
              Email:
            </p>
            <p className="text-zinc-600 text-xs font-normal">
              {to.merchantData.email}
            </p>
          </div>

          <div className="flex flex-col mb-[16px]">
            <p className="text-zinc-800 text-xs font-medium leading-normal">
              Numer konta:
            </p>
            <p className="text-zinc-600 text-xs font-normal">
              {to.merchantData.accountNumber.length > 0 ? to.merchantData.accountNumber : '-'}
            </p>
          </div>
        </div>
    )
  }

  if (to.type === 'employee') {
    return (
      <div className="p-4 border rounded-md mb-[16px]">
        <h4 className="text-zinc-800 text-sm font-semibold leading-[21px]">
          Odbiorca
        </h4>

        <Link href={`/admin/employees/view/${to.employeeData.id}`} className="flex flex-row mb-[24px]">
          <p className="text-zinc-600 text-xs font-normal">
            zobacz szczegóły odbiorcy
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
              {to.employeeData.firstName}
            </p>
          </div>
        </div>

        <div className="flex flex-col mb-[16px]">
          <p className="text-zinc-800 text-xs font-medium leading-normal">
            Nazwisko pracownika:
          </p>
          <div className="flex flex-row items-center gap-[4px]">              
            <p className="text-zinc-600 text-xs font-normal">
              {to.employeeData.lastName}
            </p>
          </div>
        </div>

        <div className="flex flex-col mb-[16px]">
          <p className="text-zinc-800 text-xs font-medium leading-normal">
            Numer telefonu:
          </p>
          <div className="flex flex-row items-center gap-[4px]">              
            <p className="text-zinc-600 text-xs font-normal">
              {to.employeeData.phone}
            </p>
          </div>
        </div>

        <div className="flex flex-col mb-[16px]">
          <p className="text-zinc-800 text-xs font-medium leading-normal">
            Email:
          </p>
          <div className="flex flex-row items-center gap-[4px]">              
            <p className="text-zinc-600 text-xs font-normal">
              {to.employeeData.email?.length > 0 ? to.employeeData.email : '-'}
            </p>
          </div>
        </div>

        <div className="flex flex-col mb-[16px]">
          <p className="text-zinc-800 text-xs font-medium leading-normal">
            Numer konta:
          </p>
          <div className="flex flex-row items-center gap-[4px]">              
            <p className="text-zinc-600 text-xs font-normal">
              {to.employeeData.accountNumber?.length > 0 ? to.employeeData.accountNumber : '-'}
            </p>
          </div>
        </div>
      </div>
    )
  }
}