import Image from "next/image";

export const SelectDropdown = ({ value, setValue, options, extraCss }) => {
  return (
    <div className="relative border border-zinc-400 rounded-md flex flex-row min-w-[80px] hover:cursor-pointer hover:border-[#0e1726] transition-colors">
      <select
        value={value} // Bind value to merchantType state
        onChange={(e) => {
          setValue(e.target.value);
        }}
        className={`w-full pl-[8px] pr-[20px] py-[9px] text-zinc-950 rounded-md text-xs font-medium appearance-none hover:cursor-pointer outline-none ${extraCss}`}
      >
        {options.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <div className="absolute right-[4px] top-1/2 transform -translate-y-1/2 pointer-events-none">
        <Image
          src="/icons/arrow-down-black.svg"
          width={16}
          height={16}
          alt="Arrow down"
        />
      </div>
    </div>
  );
};
