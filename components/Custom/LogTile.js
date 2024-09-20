import Image from "next/image";
import { format } from "date-fns";

const TypeCircles = {
  plus: (
    <div className="bg-[#e59148] p-[10px] rounded-full">
      <Image src="/icons/plus-white-icon.svg" width={16} height={16} alt="plus-white-icon" />
    </div>
  ),
  coin: (
    <div className="bg-[#ebefee] p-[10px] rounded-full">
      <Image src="/icons/coin.svg" width={16} height={16} alt="coin-icon" />
    </div>
  ),
};
export const LogTile = ({ title, date, type, bottomLine }) => {
  return (
    <>
    <div className="flex flex-row p-[10px] gap-[8px] items-center">
      <div className="flex flex-col gap-[10px] items-center">
        {type === "plus" && (
          <div className="bg-[#e59148] p-[10px] rounded-full relative w-[36px] h-[36px]">
            <Image src="/icons/plus-white-icon.svg" width={16} height={16} alt="plus-white-icon" />
          </div>
        )}
        {type === "coin" && (
          <div className="bg-[#ebefee] p-[10px] rounded-full relative w-[36px] h-[36px]">
            <Image src="/icons/coin.svg" width={16} height={16} alt="coin-icon" />
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <p className="text-xs font-medium text-figma-black">{title}</p>
        <p className="text-zinc-600 text-xs font-normal">{format(new Date(date), 'dd.MM.yyyy')}</p>
      </div>
    </div>
      {bottomLine && (
      <div className="px-[10px]">
        <div className="ml-[18px] h-[10px] w-[1.3px] bg-[#bfc9d4]" />
      </div>
      )}
    </>

  );
};
