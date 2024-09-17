import Image from "next/image";
import { AuthLayout } from "@/components/Layouts/AuthLayout";
import Link from "next/link";

export default function PasswordResetLinkSent() {

  return (
    <AuthLayout>
      <div className="flex flex-col items-center">
        <Link href="/login">
          <Image src="/logo.svg" width={241} height={62} alt="logo" />
        </Link>
        <div className="flex flex-row mt-[40px] rounded-3xl overflow-hidden h-[549px] border border-main-green">
          <Image
            src="/images/password-reset-link-sent.png"
            width={585}
            height={549}
            alt="horse"
          />
          <div className="w-[585px] h-[549px] bg-white pl-[109px] pr-[48px] py-[70px] flex flex-col justify-center">
            <h4 className="text-4xl font-extrabold text-main-green">
              Link wysłany
            </h4>
            <p className="text-sm font-normal text-[#002d21]">
            Sprawdź swoją skrzynkę odbiorczą i kliknij w link aby zresetować hasło
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
