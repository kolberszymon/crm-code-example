import { MainComponent } from "@/components/MainComponent";
import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import { MerchantType } from "@/components/Custom/MerchantType";
import AdminLayout from "@/components/Layouts/AdminLayout";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { format } from "date-fns";

export default function MerchantView() {
  const { id } = useRouter().query;
  const router = useRouter();

  const { data: merchant, isLoading } = useQuery({
    queryKey: ['merchant', id],
    queryFn: async () => {
      const response = await fetch(`/api/merchant/fetch-one?id=${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      return data;
    },
    enabled: !!id, // Only run the query when id is available
  });

  if (isLoading)   return (
    <AdminLayout path={["Merchant", "Konto merchantów", "Nowe konto", "Szczegóły konta"]}>
      <MainComponent>
        <div className="mb-6">
          <h2 className="text-zinc-950 text-base font-semibold leading-normal">
            Ładowanie...
          </h2>
        </div>
      </MainComponent>
    </AdminLayout>
  );

  return (
    <AdminLayout path={["Merchant", "Konto merchantów", "Nowe konto", "Szczegóły konta"]}>
      <MainComponent>
        <div className="mb-6">
          <h2 className="text-zinc-950 text-base font-semibold leading-normal">
            Szczegóły konta: {merchant.merchantName}
          </h2>
          <p className="text-zinc-600 text-xs font-normal">
            <span className="text-zinc-800 text-xs font-medium">
              Data dodania:
            </span>{" "}
            {format( new Date(merchant.createdAt), "dd.MM.yyyy")}
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
                <MerchantType type={merchant.accountType} />
                <p className="text-xs text-zinc-600 font-normal">
                  {merchant.merchantName}
                </p>
              </div>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Imię merchanta
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.firstName}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Nazwisko merchanta
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.lastName}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Email
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.email}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Numer telefonu
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.phone}
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
                {merchant.nip}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Numer konta
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.accountNumber}
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
                {merchant.country}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Kod pocztowy
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.postalCode}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Miejscowość
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.city}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Ulica
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.street}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Nr domu
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.houseNumber}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Nr mieszkania
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.apartmentNumber === "" ? "-" : merchant.apartmentNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Invoice Address Section */}
        {merchant.billingAddress && (
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
                {merchant.billingCountry}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Kod pocztowy
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.billingPostalCode}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Miejscowość
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.billingCity}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Ulica
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.billingStreet}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Nr domu
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.billingHouseNumber}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Nr mieszkania
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.billingApartmentNumber === "" ? "-" : merchant.billingApartmentNumber}
              </p>
            </div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Link href="/admin/merchants/edit/1">
            <ButtonGreen title="Edytuj dane" />
          </Link>
          
          <ButtonGray title="Anuluj" onPress={() => router.back()}/>          
        </div>
      </MainComponent>
    </AdminLayout>
  );
}
