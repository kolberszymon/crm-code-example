"use client";

import { AuthLayout } from "@/components/Layouts/AuthLayout";
import Image from "next/image";
import { useState } from "react";

export default function Login() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <AuthLayout>
      <div className="flex flex-col items-center">
        <Image src="/logo.svg" width={241} height={62} alt="logo" />
        <div className="flex flex-row mt-[40px] rounded-3xl overflow-hidden h-[549px] border border-main-green">
          <Image
            src="/images/monlib-horse.png"
            width={585}
            height={549}
            alt="horse"
          />
          <div className="w-[585px] h-[549px] bg-white pl-[109px] pr-[48px] py-[70px] flex flex-col">
            <h4 className="text-4xl font-extrabold text-main-green">
              Dokończ Rejestrację
            </h4>
            <p className="text-sm font-normal text-[#002d21]">
              Utwórz swoje hasło aby dokończyć proces rejestracji
            </p>
            <form className="py-[24px] flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[6px]">
                <label className="text-sm font-semibold text-[#002d21]">
                  Hasło
                </label>
                <div className="flex flex-row border border-main-gray rounded-md pl-[16px] focus-within:border-zinc-800 transition-colors">
                  <Image
                    src="/icons/lock-password-icon.svg"
                    width={18}
                    height={18}
                    alt="eye"
                    className=""
                  />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Hasło"
                    className=" px-[16px] py-[10px] text-sm font-semibold flex-1 outline-none rounded-md"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-sm font-semibold text-[#002d21] ">
                  Powtórz hasło
                </label>
                <div className="flex flex-row border border-main-gray rounded-md pl-[16px] focus-within:border-zinc-800 transition-colors">
                  <Image
                    src="/icons/lock-password-icon.svg"
                    width={18}
                    height={18}
                    alt="eye"
                    className=""
                  />
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    placeholder="Powtórz hasło"
                    className=" px-[16px] py-[10px] text-sm font-semibold flex-1 outline-none rounded-md"
                  />
                </div>
              </div>
            </form>
            <button className="bg-main-green text-white text-base font-semibold rounded-md py-[10px]">
              Zarejestruj się
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
