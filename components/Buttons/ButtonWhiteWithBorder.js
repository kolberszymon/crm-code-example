"use client";

export const ButtonWhiteWithBorder = ({ title, onPress, type }) => {
  return (
    <button
      className="px-[16px] py-[8px] bg-white hover:bg-gray-100 rounded-md justify-center items-center inline-flex transition-all border border-[#002d21]"
      onClick={onPress}
      type={type}
    >
      <p className="text-[#002d21] text-xs font-medium leading-tight">
        {title}
      </p>
    </button>
  );
};
