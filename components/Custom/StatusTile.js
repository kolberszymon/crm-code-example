const STATUS = {
  redLight: {
    bg: "bg-red-50",
    text: "text-red-600",
  },
  greenLight: {
    bg: "bg-green-50",
    text: "text-[#00a155]",
  },
};

export const StatusTile = ({ title, status }) => {
  return (
    <div
      className={`${STATUS[status].bg} px-[12px] py-[4px] flex items-center justify-center rounded-[20px]`}
    >
      <p className={`${STATUS[status].text} text-xs font-normal`}>{title}</p>
    </div>
  );
};
