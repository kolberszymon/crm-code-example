import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Admin = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return null;
};

export default Admin;
