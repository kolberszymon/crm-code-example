import { MainComponent } from "@/components/MainComponent";
import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import { MerchantType } from "@/components/Custom/MerchantType";
import AdminLayout from "@/components/Layouts/AdminLayout";
import Link from "next/link";

export default function MerchantView() {
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
    <AdminLayout path={["Merchant", "Konto merchantów", "Nowe konto", "Szczegóły konta"]}>
      <MainComponent>
        <div className="mb-6">
          <h2 className="text-zinc-950 text-base font-semibold leading-normal">
            Szczegóły konta: {merchantData.merchantName}
          </h2>
          <p className="text-zinc-600 text-xs font-normal">
            <span className="text-zinc-800 text-xs font-medium">
              Data dodania:
            </span>{" "}
            28.06.2024
          </p>
        </div>

        {/* Merchant Details */}
        <div className="bg-white p-[16px] rounded-md border border-gray-200 mb-6">
          <h3 className="text-zinc-800 text-sm font-semibold leading-[21px] mb-[24px]">
            Dane merchanta
          </h3>
          <div className="grid grid-cols-1 gap-[16px]">
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Nazwa merchanta
              </label>
              <div className="flex items-center flex-row gap-[4px]">
                <MerchantType type={"View"} />
                <p className="text-xs text-zinc-600 font-normal">
                  {merchantData.merchantName}
                </p>
              </div>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Imię merchanta
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchantData.firstName}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Nazwisko merchanta
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchantData.lastName}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Email
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchantData.email}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Numer telefonu
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchantData.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Merchant Details Section */}
        <div className="bg-white p-6 rounded-md border border-gray-200 mb-6">
          <h3 className="text-zinc-800 text-sm font-semibold leading-[21px] mb-[24px]">
            Szczegóły merchanta
          </h3>
          <div className="grid grid-cols-1 gap-[16px]">
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                NIP
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchantData.nip}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Numer konta
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchantData.accountNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white p-6 rounded-md border border-gray-200 mb-6">
          <h3 className="text-zinc-800 text-sm font-semibold leading-[21px] mb-[24px]">
            Adres
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Kraj
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchantData.addressCountry}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Kod pocztowy
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchantData.addressPostalCode}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Miejscowość
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchantData.addressCity}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Ulica
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchantData.addressStreet}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Nr domu
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchantData.addressHouseNumber}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Nr mieszkania
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchantData.addressApartmentNumber ?? "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Invoice Address Section */}
        <div className="bg-white p-6 rounded-md border border-gray-200 mb-6">
          <h3 className="text-zinc-800 text-sm font-semibold leading-[21px] mb-[24px]">
            Adres na fakturze
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                {merchantData.invoiceAddressApartmentNumber}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Link href="/admin/merchants/edit/1">
            <ButtonGreen title="Edytuj dane" />
          </Link>
          <Link href="/admin/merchants">
            <ButtonGray title="Anuluj" />
          </Link>
        </div>
      </MainComponent>
    </AdminLayout>
  );
}
