import { MainComponent } from "@/components/MainComponent";
import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import { StatusTile } from "@/components/Custom/StatusTile";
import { MulticolorTitleTile } from "@/components/Custom/MulticolorTitleTile";
import Image from "next/image";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { showToastNotificationSuccess } from "@/components/Custom/ToastNotification";

export default function EmployeeView() {
  const merchantData = {
    accountType: "View",
    merchantName: "Salon urody Beauty",
    firstName: "Joanna",
    lastName: "Kowalczyk",
    email: "joannakowalczyk@mail.com",
    phone: "+48 739 254 543",
    nip: "5464647575689780",
    accountNumber: "PL 456546345345654765765764587765987843",
    addressCountry: "Polska",
    addressPostalCode: "57-353",
    addressCity: "Kielce",
    addressStreet: "ul. Słoneczna",
    addressHouseNumber: "12",
    invoiceAddressCountry: "Polska",
    invoiceAddressPostalCode: "57-353",
    invoiceAddressCity: "Kielce",
    invoiceAddressStreet: "ul. Słoneczna",
    invoiceAddressHouseNumber: "12",
    invoiceAddressApartmentNumber: "",
  };

  return (
    <AdminLayout path={["Merchant", "Konto pracownika"]}>
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
              28.06.2024
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
                <StatusTile status={"greenLight"} title={"Aktywna"} />
              </div>
              <div className="flex flex-col items-start">
                <label className="text-zinc-800 text-xs font-medium leading-normal">
                  Płatność cykliczna
                </label>
                <MulticolorTitleTile title="Auto" color="blue" />
              </div>
            </div>
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
                <p className="text-xs text-zinc-600 font-normal">10 000</p>
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
                <p className="text-xs text-zinc-600 font-normal">24.06.24</p>
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
                <p className="text-xs text-zinc-600 font-normal">Co tydzień</p>
              </div>
            </div>
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
                <MulticolorTitleTile title="Auto" color="blue" />
                <p className="text-xs text-zinc-600 font-normal">
                  Salon urody Beauty
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
              <p className="text-xs text-zinc-600 font-normal">Jan</p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Nazwisko pracownika
              </label>
              <p className="text-xs text-zinc-600 font-normal">Kowalski</p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Email
              </label>
              <p className="text-xs text-zinc-600 font-normal">jan@gmail.com</p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Pesel
              </label>
              <p className="text-xs text-zinc-600 font-normal">84051252487 </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Numer telefonu
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                + 48 739 234 543
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Dowód osobisty lub paszport
              </label>
              <p className="text-xs text-zinc-600 font-normal">AWX 354940303</p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Numer konta
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                PL 4565464534535456575756756487458767775689843
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
                {merchantData.invoiceAddressCountry}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Kod pocztowy
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchantData.invoiceAddressPostalCode}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Miejscowość
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchantData.invoiceAddressCity}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Ulica
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchantData.invoiceAddressStreet}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Nr domu
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchantData.invoiceAddressHouseNumber}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Nr mieszkania
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchantData.invoiceAddressApartmentNumber.length > 0
                  ? merchantData.invoiceAddressApartmentNumber
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <ButtonGreen title="Edytuj dane" />
          <ButtonGray title="Anuluj" />
        </div>
      </MainComponent>
    </AdminLayout>
  );
}
