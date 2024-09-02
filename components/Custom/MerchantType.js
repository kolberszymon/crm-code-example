export const MerchantType = ({ type }) => {
  return (
    <div
      className={`border rounded-md flex items-center justify-center font-medium px-[8px] py-[2px] ${
        type === "View"
          ? "border-main-blue text-main-blue"
          : "border-main-orange text-main-orange"
      }`}
    >
      <p className="text-xs font-medium leading-tight">{type}</p>
    </div>
  );
};
