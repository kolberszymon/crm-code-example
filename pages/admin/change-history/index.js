import { MainComponent } from "@/components/MainComponent";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { SearchBar } from "@/components/Inputs/SearchBar";
import { useState } from "react";
import { LogTile } from "@/components/Custom/LogTile";
import { DatePickerWithRange } from "@/components/Custom/DatePickerRange";
import { useQuery } from "@tanstack/react-query";
import { fetchLogs } from "@/lib/api-functions/fetch-logs";

export default function Home() {
  const [searchValue, setSearchValue] = useState("");

  const { data: logs, isPending } = useQuery({
    queryKey: ["logs"],
    queryFn: () => fetchLogs(),
  });

  if (isPending) {
    return <p>Ładowanie...</p>
  }

  return (
    <AdminLayout path={["Konto", "Historia zmian"]}>
      <MainComponent>
        <div className="p-[16px] border-zinc-200 border rounded-md">
          <p className="text-[#0e1726] text-base font-semibold">
            Historia zmian
          </p>
          <div className="flex flex-row items-center gap-[8px] my-[32px]">
          <SearchBar
          value={searchValue}
          setValue={setSearchValue}
            extraCss="my-[32px]"
          />
          <DatePickerWithRange className="w-[235px] bg-white border border-zinc-400 rounded-md"/>
          </div>

          {isPending ? <p>Ładowanie...</p> : logs.map((log, index) => (
            <LogTile
              key={log.id}
              title={log.message}
              date={log.createdAt}
              type={log.icon.toLowerCase()}
              bottomLine={index !== logs.length - 1 && logs.length > 1}
            />
          ))}

          {logs.length === 0 && <p>Brak logów</p>}
           
        </div>

      </MainComponent>
    </AdminLayout>
  );
}
