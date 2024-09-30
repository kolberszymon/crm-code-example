export const ButtonMustard = ({ title, onPress, disabled = false, type = "button" }) => {
  return (
    <button
      className="px-[16px] py-[8px] bg-[#c66a1e] hover:bg-[#a6591a] rounded-md justify-center items-center inline-flex transition-all z-10 disabled:opacity-70"
      onClick={onPress}
      disabled={disabled}
      type={type}
    >
      <p className="text-[#ebefee] text-xs font-medium leading-tight">
        {title}
      </p>
    </button>
  );
};
