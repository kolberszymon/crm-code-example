export const ButtonGray = ({ title, onPress }) => {
  return (
    <button
      className="px-[16px] py-[8px] bg-[#ebefee] hover:bg-[#d9dada] rounded-md justify-center items-center inline-flex transition-all"
      onClick={onPress}
    >
      <p className="text-[#002d21] text-xs font-medium leading-tight">
        {title}
      </p>
    </button>
  );
};
