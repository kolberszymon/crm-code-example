import { MerchantType } from "@/components/Custom/MerchantType";
import { MainComponent } from "@/components/MainComponent";
import Image from "next/image";
import Link from "next/link";
import AdminLayout from "@/components/Layouts/AdminLayout";

export default function MerchantView() {
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
          <div className="flex items-center">
            <button>
              <Image
                src="/icons/copy-icon.svg"
                width={16}
                height={16}
                alt="Copy"
              />
            </button>
            <p className="text-zinc-600 text-xs font-normal">
              345673214690521577
            </p>
          </div>
        </div>

        <div className="p-[16px] border rounded-md mb-[16px]">
          <h4 className="text-zinc-800 text-sm font-semibold leading-[21px] mb-[24px]">
            Szczegóły transakcji
          </h4>

          <div className="flex flex-col mb-[16px]">
            <p className="text-zinc-800 text-xs font-medium leading-normal">
              Data:
            </p>
            <p className="text-zinc-600 text-xs font-normal">12.06.2024</p>
          </div>

          <div className="flex flex-col mb-[16px]">
            <p className="text-zinc-800 text-xs font-medium leading-normal">
              Godzina:
            </p>
            <p className="text-zinc-600 text-xs font-normal">13:45:23</p>
          </div>

          <div className="flex flex-col">
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
              <p className="text-zinc-600 text-xs font-normal">100 000</p>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-md">
          <h4 className="text-zinc-800 text-sm font-semibold leading-[21px]">
            Odbiorca
          </h4>
          <Link href="#" className="flex flex-row mb-[24px]">
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
                Mechanik samochodowy
              </p>
            </div>
          </div>

          <div className="flex flex-col mb-[16px]">
            <p className="text-zinc-800 text-xs font-medium leading-normal">
              Email:
            </p>
            <p className="text-zinc-600 text-xs font-normal">
              johndoe@gmail.com
            </p>
          </div>

          <div className="flex flex-col mb-[16px]">
            <p className="text-zinc-800 text-xs font-medium leading-normal">
              Numer konta:
            </p>
            <p className="text-zinc-600 text-xs font-normal">
              PL 4565464534535456575756756487458767775689843
            </p>
          </div>
        </div>

        <Link href="/admin/merchants/history">
          <button className="bg-main-green text-white px-4 py-2 rounded-md mt-[16px]">
            Powrót
          </button>
        </Link>
      </MainComponent>
    </AdminLayout>
  );
}
