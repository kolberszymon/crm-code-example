import { useState } from "react";
import Image from "next/image";
import { LogTile } from "../Custom/LogTile";
import Link from "next/link";

export const NotificationBell = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
