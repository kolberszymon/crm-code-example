import Image from "next/image";

const TypeCircles = {
  plus: (
    <div className="bg-[#e59148] p-[10px] rounded-full">
      <Image src="/icons/plus-white-icon.svg" width={16} height={16} />
    </div>
  ),
  coin: (
    <div className="bg-[#ebefee] p-[10px] rounded-full">
      <Image src="/icons/coin.svg" width={16} height={16} />
    </div>
  ),
};

export const LogTile = ({ title, date, type, topLine }) => {
  return (
    <div className="flex flex-row p-[10px] gap-[8px] items-center">
      <div className="flex flex-col gap-[10px] items-center">
        {type === "plus" && (
          <div className="bg-[#e59148] p-[10px] rounded-full relative">
            <Image src="/icons/plus-white-icon.svg" width={16} height={16} />
          </div>
        )}
        {type === "coin" && (
          <div className="bg-[#ebefee] p-[10px] rounded-full relative">
            <Image src="/icons/coin.svg" width={16} height={16} />
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <p className="text-xs font-medium text-figma-black">{title}</p>
        <p className="text-zinc-600 text-xs font-normal">{date}</p>
      </div>
    </div>
  );
};
