import { useForm } from "react-hook-form";
import { MainComponent } from "@/components/MainComponent";
import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import { ButtonWhiteWithBorder } from "@/components/Buttons/ButtonWhiteWithBorder";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { showToastNotificationSuccess, showToastNotificationError } from "@/components/Custom/ToastNotification";

export default function NewMerchantForm() {
  const { id } = useRouter().query;
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm();
  const billingAddress = watch("billingAddress", false);

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

  // useMutation for updating merchant data
  const { mutate: updateMerchant } = useMutation({
    mutationFn: async (formData) => {
      const response = await fetch(`/api/merchant/update-data`, {
        method: 'POST',
        body: JSON.stringify({...formData, id}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      return data;
    },
    onSuccess: () => {
      showToastNotificationSuccess(
        "Sukces",
        'Konto zostało pomyślnie zaktualizowane',        
      );
      router.back()
    },
    onError: (error) => {
      showToastNotificationError(
        "Błąd",
        error.message,
      );
    }
  });

  const onSubmit = (data) => {
    updateMerchant(data);
  };

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
    <AdminLayout path={["Merchant", "Konta merchantów", "Edytuj"]}>
      <MainComponent>
        <div className="w-full">
          <div className="mb-4 flex flex-col gap-[8px]">
            <h3 className="text-lg font-semibold">Konto merchanta: {merchant?.merchantName}</h3>
            <p className="text-xs text-zinc-600"><span className="text-zinc-800 mr-[8px] font-medium">Data dodania</span> {format( new Date(merchant?.createdAt), 'dd.MM.yyyy')}</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Merchant Account Data */}
            <section className="border p-4 rounded-md">
              <h4 className="font-semibold mb-4">Dane merchanta</h4>
              <div className="grid grid-cols-1 gap-4 w-1/2">
                <div>
                  <label
                    htmlFor="accountType"
                    className="block text-sm font-medium"
                  >
                    Rodzaj konta
                  </label>
                  
                  <select
                    id="accountType"
                    {...register("accountType", {
                      required: "Rodzaj konta jest wymagany",
                    })}
                    className="mt-1 block w-full border rounded-md p-2 text-sm"
                    defaultValue={merchant?.accountType}
                  >
                    <option value="View">View</option>
                    <option value="Edit">Edit</option>
                  </select>
                  {errors.accountType && (
                    <span className="text-red-600 text-sm">
                      {errors.accountType.message}
                    </span>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="merchantName"
                    className="block text-sm font-medium"
                  >
                    Nazwa merchanta
                  </label>
                  <input
                    type="text"
                    id="merchantName"
                    {...register("merchantName", {
                      required: "Nazwa merchanta jest wymagana",
                    })}
                    className="mt-1 block w-full border rounded-md p-2 text-sm"
                    defaultValue={merchant?.merchantName}
                  />
                  {errors.merchantName && (
                    <span className="text-red-600 text-sm">
                      {errors.merchantName.message}
                    </span>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium"
                  >
                    Imię merchanta
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    {...register("firstName", {
                      required: "Imię jest wymagane",
                    })}
                    className="mt-1 block w-full border rounded-md p-2 text-sm"
                    defaultValue={merchant?.firstName}
                  />
                  {errors.firstName && (
                    <span className="text-red-600 text-sm">
                      {errors.firstName.message}
                    </span>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium"
                  >
                    Nazwisko merchanta
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    {...register("lastName", {
                      required: "Nazwisko jest wymagane",
                    })}
                    className="mt-1 block w-full border rounded-md p-2 text-sm"
                    defaultValue={merchant?.lastName}
                  />
                  {errors.lastName && (
                    <span className="text-red-600 text-sm">
                      {errors.lastName.message}
                    </span>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email", {
                      required: "Email jest wymagany",
                      pattern: {
                        value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                        message: "Niepoprawny adres email",
                      },
                    })}
                    className="mt-1 block w-full border rounded-md p-2 text-sm"
                    defaultValue={merchant?.email}
                  />
                  {errors.email && (
                    <span className="text-red-600 text-sm">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium">
                    Numer telefonu
                  </label>
                  <input
                    type="text"
                    id="phone"
                    {...register("phone", {
                      required: "Numer telefonu jest wymagany",
                    })}
                    className="mt-1 block w-full border rounded-md p-2 text-sm"
                    defaultValue={merchant?.phone}
                  />
                  {errors.phone && (
                    <span className="text-red-600 text-sm">
                      {errors.phone.message}
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* Merchant Details */}
            <section className="border p-4 rounded-md">
              <h4 className="font-semibold mb-4">Szczegóły merchanta</h4>
              <div className="grid grid-cols-1  gap-4 w-1/2">
                <div>
                  <label htmlFor="nip" className="block text-sm font-medium">
                    NIP
                  </label>
                  <input
                    type="text"
                    id="nip"
                    {...register("nip", { required: "NIP jest wymagany" })}
                    className="mt-1 block w-full border rounded-md p-2 text-sm"
                    defaultValue={merchant?.nip}
                  />
                  {errors.nip && (
                    <span className="text-red-600 text-sm">
                      {errors.nip.message}
                    </span>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="accountNumber"
                    className="block text-sm font-medium"
                  >
                    Numer konta
                  </label>
                  <input
                    type="text"
                    id="accountNumber"
                    {...register("accountNumber", {
                      required: "Numer konta jest wymagany",
                    })}
                    className="mt-1 block w-full border rounded-md p-2 text-sm"
                    defaultValue={merchant?.accountNumber}
                  />
                  {errors.accountNumber && (
                    <span className="text-red-600 text-sm">
                      {errors.accountNumber.message}
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* Address */}
            <section className="border p-4 rounded-md">
              <h4 className="font-semibold mb-4">Adres</h4>
              <div className="grid grid-cols-1  gap-4 w-1/2">
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium"
                  >
                    Kraj
                  </label>
                  <input
                    type="text"
                    id="country"
                    {...register("country", { required: "Kraj jest wymagany" })}
                    className="mt-1 block w-full border rounded-md p-2 text-sm"
                    defaultValue={merchant?.country}
                  />
                  {errors.country && (
                    <span className="text-red-600 text-sm">
                      {errors.country.message}
                    </span>
                  )}
                </div>

                <div className="flex-row flex gap-6">
                  <div className="flex flex-col">
                    <label
                      htmlFor="postalCode"
                      className="block text-sm font-medium"
                    >
                      Kod pocztowy
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      {...register("postalCode", {
                        required:
                          billingAddress && "Kod pocztowy jest wymagany",
                      })}
                      className="mt-1 block w-full border rounded-md p-2 text-sm"
                      defaultValue={merchant?.postalCode}
                    />
                    {errors.postalCode && (
                      <span className="text-red-600 text-sm">
                        {errors.postalCode.message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col flex-1">
                    <label htmlFor="city" className="block text-sm font-medium">
                      Miejscowość
                    </label>
                    <input
                      type="text"
                      id="city"
                      {...register("city", {
                        required: "Miejscowość jest jest wymagana",
                      })}
                      className="mt-1 block w-full border rounded-md p-2 text-sm"
                      defaultValue={merchant?.city}
                    />
                    {errors.city && (
                      <span className="text-red-600 text-sm">
                        {errors.city.message}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="street" className="block text-sm font-medium">
                    Ulica
                  </label>
                  <input
                    type="text"
                    id="street"
                    {...register("street", { required: "Ulica jest wymagana" })}
                    className="mt-1 block w-full border rounded-md p-2 text-sm"
                    defaultValue={merchant?.street}
                  />
                  {errors.street && (
                    <span className="text-red-600 text-sm">
                      {errors.street.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col flex-1">
                    <label
                      htmlFor="houseNumber"
                      className="block text-sm font-medium"
                    >
                      Nr domu
                    </label>
                    <input
                      type="text"
                      id="houseNumber"
                      {...register("houseNumber", {
                        required: "Nr domu jest wymagany",
                      })}
                      className="mt-1 block w-full border rounded-md p-2 text-sm"
                      defaultValue={merchant?.houseNumber}
                    />
                    {errors.houseNumber && (
                      <span className="text-red-600 text-sm">
                        {errors.houseNumber.message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col flex-1">
                    <label
                      htmlFor="apartmentNumber"
                      className="block text-sm font-medium"
                    >
                      Nr mieszkania
                    </label>
                    <input
                      type="text"
                      id="apartmentNumber"
                      {...register("apartmentNumber")}
                      className="mt-1 block w-full border rounded-md p-2 text-sm"
                      defaultValue={merchant?.apartmentNumber}
                    />
                    {errors.apartmentNumber && (
                      <span className="text-red-600 text-sm">
                        {errors.apartmentNumber.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Billing Address */}

            <section className="border p-4 rounded-md">
              <div className="flex items-center">
                <input
                  id="billingAddress"
                  type="checkbox"
                  {...register("billingAddress")}
                  className="h-4 w-4 rounded"
                  defaultChecked={merchant?.billingAddress}
                />
                <label
                  htmlFor="billingAddress"
                  className="ml-2 block text-sm font-medium"
                >
                  Inny adres na fakturze
                </label>
              </div>
              {billingAddress && (
                <div className="mt-4">
                  <div className="grid grid-cols-1  gap-4 w-1/2">
                    <div>
                      <label
                        htmlFor="billingCountry"
                        className="block text-sm font-medium"
                      >
                        Kraj
                      </label>
                      <input
                        type="text"
                        id="billingCountry"
                        {...register("billingCountry", {
                          required: billingAddress && "Kraj jest wymagany",
                        })}
                        className="mt-1 block w-full border rounded-md p-2 text-sm"
                        defaultValue={merchant?.billingCountry}
                      />
                      {errors.billingCountry && (
                        <span className="text-red-600 text-sm">
                          {errors.billingCountry.message}
                        </span>
                      )}
                    </div>
                    <div className="flex-row flex gap-6">
                      <div className="flex flex-col">
                        <label
                          htmlFor="billingPostalCode"
                          className="block text-sm font-medium"
                        >
                          Kod pocztowy
                        </label>
                        <input
                          type="text"
                          id="billingPostalCode"
                          {...register("billingPostalCode", {
                            required:
                              billingAddress && "Kod pocztowy jest wymagany",
                          })}
                          className="mt-1 block w-full border rounded-md p-2 text-sm"
                          defaultValue={merchant?.billingPostalCode}
                        />
                        {errors.billingPostalCode && (
                          <span className="text-red-600 text-sm">
                            {errors.billingPostalCode.message}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col flex-1">
                        <label
                          htmlFor="billingCity"
                          className="block text-sm font-medium"
                        >
                          Miejscowość
                        </label>
                        <input
                          type="text"
                          id="billingCity"
                          {...register("billingCity", {
                            required: "Mijescowość jest jest wymagana",
                          })}
                          className="mt-1 block w-full border rounded-md p-2 text-sm"
                          defaultValue={merchant?.billingCity}
                        />
                        {errors.billingCity && (
                          <span className="text-red-600 text-sm">
                            {errors.billingCity.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="billingStreet"
                        className="block text-sm font-medium"
                      >
                        Ulica
                      </label>
                      <input
                        type="text"
                        id="billingStreet"
                        {...register("billingStreet", {
                          required: billingAddress && "Ulica jest wymagana",
                        })}
                        className="mt-1 block w-full border rounded-md p-2 text-sm"
                        defaultValue={merchant?.billingStreet}
                      />
                      {errors.billingStreet && (
                        <span className="text-red-600 text-sm">
                          {errors.billingStreet.message}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-row gap-4">
                      <div className="flex-col flex flex-1">
                        <label
                          htmlFor="billingHouseNumber"
                          className="block text-sm font-medium"
                        >
                          Nr domu
                        </label>
                        <input
                          type="text"
                          id="billingHouseNumber"
                          {...register("billingHouseNumber", {
                            required: billingAddress && "Nr domu jest wymagany",
                          })}
                          className="mt-1 block w-full border rounded-md p-2 text-sm"
                          defaultValue={merchant?.billingHouseNumber}
                        />
                        {errors.billingHouseNumber && (
                          <span className="text-red-600 text-sm">
                            {errors.billingHouseNumber.message}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col flex-1">
                        <label
                          htmlFor="billingApartmentNumber"
                          className="block text-sm font-medium"
                        >
                          Nr mieszkania
                        </label>
                        <input
                          type="text"
                          id="billingApartmentNumber"
                          {...register("billingApartmentNumber")}
                          className="mt-1 block w-full border rounded-md p-2 text-sm"
                          defaultValue={merchant?.billingApartmentNumber}
                        />
                        {errors.billingApartmentNumber && (
                          <span className="text-red-600 text-sm">
                            {errors.billingApartmentNumber.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Buttons */}
            <div className="flex justify-start space-x-4">
              <ButtonGreen title="Zapisz zmiany" type="submit" disabled={!isValid || isPending}/>
              
              <ButtonWhiteWithBorder
                title="Anuluj"
                type="button"
                onPress={() => router.back()}
              />              
            </div>
          </form>
        </div>
      </MainComponent>
    </AdminLayout>
  );
}
