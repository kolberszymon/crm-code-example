export const MerchantType = ({ type }) => {

  const getColor = (type) => {
    switch (type) {
      case "View":
        return "border-main-blue text-main-blue";
      case "Edit":
        return "border-main-orange text-main-orange";
      case "Admin":
        return "border-purple-500 text-purple-500";
      default:
        return "";
    };
  };
  return (
    <div
      className={`border rounded-md flex items-center justify-center font-medium px-[8px] py-[2px] ${getColor(type)}`}
    >
      <p className="text-xs font-medium leading-tight">{type}</p>
    </div>
  );
};
