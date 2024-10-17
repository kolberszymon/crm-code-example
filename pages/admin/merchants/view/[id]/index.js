import { MainComponent } from "@/components/MainComponent";
import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import { MerchantType } from "@/components/Custom/MerchantType";
import AdminLayout from "@/components/Layouts/AdminLayout";
import Link from "next/link";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { showToastNotificationSuccess, showToastNotificationError } from "@/components/Custom/ToastNotification";

export default function MerchantView() {
  const { id } = useRouter().query;
  const router = useRouter();

  const { data: merchant, isPending } = useQuery({
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
    enabled: !!id, 
  });

  // useMutation for sending invitation to merchant
  const { mutate: sendInvitation, isPending: isSendingInvitation } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/email/send-invite-to-app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: merchant.user.email, type: 'setPassword' }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message);
      }

      return data;
    },
    onSuccess: () => {
      showToastNotificationSuccess(
        "Sukces",
        `Wysłano zaproszenie do aplikacji na ${merchant.user.email}`
      );
    },
    onError: (error) => {
      showToastNotificationError(
        "Błąd",
        `Wystąpił błąd, spróbuj ponownie`
      );
    }
  });

  if (isPending)   return (
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
    <AdminLayout path={["Merchant", "Konto merchantów", "Nowe konto", "Szczegóły konta"]} firstPath="merchants">
      <MainComponent>
        <div className="mb-6 flex flex-row justify-between">
          <div className="flex flex-col">
            <h2 className="text-zinc-950 text-base font-semibold leading-normal">
              Szczegóły konta: {merchant.merchantName}
            </h2>
            <p className="text-zinc-600 text-xs font-normal">
              <span className="text-zinc-800 text-xs font-medium">
                Data dodania:
              </span>{" "}
              {format(new Date(merchant.createdAt), 'dd.MM.yyyy')}
            </p>
          </div>
          <ButtonGreen
            title="Wyślij zaproszenie do aplikacji"
            onPress={() => sendInvitation()}
          />
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
                {merchant.firstName?.length > 0 ? merchant.firstName : "-"}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Nazwisko merchanta
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.lastName?.length > 0 ? merchant.lastName : "-"}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Email
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.user?.email?.length > 0 ? merchant.user.email : "-"}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Numer telefonu
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.user?.phone?.length > 0 ? merchant.user.phone : "-"}
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
                {merchant.nip?.length > 0 ? merchant.nip : "-"}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Numer konta
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.accountNumber?.length > 0 ? merchant.accountNumber : "-"}
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
                {merchant.country?.length > 0 ? merchant.country : "-"}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Kod pocztowy
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.postalCode?.length > 0 ? merchant.postalCode : "-"}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Miejscowość
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.city?.length > 0 ? merchant.city : "-"}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Ulica
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.street?.length > 0 ? merchant.street : "-"}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Nr domu
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.houseNumber?.length > 0 ? merchant.houseNumber : "-"}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Nr mieszkania
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.apartmentNumber?.length > 0 ? merchant.apartmentNumber : "-"}
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
                {merchant.billingCountry?.length > 0 ? merchant.billingCountry : "-"}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Kod pocztowy
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.billingPostalCode?.length > 0 ? merchant.billingPostalCode : "-"}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Miejscowość
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.billingCity?.length > 0 ? merchant.billingCity : "-"}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Ulica
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.billingStreet?.length > 0 ? merchant.billingStreet : "-"}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Nr domu
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.billingHouseNumber?.length > 0 ? merchant.billingHouseNumber : "-"}
              </p>
            </div>
            <div>
              <label className="text-zinc-800 text-xs font-medium leading-normal">
                Nr mieszkania
              </label>
              <p className="text-xs text-zinc-600 font-normal">
                {merchant.billingApartmentNumber?.length > 0 ? merchant.billingApartmentNumber : "-"}
              </p>
            </div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Link href={`/admin/merchants/edit/${merchant.id}`}>
            <ButtonGreen title="Edytuj dane" />
          </Link>
          
          <ButtonGray title="Anuluj" onPress={() => router.back()}/>          
        </div>
      </MainComponent>
    </AdminLayout>
  );
}
