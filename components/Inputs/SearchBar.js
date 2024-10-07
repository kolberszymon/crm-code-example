import Image from "next/image";

export const SearchBar = ({ value, setValue, extraCss, placeholder }) => {
  return (
    <div
      className={`border border-zinc-400 rounded-lg flex items-center justify-between w-[250px] overflow-hidden ${extraCss}`}
    >
      <input
        type="text"
        placeholder={placeholder ?? "Szukaj"}
        value={value ?? ""}
        className="text-zinc-950 text-xs font-medium leading-tight pl-2 py-2 flex-1 outline-none"
        onChange={(e) => setValue(e.target.value)}
        style={{
          WebkitAppearance: 'none',
          MozAppearance: 'textfield',
          appearance: 'textfield',
          margin: 0,
          boxSizing: 'border-box',
          minWidth: 0,
        }}
      />
      <div className="p-2">
        <Image src="/icons/magnifying-glass.svg" width={17} height={17} alt="search" />
      </div>
    </div>
  );
};