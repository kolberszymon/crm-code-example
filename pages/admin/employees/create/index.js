import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import { useState } from "react";
import { MainComponent } from "@/components/MainComponent";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { showToastNotificationSuccess, showToastNotificationError } from "@/components/Custom/ToastNotification";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { DatePickerSingle } from "@/components/Custom/DatePickerSingle";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import SelectSearchBar from "@/components/Custom/SelectSearchBar";


export default function CreateEmployee() {
  const [automaticReturn, setAutomaticReturn] = useState(false);
  const [recurrentPayment, setRecurrentPayment] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedMerchant, setSelectedMerchant] = useState(null);

  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { data: merchantsOptions, isPending} = useQuery({
    queryKey: ['merchants'],
    queryFn: async () => {
     const res = await fetch('/api/merchant/fetch-all');

     const data = await res.json();

     const merchantsOptions = data.map((merchant) => ({
      value: merchant.merchantData.id,
      label: merchant.merchantData.merchantName,
     }));
         
     return merchantsOptions;
    }
  });

  
  const createEmployeeMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('/api/employee/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        throw new Error(errorData.message || 'Wystąpił błąd podczas dodawania pracownika');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
      showToastNotificationSuccess("Sukces", "Pracownik został dodany pomyślnie")
      router.push("/admin/employees");
    },
    onError: (error) => {
      console.error('Error creating merchant:', error);
      showToastNotificationError("Wystąpił błąd", error.message)
    }
  });

  const onSubmit = (data) => {
    const body = {...data, startDate, recurrentPaymentOn: recurrentPayment, automaticReturnOn: automaticReturn, merchantId: selectedMerchant};
    createEmployeeMutation.mutate(body);
  };

  if (isPending) {
    return <div className="flex justify-center items-center h-screen">Ładowanie...</div>
  }

  return (
    <AdminLayout path={["Pracownicy", "Konto pracownika"]} firstPath="employees">
      <MainComponent>
        <h3 className="text-xl font-semibold mb-6">Konto pracownika</h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Payout Details Section */}
          <div className="mb-6 border rounded-md p-[16px]">
            <h4 className="text-zinc-800 text-sm font-semibold mb-[24px]">
              Szczegóły rozliczeń z pracownikiem
            </h4>
            <div className="flex flex-col gap-[16px]">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={automaticReturn}
                  onChange={() => setAutomaticReturn(!automaticReturn)}
                  className="mr-2 accent-main-green w-[14px] h-[14px]"
                />
                <span className="text-sm">Automatyczny zwrot</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={recurrentPayment}
                  onChange={() => setRecurrentPayment(!recurrentPayment)}
                  className="mr-2 accent-main-green w-[14px] h-[14px]"
                />
                <span className="text-sm">
                  Transakcje wykonywane cyklicznie
                </span>
              </label>
              {recurrentPayment && (
                <>
              <div className="w-1/4">
                <label className="block text-sm font-medium mb-2">
                  Wartość kwoty przesyłanej cyklicznie netto
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
                    className="text-sm p-[8px] flex-1 outline-none rounded-md"                                   
                    {...register("paymentAmount", {
                      required: recurrentPayment ?  "Wartość kwoty jest wymagana" : false,
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Wartość musi być liczbą",
                      },
                      valueAsNumber: true,
                    })}
                    defaultValue={0}         
                  />
                </div>
                {errors.paymentAmount && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.paymentAmount.message}
                  </p>
                )}
              </div>

              <div className="w-1/4">
                <label className="block text-sm font-medium mb-2">
                  Wartość kwoty przesyłanej cyklicznie PIT-4
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
                    className="text-sm p-[8px] flex-1 outline-none rounded-md"                                                 
                    {...register("paymentAmountPit", {
                      required: recurrentPayment ?  "Wartość kwoty jest wymagana" : false,
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Wartość musi być liczbą",
                      },
                      valueAsNumber: true,
                    })}
                    defaultValue={0}
                  />
                </div>
                {errors.paymentAmountPit && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.paymentAmountPit.message}
                  </p>
                )}
              </div>

              <div className="w-1/3">
                <label className="block text-sm font-medium mb-2">
                  Data początkowa płatności cyklicznej
                </label>
                <DatePickerSingle className="w-full" date={startDate} setDate={setStartDate} />
                {errors.startDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="w-[230px]">
                <label className="block text-sm font-medium mb-2">
                  Cykliczność płatności
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 text-sm hover:cursor-pointer outline-none hover:bg-gray-100 transition-colors"
                  {...register("paymentFrequency", {
                    required: recurrentPayment ? "Cykliczność płatności jest wymagana" : false,
                  })}
                >
                  <option value="WEEKLY">Co tydzień</option>
                  <option value="BIWEEKLY">Co 2 tygodnie</option>
                  <option value="MONTHLY">Co miesiąc</option>
                </select>
                {errors.paymentFrequency && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.paymentFrequency.message}
                  </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mb-6 border rounded-md p-[16px]">
            <h4 className="text-zinc-800 text-sm font-semibold mb-[24px]">
              Dane merchanta przypisane do pracownika
            </h4>
            <p className="block text-sm font-medium mb-2">
              Merchant
            </p>
            <div className="w-1/2">
            <Controller
                name="merchantId"
                control={control}
                rules={{ required: "Merchant jest wymagany" }}
                render={({ field }) => (
                  <SelectSearchBar
                    options={merchantsOptions}
                    placeholder={"Salon urody beauty"}
                    onChange={(e) => {
                      field.onChange(e.value);
                      setSelectedMerchant(e.value);
                    }}
                  />
                )}
              />
              {errors.merchantId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.merchantId.message}
                </p>
              )}
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
                  {...register("email", {                    
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
                  {...register("pesel")}
                />
                {errors.pesel && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.pesel.message}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2">Dowód osobisty lub paszport</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"                  
                  {...register("idPassportNumber")}
                />
                {errors.idPassportNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.idPassportNumber.message}
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
                  {...register("phone", {
                    required: "Numer telefonu jest wymagany",
                  })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone.message}
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
                  {...register("accountNumber")}
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
                  {...register("country")}
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
                  {...register("postalCode")}
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
                  {...register("city")}
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
                  {...register("street")}
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
                  {...register("houseNumber")}
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
                  {...register("apartmentNumber")}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-[8px]">
            <ButtonGreen title="Dodaj pracownika" type="submit" disabled={createEmployeeMutation.isPending} />
            <Link href="/admin/employees">
              <ButtonGray title="Anuluj" />
            </Link>
          </div>
        </form>
      </MainComponent>
    </AdminLayout>
  );
}
