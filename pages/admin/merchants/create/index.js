import { useForm } from "react-hook-form";
import { MainComponent } from "@/components/MainComponent";
import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import { ButtonWhiteWithBorder } from "@/components/Buttons/ButtonWhiteWithBorder";
import AdminLayout from "@/components/Layouts/AdminLayout";
import Link from "next/link";

export default function NewMerchantForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const billingAddress = watch("billingAddress", false);

  const onSubmit = (data) => {
    console.log(data);
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
                    className="mt-1 block w-full border rounded-md p-2"
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
                    className="mt-1 block w-full border rounded-md p-2"
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
                    className="mt-1 block w-full border rounded-md p-2"
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
                    className="mt-1 block w-full border rounded-md p-2"
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
                    className="mt-1 block w-full border rounded-md p-2"
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
                    className="mt-1 block w-full border rounded-md p-2"
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
                    className="mt-1 block w-full border rounded-md p-2"
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
                    className="mt-1 block w-full border rounded-md p-2"
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
                    className="mt-1 block w-full border rounded-md p-2"
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
                      className="mt-1 block w-full border rounded-md p-2"
                    />
                    {errors.billingPostalCode && (
                      <span className="text-red-600 text-sm">
                        {errors.billingPostalCode.message}
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
                      className="mt-1 block w-full border rounded-md p-2"
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
                    className="mt-1 block w-full border rounded-md p-2"
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
                      className="mt-1 block w-full border rounded-md p-2"
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
                      className="mt-1 block w-full border rounded-md p-2"
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
                        {...register("billingCountry", {
                          required: billingAddress && "Kraj jest wymagany",
                        })}
                        className="mt-1 block w-full border rounded-md p-2"
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
                          className="mt-1 block w-full border rounded-md p-2"
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
                          className="mt-1 block w-full border rounded-md p-2"
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
                        className="mt-1 block w-full border rounded-md p-2"
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
                          className="mt-1 block w-full border rounded-md p-2"
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
                          className="mt-1 block w-full border rounded-md p-2"
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
              <ButtonGreen title="Dodaj Merchanta" type="submit" />
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