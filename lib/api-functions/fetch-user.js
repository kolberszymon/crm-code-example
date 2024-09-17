export const fetchUser = async (id) => {
  const res = await fetch(`/api/users/${id}`);
  const data = await res.json();

  return data;
}