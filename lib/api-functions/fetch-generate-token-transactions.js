export const fetchGenerateTokenTransactions = async () => {  
  const res = await fetch('/api/transactions/generate-tokens');
  const data = await res.json();
  return data;
};