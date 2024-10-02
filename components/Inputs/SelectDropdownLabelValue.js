import Image from "next/image";

export const SelectDropdownLabelValue = ({ value, setValue, options, extraCss }) => {
  return (
    <div className="relative border border-zinc-400 rounded-md flex flex-row pr-[8px] hover:cursor-pointer hover:border-[#0e1726] transition-colors">
      <select
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        className={`px-[8px] py-[8px] text-zinc-400 rounded-md text-xs font-medium appearance-none hover:cursor-pointer outline-none ${extraCss} text-zinc-950 `}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} >
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-[8px] top-1/2 transform -translate-y-1/2 pointer-events-none">
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