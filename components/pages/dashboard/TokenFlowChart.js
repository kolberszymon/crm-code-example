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

import { useQuery } from "@tanstack/react-query";

export const TokenFlowChart = () => {

  // useQuery to fetch data from API
  const { data, isPending } = useQuery({
    queryKey: ['token-flow-chart'],
    queryFn: async () => {
      const res = await fetch('/api/transactions/fetch-all-for-chart');
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

  const formatYAxis = (tickItem) => {
    return tickItem >= 1000 ? `${Math.round(tickItem / 1000)}k` : tickItem;
  };

  return (
    <div className="bg-white p-6 pr-0 rounded-md shadow-md">
      <h3 className="text-lg font-semibold mb-2">Obrót tokenów</h3>
      <div className="flex flex-row items-center justify-between pr-8">
        <div className="flex flex-col">          
          <p className="text-sm">
            Wysłanych <span className="text-main-orange">{isPending ? 0 : data.reduce((acc, curr) => acc + curr.wyslane, 0)}</span>{" "}
          </p> 
          <p className="text-sm">
            Zwróconych <span className="text-main-green">{isPending ? 0 : data.reduce((acc, curr) => acc + curr.zwrocone, 0)}</span>
          </p>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row items-center gap-1">
            <div className="bg-[#e59148] w-[9px] h-[9px] rounded-full" />
            <p className="text-xs">Tokeny wysłane</p>
          </div>
          <div className="flex flex-row items-center gap-1">
            <div className="bg-[#015640] w-[9px] h-[9px] rounded-full" />
            <p className="text-xs">Tokeny zwrócone</p>
          </div>          
        </div>
      </div>
      {!isPending ? (
      <ResponsiveContainer width="100%" height={200} className="mt-6">
        <AreaChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
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
            tickFormatter={formatYAxis}
          />
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="zwrocone"
            stroke="#015640"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
          <Area
            type="monotone"
            dataKey="wyslane"
            stroke="#e59148"
            fillOpacity={1}
            fill="url(#colorPv)"
          />
        </AreaChart>
        </ResponsiveContainer>
      ) : <div className="h-[200px] w-[98%] bg-gray-100 animate-pulse mt-[30px]" />}
    </div>
  );
};