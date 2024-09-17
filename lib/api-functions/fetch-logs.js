export async function fetchLogs() {
  const res = await fetch('/api/logs/fetch');
  const data = await res.json();

console.log(data);
  return data;
}