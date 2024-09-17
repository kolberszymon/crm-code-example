import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/Layouts/AuthLayout";
import { useMutation } from "@tanstack/react-query";
import { showToastNotificationError } from "@/components/Custom/ToastNotification";

export default function Login() {
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm();

  // useMutation for sending password set link
  const { mutate, isLoading } = useMutation({
    mutationFn: async (formData) => {
      const res = await fetch("/api/email/send-set-password-link", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      return res.json();
    },
    onSuccess: (data) => {
      router.push("/password-reset-link-sent");
    },
    onError: (error) => {
      router.push("/password-reset-link-sent");
    },
  });

  const onSubmit = async (formData) => {
    mutate(formData);
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center">
        <Image src="/logo.svg" width={241} height={62} alt="logo" />
        <div className="flex flex-row mt-[40px] rounded-3xl overflow-hidden h-[549px] border border-main-green">
          <Image
            src="/images/forgot-password.png"
            width={585}
            height={549}
            alt="horse"
          />
          <div className="w-[585px] h-[549px] bg-white pl-[109px] pr-[48px] py-[70px] flex flex-col justify-center">
            <h4 className="text-4xl font-extrabold text-main-green">
              Odzyskaj hasło
            </h4>
            <p className="text-sm font-normal text-[#002d21]">
              Na Twój adres email prześlemy link do zmiany hasła
            </p>
            <form
              className="py-[24px] flex flex-col gap-[16px]"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-[6px]">
                <label className="text-sm font-semibold text-[#002d21]">
                  Email
                </label>
                <div className="flex flex-row border border-main-gray rounded-md pl-[16px] focus-within:border-zinc-800 transition-colors">
                  <Image
                    src="/icons/login-user.svg"
                    width={18}
                    height={18}
                    alt="eye"
                    className=""
                  />
                  <input
                    {...register("email", {
                      required: "Email jest wymagany",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "Wprowadź poprawny email",
                      },
                    })}
                    type="text"
                    placeholder="Email"
                    className="px-[16px] py-[10px] text-sm font-semibold flex-1 outline-none rounded-md"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              
              {errorMessage && (
                <div className="text-red-500 text-sm mb-[24px]">
                  {errorMessage}
                </div>
              )}

              <button
                className="bg-main-green text-white text-base font-semibold rounded-md py-[10px] mt-[24px] disabled:bg-gray-400"
                type="submit"
                disabled={!isValid || isLoading}
              >
                Odzyskaj hasło
              </button>
            </form>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
