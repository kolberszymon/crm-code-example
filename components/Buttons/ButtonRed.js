export const ButtonRed = ({ title, onPress }) => {
  return (
    <button
      className="px-[16px] py-[8px] bg-[#dc2626] hover:bg-[#b43b3b] rounded-md justify-center items-center inline-flex transition-all z-10"
      onClick={onPress}
    >
      <p className="text-[#ebefee] text-xs font-medium leading-tight">
        {title}
      </p>
    </button>
  );
};
