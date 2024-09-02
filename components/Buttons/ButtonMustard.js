"use client";

export const ButtonMustard = ({ title, onPress }) => {
  return (
    <button
      className="px-[16px] py-[8px] bg-[#c66a1e] hover:bg-[#a6591a] rounded-md justify-center items-center inline-flex transition-all"
      onClick={onPress}
    >
      <p className="text-[#ebefee] text-xs font-medium leading-tight">
        {title}
      </p>
    </button>
  );
};
