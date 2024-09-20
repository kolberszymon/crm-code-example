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

export default function MerchantView() {
  const { id } = useRouter().query;
  const router = useRouter();

  const { data: transaction, isPending } = useQuery({
    queryKey: ["transaction", id],
    queryFn: async () => {
      const res = await fetch(`/api/transactions/fetch-one?id=${id}`);
      const data = await res.json();

      console.log(data);
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
          <button className="flex items-center hover:cursor-pointer" onClick={() => navigator.clipboard.writeText(transaction?.id)}>
            
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
              Kwota transkacji:
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
                {formatNumberWithSpaces(transaction?.transactionAmount)}
              </p>
            </div>
          </div>

          <div className="flex flex-col mb-[16px]">
            <p className="text-zinc-800 text-xs font-medium leading-normal">
              Wartość prowizji:
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
                {formatNumberWithSpaces(1)}
              </p>
            </div>
          </div>

          <div className="flex flex-col mb-[16px]">
            <p className="text-zinc-800 text-xs font-medium leading-normal">
              Wartość do rozliczenia:
            </p>                          
            <p className="text-zinc-600 text-xs font-normal">
              {formatNumberWithSpaces(transaction?.transactionAmount)} PLN
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
              <TransactionStatus status={transaction?.transactionStatus} />           
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-zinc-800 text-xs font-medium leading-normal">
              Płatność:
            </p>       
            
          </div>
        </div>

        <div className="p-4 border rounded-md mb-[16px]">
          <h4 className="text-zinc-800 text-sm font-semibold leading-[21px]">
            Odbiorca
          </h4>
          <Link href={`/admin/merchants/view/${transaction?.to?.merchantData?.id ?? 'Admin'}`} className="flex flex-row mb-[24px]">
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
                {transaction?.to?.merchantData?.merchantName ?? 'Admin'}
              </p>
            </div>
          </div>

          <div className="flex flex-col mb-[16px]">
            <p className="text-zinc-800 text-xs font-medium leading-normal">
              Email:
            </p>
            <p className="text-zinc-600 text-xs font-normal">
              {transaction?.to?.merchantData?.email ?? 'Admin'}
            </p>
          </div>

          <div className="flex flex-col mb-[16px]">
            <p className="text-zinc-800 text-xs font-medium leading-normal">
              Numer konta:
            </p>
            <p className="text-zinc-600 text-xs font-normal">
              {transaction?.to?.merchantData?.accountNumber ?? 'Admin'}
            </p>
          </div>
        </div>

        <ButtonGreen 
          title="Powrót"
          onPress={() => router.back()}
        />
        
    
      </MainComponent>
    </AdminLayout>
  );
}
