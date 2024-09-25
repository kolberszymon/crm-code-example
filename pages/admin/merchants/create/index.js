import { useForm } from "react-hook-form";
import { MainComponent } from "@/components/MainComponent";
import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import { ButtonWhiteWithBorder } from "@/components/Buttons/ButtonWhiteWithBorder";
import AdminLayout from "@/components/Layouts/AdminLayout";
import Link from "next/link";
import { useRouter } from "next/router";
import { showToastNotificationError, showToastNotificationSuccess } from "@/components/Custom/ToastNotification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Role } from "@prisma/client";


export default function NewMerchantForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    formState: { isValid }
  } = useForm();
  const billingAddress = watch("billingAddress", false);
  const queryClient = useQueryClient();

  const createMerchantMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('/api/merchant/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        throw new Error(errorData.message || 'Wystąpił błąd podczas dodawania merchanta');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['merchants']);
      showToastNotificationSuccess("Sukces", "Email z linkiem rejestracyjnym został wysłany")
      router.push("/admin/merchants");
    },
    onError: (error) => {
      console.error('Error creating merchant:', error);
      showToastNotificationError("Wystąpił błąd", error.message)
    }
  });

  const onSubmit = (data) => {
    if (data.accountType === 'View') {
      data.role = Role.MERCHANT_VIEW;
    } else if (data.accountType === 'Edit') {
      data.role = Role.MERCHANT_EDIT;
    }

    createMerchantMutation.mutate(data);
  };

  return (
    <AdminLayout path={["Merchant", "Konto merchantów", "Nowe konto"]}>
      <MainComponent>
        <div className="w-full">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Nowe konto merchanta</h3>
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
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
                    {...register("phone")}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
                    {...register("accountNumber")}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
                    {...register("country")}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
                      {...register("postalCode")}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
                      {...register("city")}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
                    {...register("street")}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
                      {...register("houseNumber")}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
                        {...register("billingCountry")}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
                          {...register("billingPostalCode")}
                          className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
                          {...register("billingCity")}
                          className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
                        {...register("billingStreet")}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
                          {...register("billingHouseNumber")}
                          className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
                          className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
              <ButtonGreen title="Dodaj Merchanta" type="submit" disabled={createMerchantMutation.isPending} />
              <Link href="/admin/merchants">
                <ButtonWhiteWithBorder
                  title="Anuluj"
                  type="button"
                />
              </Link>
            </div>
          </form>
        </div>
      </MainComponent>
    </AdminLayout>
  );
}
