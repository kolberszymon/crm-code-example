export const formatNumberWithSpaces = (number) => {
  return new Intl.NumberFormat("fr-Fr", {
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};
