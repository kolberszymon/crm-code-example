export const fetchMerchants = async () => {
  const response = await fetch("/api/merchant/fetch-all");
  const data = await response.json();

  console.log(data);
  return data;
};