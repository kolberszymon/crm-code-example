import { MainComponent } from "@/components/MainComponent";
import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import { StatusTile } from "@/components/Custom/StatusTile";
import { MulticolorTitleTile } from "@/components/Custom/MulticolorTitleTile";
import Image from "next/image";
import { showToastNotificationSuccess } from "@/components/Custom/ToastNotification";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { format } from "date-fns";
import Link from "next/link";
import MerchantLayout from "@/components/Layouts/MerchantLayout";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";

const getPaymentFrequency = (frequency) => {
  switch (frequency) {
    case "WEEKLY":
      return "Co tydzień";
    case "BIWEEKLY":
      return "Co 2 tygodnie";
    case "MONTHLY":
      return "Co miesiąc";
    default:
      return "-";
  }
}

export default function EmployeeView() {
  const { id } = useRouter().query;
  const { data: session } = useSession();
  const router = useRouter();
  const { data: employee, isPending } = useQuery({
    queryKey: ['employee', id],
    queryFn: async () => {
      const res = await fetch(`/api/employee/fetch-one?id=${id}`);
      const data = await res.json();

      console.log(data);
      return data;
    },
  });

  if (isPending) return <div>Ładowanie...</div>;

  return (
    <MerchantLayout path={["Pracownicy", "Konto pracownika"]} firstPath="employees">
      <MainComponent>
        <div className="mb-6 flex flex-row justify-between">
          <div className="flex flex-col">
            <h2 className="text-zinc-950 text-base font-semibold leading-normal">
              Konto pracownika
            </h2>
            <p className="text-zinc-600 text-xs font-normal">
              <span className="text-zinc-800 text-xs font-medium">
                Data dodania:
              </span>{" "}
              {format(new Date(employee.createdAt), 'dd.MM.yyyy')}
            </p>
          </div>
          <ButtonGreen
            title="Wyślij zaproszenie do aplikacji"
            onPress={() => {
              showToastNotificationSuccess(
                "Wysłano SMS",
                "Pracownik otrzymał SMS z linkiem do ściągnięcia aplikacji"
              );
            }}
          />
        </div>

        {/* Merchant Details */}
        <div className="bg-white p-[16px] rounded-md border border-gray-200 mb-6">
          <h3 className="text-zinc-800 text-sm font-semibold leading-[21px] mb-[24px]">
            Szczegóły rozliczeń z pracownikiem
          </h3>
          <div className="grid grid-cols-1 gap-[16px]">
            <div className="flex flex-row gap-[16px]">
              <div className="flex flex-col items-start">
                <label className="text-zinc-800 text-xs font-medium leading-normal">
                  Płatność cykliczna
                </label>
                {employee.recurrentPaymentOn ? (
                  <StatusTile status={"greenLight"} title={"Aktywna"} />
                ) : (
                  <StatusTile status={"redLight"} title={"Nieaktywna"} />
                )}
              </div>
              <div className="flex flex-col items-start">
                <label className="text-zinc-800 text-xs font-medium leading-normal">
                  Automatyczny zwrot
                </label>
                {employee.automaticReturnOn ? (
                  <StatusTile status={"greenLight"} title={"Aktywna"} />
                ) : (
                  <StatusTile status={"redLight"} title={"Nieaktywna"} />
                )}
              </div>
            </div>
            {employee.recurrentPaymentOn && (
            <>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Wartość kwoty przesyłanej cyklicznie
              </label>
              <div className="flex flex-row gap-[8px] items-center">
                <Image
                  src="/icons/coin.svg"
                  width={16}
                  height={16}
                  alt="Coin"
                />
                <p className="text-xs text-zinc-600 font-normal">{employee.paymentAmount}</p>
              </div>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Data początkowa płatności cyklicznej
              </label>
              <div className="flex flex-row gap-[8px] items-center">
                <Image
                  src="/icons/calendar-icon.svg"
                  width={16}
                  height={16}
                  alt="calendar"
                />
                <p className="text-xs text-zinc-600 font-normal">{format(new Date(employee.startDate), 'dd.MM.yyyy')}</p>
              </div>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Cykliczność płatności
              </label>
              <div className="flex flex-row gap-[8px] items-center">
                <Image
                  src="/icons/calendar-icon.svg"
                  width={16}
                  height={16}
                  alt="calendar"
                />
                <p className="text-xs text-zinc-600 font-normal">{getPaymentFrequency(employee.paymentFrequency)}</p>
              </div>
            </div>          
          </>
        )}
        </div>
        </div>

        {/* Merchant Details Section */}
        <div className="bg-white p-6 rounded-md border border-gray-200 mb-6">
          <h3 className="text-zinc-800 text-sm font-semibold leading-[21px] mb-[24px]">
            Dane merchanta przypisane do pracownika
          </h3>
          <div className="grid grid-cols-1 gap-[16px]">
            <div className="flex flex-col items-start">
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Nazwa Firmy
              </label>
              <div className="flex flex-row gap-[8px] items-center">
                {employee.merchant.accountType === "View" ? (
                  <MulticolorTitleTile title="View" color="blue" />
                ) : (
                  <MulticolorTitleTile title="Edit" color="orange" />
                )}
                <p className="text-xs text-zinc-600 font-normal">
                  {employee.merchant.merchantName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white p-6 rounded-md border border-gray-200 mb-6">
          <h3 className="text-zinc-800 text-sm font-semibold leading-[21px] mb-[24px]">
            Dane pracownika
          </h3>
          <div className="grid grid-cols-1 gap-[16px]">
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Imię pracownika
              </label>
              <p className="text-xs text-zinc-600 font-normal">{employee.firstName}</p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Nazwisko pracownika
              </label>
              <p className="text-xs text-zinc-600 font-normal">{employee.lastName}</p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Email
              </label>
              <p className="text-xs text-zinc-600 font-normal">{employee.user?.email}</p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Pesel
              </label>
              <p className="text-xs text-zinc-600 font-normal">{employee.pesel}</p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Numer telefonu
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {employee.user?.phone}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Dowód osobisty lub paszport
              </label>
              <p className="text-xs text-zinc-600 font-normal">{employee.idPassportNumber}</p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Numer konta
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {employee.accountNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Invoice Address Section */}
        <div className="bg-white p-6 rounded-md border border-gray-200 mb-6">
          <h3 className="text-zinc-800 text-sm font-semibold leading-[21px] mb-[24px]">
            Adres pracownika
          </h3>
          <div className="grid grid-cols-1 gap-[16px]">
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Kraj
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {employee.country}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Kod pocztowy
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {employee.postalCode}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Miejscowość
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {employee.city}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Ulica
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {employee.street}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Nr domu
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {employee.houseNumber}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Nr mieszkania
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {employee.apartmentNumber.length > 0
                  ? employee.apartmentNumber
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {session?.user?.role === Role.MERCHANT_EDIT ? (
              <Link href={`/merchant/employees/edit/${id}`}>
                <ButtonGreen title="Edytuj dane" />
              </Link>
            ) : null}

          <ButtonGray title="Anuluj" onPress={() => {
            router.back();
          }} />
        </div>
      </MainComponent>
    </MerchantLayout>
  );
}
