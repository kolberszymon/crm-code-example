import { useState } from "react";
import Image from "next/image";
import { LogTile } from "../Custom/LogTile";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchLogs } from "@/lib/api-functions/fetch-logs";

export const NotificationBell = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: logs, isLoading } = useQuery({
    queryKey: ["logs"],
    queryFn: async () => {
      const response = await fetch("/api/logs/fetch-10");
      const data = await response.json();
      return data;
    },
  });

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative">
      <button
        className="flex items-center justify-center bg-main-gray w-[36px] h-[36px] rounded-full hover:bg-gray-200 transition-colors relative"
        onClick={toggleDropdown}
      >
        <div className="flex items-center justify-center bg-[#00ab5630] w-[14px] h-[14px] rounded-full absolute top-0 right-0 opac">
          <div className="bg-[#00ab55] w-[6px] h-[6px] rounded-full" />
        </div>

        <Image
          src="/icons/bell-icon.svg"
          alt="Notifications"
          width={24}
          height={24}        
        />
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-4 w-[352px] bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <h3 className="text-base font-semibold text-zinc-950 p-[10px]">
            Ostatnia aktywność
          </h3>
          {/* Divider */}
          <div className="w-full h-[1.1px] bg-main-gray" />

          <div>
            {isLoading ? <p>Ładowanie...</p> : logs.map((log, index) => (
              <LogTile
                key={log.id}
                title={log.message}
                date={log.createdAt}
                type={log.icon.toLowerCase()}
                bottomLine={index !== logs.length - 1 && logs.length > 1}
              />
            ))}
          </div>
          {/* Divider */}
          <div className="w-full h-[1.1px] bg-main-gray" />

          <Link href="/admin/change-history">
            <button
              className="w-full text-[#0e1726] text-xs font-medium hover:underline transition-colors p-[10px]"
              onClick={toggleDropdown}
            >
              Zobacz więcej
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};
