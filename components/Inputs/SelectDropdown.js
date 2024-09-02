import Image from "next/image";

export const SelectDropdown = ({ value, setValue, options, extraCss }) => {
  return (
    <div className="border border-zinc-400 rounded-md flex flex-row pr-[8px] hover:cursor-pointer hover:border-[#0e1726] transition-colors">
      <select
        value={value} // Bind value to merchantType state
        onChange={(e) => {
          setValue(e.target.value);
        }}
        className={`px-[8px] py-[7.5px] text-zinc-400 rounded-md text-xs font-medium appearance-none hover:cursor-pointer outline-none ${extraCss}`}
      >
        {options.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <Image
        src="/icons/arrow-down-black.svg"
        width={16}
        height={16}
        alt="Arrow down"
        className=""
      />
    </div>
  );
};
