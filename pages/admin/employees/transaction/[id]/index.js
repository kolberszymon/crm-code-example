import { MerchantType } from "@/components/Custom/MerchantType";
import { MainComponent } from "@/components/MainComponent";
import Image from "next/image";
import Link from "next/link";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { formatNumberWithSpaces } from "@/helpers/formatNumberWithSpaces";
import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import { TransactionStatus } from "@/components/Custom/TransactionStatus";
import { TransferStatus } from "@/components/Custom/TransferStatus";
import { MulticolorTitleTile } from "@/components/Custom/MulticolorTitleTile";
import { EmployeeTransactionSender } from "@/components/Custom/EmployeeTransactionSender";
import { EmployeeTransactionRecipient } from "@/components/Custom/EmployeeTransactionRecipient";
import { TransactionStatus as PrismaTransactionStatus } from "@prisma/client";
import { showToastNotificationSuccess } from "@/components/Custom/ToastNotification";



const formatTransaction = (transaction) => {
  const tx = {}

  console.log(transaction)

  if (transaction.from.merchantData) {
    tx.from = {
      type: "merchant",
      merchantData: {
        accountType: transaction.from.merchantData.accountType,
        merchantName: transaction.from.merchantData.merchantName,
        email: transaction.from.merchantData.user.email,
        accountNumber: transaction.from.merchantData.accountNumber,
        id: transaction.from.merchantData.id
      }
    }
  } else if (transaction.from.employeeData) {
    tx.from = {
      type: "employee",
      employeeData: {
        firstName: transaction.from.employeeData.firstName,
        lastName: transaction.from.employeeData.lastName,
        email: transaction.from.employeeData.user.email,
        phone: transaction.from.employeeData.user.phone,
        accountNumber: transaction.from.employeeData.accountNumber,
        id: transaction.from.employeeData.user.id
      }
    }
  }
  
  if (transaction.to.merchantData) {
    tx.to = {
      type: "merchant",
      merchantData: {
        accountType: transaction.to.merchantData.accountType,
        merchantName: transaction.to.merchantData.merchantName,
        email: transaction.to.merchantData.user.email,
        accountNumber: transaction.to.merchantData.accountNumber,
        id: transaction.to.merchantData.id
      }
    }
  } else if (transaction.to.employeeData) {
    tx.to = {
      type: "employee",
      employeeData: {
        firstName: transaction.to.employeeData.firstName,
        lastName: transaction.to.employeeData.lastName,
        email: transaction.to.employeeData.user.email,
        phone: transaction.to.employeeData.user.phone,
        accountNumber: transaction.to.employeeData.accountNumber,
        id: transaction.to.employeeData.user.id
      }
    }
  }

  return tx
}

const formatPayment = (transaction) => {
  if (transaction.transactionStatus === PrismaTransactionStatus.BLAD_ZASILENIA) {
    return <MulticolorTitleTile title="Cykliczna" color="red" />
  }

  if (transaction.wasPaymentAutomatic === true) {
    return <MulticolorTitleTile title="Auto" color="blue" />
  }

  if (transaction.wasPaymentAutomatic === false || transaction.wasPaymentAutomatic === null) {
    return <MulticolorTitleTile title="Manualna" color="orange" />
  }
  
}

