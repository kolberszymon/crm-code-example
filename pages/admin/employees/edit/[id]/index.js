import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import { useState } from "react";
import { MainComponent } from "@/components/MainComponent";
import Image from "next/image";
import { useRouter } from "next/router";
import { showToastNotificationSuccess, showToastNotificationError } from "@/components/Custom/ToastNotification";
import { useForm } from "react-hook-form";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { DatePickerSingle } from "@/components/Custom/DatePickerSingle";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export default function EditEmployee() {
  const { id } = useRouter().query;
  const router = useRouter();
  
  const [automaticReturn, setAutomaticReturn] = useState(false);
  const [recurrentPayment, setRecurrentPayment] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedMerchant, setSelectedMerchant] = useState(null);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { data: employee, isPending } = useQuery({
    queryKey: ['employee', id],
    queryFn: async () => {
      const response = await fetch(`/api/employee/fetch-one?id=${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      console.log(data)

      
      setAutomaticReturn(data.automaticReturnOn);
      setRecurrentPayment(data.recurrentPaymentOn);
      setStartDate(data.startDate ? data.startDate : new Date());      
      setSelectedMerchant(data.merchant.merchantName);      

      return data;
    },
  });
  
  const updateEmployeeMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await fetch('/api/employee/update-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        throw new Error(errorData.message || 'Wystąpił błąd podczas edycji pracownika');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
      showToastNotificationSuccess("Sukces", "Dane pracownika zostały zaktualizowane pomyślnie")
      router.back();
    },
    onError: (error) => {
      console.error('Error updating employee:', error);
      showToastNotificationError("Wystąpił błąd", error.message)
    }
  });

  const onSubmit = (data) => {
    const body = {
      ...data,
      automaticReturnOn: automaticReturn,
      recurrentPaymentOn: recurrentPayment,
      startDate: startDate,
      id
    }

    if (!recurrentPayment) {
      body.paymentAmount = null;
      body.paymentFrequency = null;
      body.startDate = null;
    }

    updateEmployeeMutation.mutate(body);
  };

  if (isPending) {
    return <div className="flex justify-center items-center h-screen">Ładowanie...</div>
  }

  return (
    <AdminLayout path={["Pracownicy", "Konto pracownika", "Edycja"]} firstPath="employees">
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
                    defaultValue={employee.paymentAmount ? employee.paymentAmount : 0}
                    {...register("paymentAmount", {
                      validate: (value) => {
                        if (recurrentPayment && !value) {
                          return "Wartość kwoty przesyłanej cyklicznie jest wymagana";
                        }
                        if (recurrentPayment && value && !/^[0-9]+$/.test(value)) {
                          return "Wartość musi być liczbą";
                        }
                        return true;
                      },
                      valueAsNumber: true,
                    })}
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
                    defaultValue={employee.paymentAmountPit ? employee.paymentAmountPit : 0}
                    {...register("paymentAmountPit", {
                      required: recurrentPayment ?  "Wartość kwoty jest wymagana" : false,
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Wartość musi być liczbą",
                      },
                      valueAsNumber: true,
                    })}
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
                  defaultValue={employee.paymentFrequency}
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
              <p className="block text-sm mb-2">
                {selectedMerchant}
              </p>
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
                  defaultValue={employee.firstName}
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
                  defaultValue={employee.lastName}
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
                  defaultValue={employee.email}
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
                  defaultValue={employee.pesel}
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
                  defaultValue={employee.idPassportNumber}
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
                    pattern: {
                      value: /^(\+\d{1,3}[- ]?)?\d{4,15}$/,
                      message: "Niepoprawny format numeru telefonu"
                    }
                  })}
                  defaultValue={employee.user.phone}
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
                  defaultValue={employee.accountNumber}
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
                  defaultValue={employee.country}
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
                  defaultValue={employee.postalCode}
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
                  defaultValue={employee.city}
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
                  defaultValue={employee.street}
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
                  defaultValue={employee.houseNumber}
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
                  defaultValue={employee.apartmentNumber}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-[8px]">
            <ButtonGreen title="Zatwierdź zmiany" type="submit" disabled={isPending} />
            <ButtonGray title="Anuluj" onPress={() => router.back()}/>            
          </div>
        </form>
      </MainComponent>
    </AdminLayout>
  );
}
