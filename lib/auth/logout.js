import { redirect } from "next/navigation";

export async function logout() {
  const response = await fetch("/api/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    redirect("/login");
  } else {
    const errorData = await response.json();
    console.log("Logout failed", errorData);
  }
}
