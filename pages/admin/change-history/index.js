import { MainComponent } from "@/components/MainComponent";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { SearchBar } from "@/components/Inputs/SearchBar";
import { useState } from "react";
import { LogTile } from "@/components/Custom/LogTile";
import { DatePickerWithRange } from "@/components/Custom/DatePicker";

export default function Home() {
  const [searchValue, setSearchValue] = useState("");

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
          
           <LogTile
              title={"Dodanie merchanta (John Doe)"}
              date={"12.06.2024"}
              type={"plus"}
            />
            <div className="px-[10px]">
              <div className="ml-[18px] h-[10px] w-[1.3px] bg-[#bfc9d4]" />
            </div>
            <LogTile
              title={"Wysłanie tokenów do merchanta (John Doe)"}
              date={"12.06.2024"}
              type={"coin"}
              topLine={true}
            />
             <div className="px-[10px]">
              <div className="ml-[18px] h-[10px] w-[1.3px] bg-[#bfc9d4]" />
            </div>
            <LogTile
              title={"Wysłanie tokenów do merchanta"}
              date={"12.06.2024"}
              type={"coin"}
              topLine={true}
            />
             <div className="px-[10px]">
              <div className="ml-[18px] h-[10px] w-[1.3px] bg-[#bfc9d4]" />
            </div>
            <LogTile
              title={"Wysłanie tokenów do merchanta"}
              date={"12.06.2024"}
              type={"coin"}
              topLine={true}
            />
             <div className="px-[10px]">
              <div className="ml-[18px] h-[10px] w-[1.3px] bg-[#bfc9d4]" />
            </div>
            <LogTile
              title={"Wysłanie tokenów do merchanta"}
              date={"12.06.2024"}
              type={"coin"}
              topLine={true}
            />
             <div className="px-[10px]">
              <div className="ml-[18px] h-[10px] w-[1.3px] bg-[#bfc9d4]" />
            </div>
            <LogTile
              title={"Wysłanie tokenów do merchanta"}
              date={"12.06.2024"}
              type={"coin"}
              topLine={true}
            />
             <div className="px-[10px]">
              <div className="ml-[18px] h-[10px] w-[1.3px] bg-[#bfc9d4]" />
            </div>
            <LogTile
              title={"Dodanie merchanta (John Doe)"}
              date={"12.06.2024"}
              type={"plus"}
            />
        </div>

      </MainComponent>
    </AdminLayout>
  );
}
