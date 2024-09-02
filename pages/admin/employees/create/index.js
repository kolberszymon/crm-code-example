import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import { useState } from "react";
import { MainComponent } from "@/components/MainComponent";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { showToastNotificationSuccess } from "@/components/Custom/ToastNotification";
import Link from "next/link";
import { useForm } from "react-hook-form";
import AdminLayout from "@/components/Layouts/AdminLayout";

export default function CreateEmployee() {
  const [automaticReturn, setAutomaticReturn] = useState(false);
  const [recurrentPayment, setRecurrentPayment] = useState(false);
  const [paymentValue, setPaymentValue] = useState(0);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    router.push("/admin/employees");
    showToastNotificationSuccess(
      "Dodano konto pracownika",
      "Konto pracownika zostało utworzone"
    );
  };

  return (
    <AdminLayout>
      <MainComponent>
        <h3 className="text-xl font-semibold mb-6">Konto pracownika</h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Payout Details Section */}
          <div className="mb-6 border rounded-md p-[16px]">
            <h4 className="text-zinc-800 text-sm font-semibold mb-[24px]">
              Szczegóły rozliczeń z pracownikiem
            </h4>
            <div className="flex flex-col gap-[16px]">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={automaticReturn}
                  onChange={() => setAutomaticReturn(!automaticReturn)}
                  className="mr-2 accent-main-green w-[14px] h-[14px]"
                />
                <label className="text-sm">Automatyczny zwrot</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={recurrentPayment}
                  onChange={() => setRecurrecntPayment(!recurrentPayment)}
                  className="mr-2 accent-main-green w-[14px] h-[14px]"
                />
                <label className="text-sm">
                  Transakcje wykonywane cyklicznie
                </label>
              </div>
              <div className="w-1/4">
                <label className="block text-sm font-medium mb-2">
                  Wartość kwoty przesyłanej cyklicznie
                </label>
                <div className="flex flex-row border border-gray-300 rounded-md pl-[8px] items-center">
                  <Image
                    src="/icons/coin.svg"
                    width={16}
                    height={16}
                    alt="coin"
                  />
                  <input
                    type="text"
                    className="text-sm p-[8px]"
                    placeholder="Kwota"
                    value={paymentValue}
                    onChange={(e) => setPaymentValue(e.target.value)}
                    {...register("paymentValue", {
                      required: "Wartość kwoty jest wymagana",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Wartość musi być liczbą",
                      },
                    })}
                  />
                </div>
                {errors.paymentValue && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.paymentValue.message}
                  </p>
                )}
              </div>

              <div className="w-1/3">
                <label className="block text-sm font-medium mb-2">
                  Data początkowa płatności cyklicznej
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  {...register("startDate", {
                    required: "Data początkowa jest wymagana",
                  })}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="w-1/3">
                <label className="block text-sm font-medium mb-2">
                  Cykliczność płatności
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  {...register("paymentFrequency", {
                    required: "Cykliczność płatności jest wymagana",
                  })}
                >
                  <option value="weekly">Co tydzień</option>
                  <option value="monthly">Co miesiąc</option>
                </select>
                {errors.paymentFrequency && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.paymentFrequency.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Employee Details Section */}
          <div className="mb-6 border rounded-md p-[16px]">
            <h4 className="text-zinc-800 text-sm font-semibold mb-[24px]">
              Dane pracownika
            </h4>
            <div className="flex flex-col gap-[16px]">
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2">
                  Imię pracownika
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  placeholder="Imię"
                  {...register("firstName", {
                    required: "Imię jest wymagane",
                  })}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2">
                  Nazwisko pracownika
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  placeholder="Nazwisko"
                  {...register("lastName", {
                    required: "Nazwisko jest wymagane",
                  })}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  placeholder="Email"
                  {...register("email", {
                    required: "Email jest wymagany",
                    pattern: {
                      value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                      message: "Nieprawidłowy email",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2">Pesel</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  placeholder="Pesel"
                  {...register("pesel", {
                    required: "Pesel jest wymagany",
                  })}
                />
                {errors.pesel && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.pesel.message}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2">
                  Numer telefonu
                </label>
                <input
                  type="tel"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  placeholder="Numer telefonu"
                  {...register("phoneNumber", {
                    required: "Numer telefonu jest wymagany",
                    pattern: {
                      value: /^[0-9]{9}$/,
                      message: "Numer telefonu musi składać się z 9 cyfr",
                    },
                  })}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2">
                  Numer konta bankowego
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  placeholder="Numer konta"
                  {...register("accountNumber", {
                    required: "Numer konta jest wymagany",
                  })}
                />
                {errors.accountNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.accountNumber.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="mb-6 border rounded-md p-[16px]">
            <h4 className="text-zinc-800 text-sm font-semibold mb-[24px]">
              Adres pracownika
            </h4>
            <div className="flex flex-col gap-[16px]">
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2">Kraj</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  placeholder="Polska"
                  {...register("country", {
                    required: "Kraj jest wymagany",
                  })}
                />
                {errors.country && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2">
                  Kod pocztowy
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  placeholder="32-652"
                  {...register("postalCode", {
                    required: "Kod pocztowy jest wymagany",
                  })}
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2">
                  Miejscowość
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  placeholder="Warszawa"
                  {...register("city", {
                    required: "Miejscowość jest wymagana",
                  })}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2">Ulica</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  placeholder="Ogrodwa"
                  {...register("street", {
                    required: "Ulica jest wymagana",
                  })}
                />
                {errors.street && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.street.message}
                  </p>
                )}
              </div>

              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2">
                  Nr domu
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  placeholder="3"
                  {...register("houseNumber", {
                    required: "Nr domu jest wymagany",
                  })}
                />
                {errors.houseNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.houseNumber.message}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2">
                  Nr mieszkania
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  placeholder="3"
                  {...register("apartmentNumber")}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-[8px]">
            <ButtonGreen title="Dodaj pracownika" type="submit" />
            <Link href="/admin/employees">
              <ButtonGray title="Anuluj" />
            </Link>
          </div>
        </form>
      </MainComponent>
    </AdminLayout>
  );
}
