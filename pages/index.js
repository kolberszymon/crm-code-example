import Image from "next/image";
import Link from "next/link";

export default function Home() {
  //push to another page once page loads

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href="/admin/dashboard">
        <p>Go to admin dashboard</p>
      </Link>
    </main>
  );
}
