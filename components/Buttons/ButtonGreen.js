export const ButtonGreen = ({ title, onPress, disabled = false, type = "button" }) => {
  return (
    <button
      className="px-[16px] py-[8px] bg-[#015640] hover:bg-[#01563fa6] rounded-md justify-center items-center inline-flex transition-all z-10 disabled:opacity-70"
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
