import Image from "next/image";

export const SearchBar = ({ value, setValue, extraCss }) => {
  return (
    <div
      className={`border border-zinc-400 rounded-lg flex flex-row items-center justify-between pr-[8px] focus-within:border-[#0e1726] transition-colors w-[250px] ${extraCss}`}
    >
      <input
        type="text"
        placeholder="Szukaj"
        value={value ?? ""}
        className="text-zinc-950 text-xs font-medium leading-tight pl-[8px] py-[8px] rounded-lg focus:outline-none placeholder-zinc-400" // Add padding to the left
        onChange={(e) => setValue(e.target.value)}
      />
      <Image src="/icons/magnifying-glass.svg" width={17} height={17} />
    </div>
  );
};