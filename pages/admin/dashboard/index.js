"use client";

import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { MainComponentTransparent } from "@/components/MainComponentTransparent";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Tooltip,
  Area,
} from "recharts";
import Image from "next/image";
import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { DatePickerWithRange } from "@/components/Custom/DatePickerRange";
import TokenBalance from "@/components/pages/dashboard/TokenBalance";


export default function Home() {
  const [data, setData] = useState([
    {
      name: "Sty",
      uv: 17,
      pv: 13,
    },
    {
      name: "Lut",
      uv: 19,
      pv: 14,
    },
    {
      name: "Mar",
      uv: 9,
      pv: 11,
    },
    {
      name: "Kwi",
      uv: 20,
      pv: 13,
    },
    {
      name: "Maj",
      uv: 11,
      pv: 14,
    },
    {
      name: "Cze",
      uv: 17,
      pv: 13,
    },
  ]);

  return (
    <AdminLayout path={["Dashboard"]}>
      <MainComponentTransparent>
        {/* Top side of dashboard */}
        <div className="flex flex-row gap-[25px]">
          {/* Top Left Chart */}
          <div className="flex-1 min-h-[300px]">
            <div className="bg-white p-6 pr-0 rounded-md shadow-md">
              <h3 className="text-lg font-semibold mb-2">Obrót tokenów</h3>
              <div className="flex flex-row items-center justify-between pr-8">
                <div className="flex flex-col">
                  <p className="text-sm">
                    Wysłanych <span className="text-main-orange">200 000</span>{" "}
                  </p>
                  <p className="text-sm">
                    Zwróconych <span className="text-main-green">120 000</span>
                  </p>
                </div>
                <div className="flex flex-col">
                  <div className="flex flex-row items-center gap-1">
                    <div className="bg-[#015640] w-[9px] h-[9px] rounded-full" />
                    <p className="text-xs">Tokeny zwrócone</p>
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <div className="bg-[#e59148] w-[9px] h-[9px] rounded-full" />
                    <p className="text-xs">Tokeny wysłane</p>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200} className="mt-6">
                <AreaChart
                  width={730}
                  height={250}
                  data={data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#015640" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#015640" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e59148" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#e59148" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    width={28}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="uv"
                    stroke="#015640"
                    fillOpacity={1}
                    fill="url(#colorUv)"
                  />
                  <Area
                    type="monotone"
                    dataKey="pv"
                    stroke="#e59148"
                    fillOpacity={1}
                    fill="url(#colorPv)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Token Balance & Transactions To Be Completed */}
          <div className="flex flex-col min-w-[350px] justify-between">
            <TokenBalance />
            <div className="min-h-[150px] bg-white w-full flex flex-col py-[22px] pl-[16px] items-start justify-between rounded shadow relative overflow-hidden">
              <div className="flex flex-col z-10">
                <p className="text-base font-semibold">
                  Transakcje do zrealizowania
                </p>

                <p className="text-sm">23</p>
              </div>
              <ButtonGreen title="Sprawdź transakcje" className="z-10" />
              <Image
                src="/icons/elipse.png"
                width={180}
                height={400}
                className="absolute right-0 top-0 bottom-0 opacity-30"
                alt="elipse"
              />
              <Image
                src="/icons/horse.png"
                width={216}
                height={240}
                className="absolute right-0 bottom-0"
                alt="horse"
              />
            </div>
          </div>
        </div>

        {/* Bottom side of dashboard */}
        <div className="flex flex-row gap-[25px] mt-10">
          {/* Top Left Chart */}
          <div className="flex-1 min-h-[300px]">
            <div className="bg-white p-6 pr-0 rounded-md shadow-md">
              <h3 className="text-lg font-semibold mb-2">Liczba merchantów</h3>
              <div className="flex flex-row items-center justify-between pr-8">
                <div className="flex flex-col">
                  <p className="text-sm">
                    Liczba kont view{" "}
                    <span className="text-main-orange">15</span>{" "}
                  </p>
                  <p className="text-sm">
                    Liczba kont edit <span className="text-main-green">3</span>
                  </p>
                </div>
                <div className="flex flex-col">
                  <div className="flex flex-row items-center gap-1">
                    <div className="bg-[#015640] w-[9px] h-[9px] rounded-full" />
                    <p className="text-xs">Konto edit</p>
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <div className="bg-[#e59148] w-[9px] h-[9px] rounded-full" />
                    <p className="text-xs">Konto view</p>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200} className="mt-6">
                <AreaChart
                  width={730}
                  height={250}
                  data={data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#015640" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#015640" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e59148" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#e59148" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    width={28}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="uv"
                    stroke="#015640"
                    fillOpacity={1}
                    fill="url(#colorUv)"
                  />
                  <Area
                    type="monotone"
                    dataKey="pv"
                    stroke="#e59148"
                    fillOpacity={1}
                    fill="url(#colorPv)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Number of transactions, Employees, Merchants */}
          <div className="flex flex-col min-w-[350px] justify-between gap-[16px]">
            <DatePickerWithRange className="w-[235px] bg-white border border-zinc-400 rounded-md"/>
            <div className="h-[128px] bg-white w-full flex flex-col py-[22px] pl-[16px] items-start justify-between rounded shadow overflow-hidden relative">
              <div className="flex flex-row items-center gap-2">
                <div className="bg-[#e2a13f21] w-[30px] h-[30px] flex items-center justify-center rounded-full">
                  <Image src="/icons/card-orange.svg" width={15} height={15} alt="card-orange" />
                </div>
                <div className="flex flex-col">
                  <p className="text-base font-semibold">251</p>
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
                    <p className="text-base font-semibold">1.2k</p>
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
                    <p className="text-base font-semibold">4</p>
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
        </div>
      </MainComponentTransparent>
    </AdminLayout>
  );
}