export default function MerchantView() {
  const { id } = useRouter().query;
  const router = useRouter();

  const { data: transaction, isPending } = useQuery({
    queryKey: ["transaction", id],
    queryFn: async () => {
      const res = await fetch(`/api/transactions/fetch-one?id=${id}`);
      const data = await res.json();

      console.log(formatTransaction(data))

      return data;
    },
  });

  if (isPending) {
    return (
      <AdminLayout path={["Merchant", "Rozliczenia z merchantami", "Szczegóły transakcji"]}>
        <MainComponent><p>Ładowanie...</p></MainComponent>
      </AdminLayout>
    )
  }  

  return (
    <AdminLayout path={["Merchant", "Rozliczenia z merchantami", "Szczegóły transakcji"]}>
      <MainComponent>
        <h3 className="text-zinc-950 text-base font-semibold leading-normal mb-[32px]">
          Szczegóły transakcji
        </h3>

        <div className="flex flex-row items-center mb-[32px] gap-[8px]">
          <span className="text-zinc-800 text-xs font-medium leading-normal">
            ID transakcji
          </span>
          <button className="flex items-center hover:cursor-pointer" onClick={() => {
            navigator.clipboard.writeText(transaction?.id);
            showToastNotificationSuccess("Sukces", "Skopiowano do schowka");
          }}>
            
            <Image
              src="/icons/copy-icon.svg"
              width={16}
              height={16}
              alt="Copy"
            />
            
            <p className="text-zinc-600 text-xs font-normal">
              {transaction?.id}
            </p>
          </button>
        </div>

        <div className="p-[16px] border rounded-md mb-[16px]">
          <h4 className="text-zinc-800 text-sm font-semibold leading-[21px] mb-[24px]">
            Szczegóły transakcji
          </h4>

          <div className="flex flex-col mb-[16px]">
            <p className="text-zinc-800 text-xs font-medium leading-normal">
              Data:
            </p>
            <p className="text-zinc-600 text-xs font-normal">
              {format(new Date(transaction?.createdAt), 'dd.MM.yyyy')}
            </p>
          </div>

          <div className="flex flex-col mb-[16px]">
            <p className="text-zinc-800 text-xs font-medium leading-normal">
              Godzina:
            </p>
            <p className="text-zinc-600 text-xs font-normal">
              {format(new Date(transaction?.createdAt), 'HH:mm:ss')}
            </p>
          </div>

          <div className="flex flex-col mb-[16px]">
            <p className="text-zinc-800 text-xs font-medium leading-normal">
              Wartość netto
            </p>
            <div className="flex flex-row">
              <Image
                src="/icons/coin.svg"
                width={16}
                height={16}
                alt="Coin"
                className="mr-1"
              />
              <p className="text-zinc-600 text-xs font-normal">
                {transaction?.transactionAmount}
              </p>
            </div>
          </div>

          <div className="flex flex-col mb-[16px]">
            <p className="text-zinc-800 text-xs font-medium leading-normal">
              Wartość PIT-4
            </p>
            <div className="flex flex-row">
              <Image
                src="/icons/coin.svg"
                width={16}
                height={16}
                alt="Coin"
                className="mr-1"
              />
              <p className="text-zinc-600 text-xs font-normal">
                {transaction?.pit4Amount}
              </p>
            </div>
          </div>

          <div className="flex flex-col mb-[16px]">
            <p className="text-zinc-800 text-xs font-medium leading-normal">
              Wartość do rozliczenia:
            </p>                          
            <p className="text-zinc-600 text-xs font-normal">
              {transaction?.transactionAmount} PLN
            </p>            
          </div>

          <div className="flex flex-col mb-[16px]">
            <p className="text-zinc-800 text-xs font-medium leading-normal">
              Status transkacji:
            </p>       
            <div className="flex flex-row items-center gap-[4px]">
              <TransactionStatus status={transaction?.transactionStatus} />           
            </div>
          </div>

          <div className="flex flex-col mb-[16px]">
            <p className="text-zinc-800 text-xs font-medium leading-normal">
              Status przelewu:
            </p>       
            <div className="flex flex-row items-center gap-[4px]">
              <TransferStatus status={transaction?.transferStatus} />           
            </div>
          </div>

          <div className="flex flex-col items-start">
            <p className="text-zinc-800 text-xs font-medium leading-normal">
              Płatność:
            </p>
            {formatPayment(transaction)}
          </div>
        </div>

        <EmployeeTransactionRecipient to={formatTransaction(transaction).to} />

        <EmployeeTransactionSender from={formatTransaction(transaction).from} />

        <ButtonGreen 
          title="Powrót"
          onPress={() => router.back()}
        />
        
    
      </MainComponent>
    </AdminLayout>
  );
}
