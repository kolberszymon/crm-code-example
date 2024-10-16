import { useState, useEffect } from "react";
import Image from "next/image";
import { DatePickerWithRange } from "@/components/Custom/DatePickerRange";
import { useQuery, useQueryClient } from "@tanstack/react-query";
export const TransactionsEmployeesMerchants = () => {
  const [date, setDate] = useState(null)
  const queryClient = useQueryClient()

  // create useQuery to fetch data
  const { data, isPending } = useQuery({
    queryKey: ['transactions-employees-merchants'],
    queryFn: async () => {
      let url;

      if (date && date.from && date.to) {
        url = `/api/transactions/employees-merchants?from=${date.from.toISOString()}&to=${date.to.toISOString()}`
      } else {
        url = `/api/transactions/employees-merchants`
      }

      const res = await fetch(url);
      const data = await res.json();
      
      return data;
    },
    onSuccess: (data) => {
      console.log("Success", data);
    },
    onError: (error) => {
      console.log("Error", error);
    }
  })

  useEffect(() => {
    if (date && date.from && date.to) {      
      queryClient.invalidateQueries({ queryKey: ['transactions-employees-merchants'] })
    }
  }, [date])


  return (
    <div className="flex flex-col min-w-[350px] justify-between gap-[16px]">
      <DatePickerWithRange className="w-[235px] bg-white border border-zinc-400 rounded-md" date={date} setDate={setDate}/>
      <div className="h-[128px] bg-white w-full flex flex-col py-[22px] pl-[16px] items-start justify-between rounded shadow overflow-hidden relative">
        <div className="flex flex-row items-center gap-2">
          <div className="bg-[#e2a13f21] w-[30px] h-[30px] flex items-center justify-center rounded-full">
            <Image src="/icons/card-orange.svg" width={15} height={15} alt="card-orange" />
          </div>
          <div className="flex flex-col">
            <p className="text-base font-semibold">{data?.transactions ?? 0}</p>
            <p className="text-xs">Ilość zrealizowanych transakcji</p>
          </div>
        </div>
        <Image
          src="/icons/chart-orange.svg"
          width={400}
          height={200}
          className="absolute right-0 bottom-0 left-0"
          alt="chart-orange"
        />
      </div>
      <div className="flex flex-row gap-[32px]">
        <div className="h-[128px] bg-white w-full flex flex-col py-[22px] pl-[16px] items-start justify-between rounded shadow relative overflow-hidden">
          <div className="flex flex-row items-center gap-2">
            <div className="bg-[#e2a13f21] w-[30px] h-[30px] flex items-center justify-center rounded-full">
              <Image
                src="/icons/profile-circle-orange.svg"
                width={20}
                height={20}
                alt="profile-circle-orange"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-base font-semibold">{data?.employees ?? 0}</p>
              <p className="text-xs">Pracownicy</p>
            </div>
            <Image
              src="/icons/chart-orange-steep.svg"
              width={400}
              height={200}
              className="absolute right-0 bottom-0 left-0"
              alt="chart-orange-steep"
            />
          </div>
        </div>
        <div className="h-[128px] bg-white w-full flex flex-col py-[22px] pl-[16px] items-start justify-between rounded shadow relative overflow-hidden">
          <div className="flex flex-row items-center gap-2">
            <div className="bg-[#01563f2d] w-[30px] h-[30px] flex items-center justify-center rounded-full">
              <Image
                src="/icons/profile-circle-green.svg"
                width={20}
                height={20}
                alt="profile-circle-green"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-base font-semibold">{data?.merchants ?? 0}</p>
              <p className="text-xs">Merchanci</p>
            </div>
            <Image
              src="/icons/chart-green.svg"
              width={400}
              height={200}
              className="absolute right-0 bottom-0 left-0"
              alt="chart-green"
            />
          </div>
        </div>
      </div>
    </div>
  )
}