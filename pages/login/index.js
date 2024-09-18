import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/Layouts/AuthLayout";
import { signIn, getSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Role } from "@prisma/client";

export default function Login() {
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (formData) => {
    const signInResponse = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (signInResponse && !signInResponse.error) {
      // I want to check user role and redirect to the correct page
      const session = await getSession();

      console.log(session);
      if (session.user.role === Role.ADMIN) {
        router.push("/admin/dashboard");
      } else if (session.user.role === Role.MERCHANT_EDIT || session.user.role === Role.MERCHANT_VIEW) {
        router.push("/merchant/dashboard");
      }
    } else {
      setErrorMessage("Błędny email lub hasło");
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

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
              Zaloguj się
            </h4>
            <p className="text-sm font-normal text-[#002d21]">
              Wpisz swój adres email i hasło by się zalogować
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
                    {...register("password", {
                      required: "Hasło jest wymagane",
                      minLength: {
                        value: 6,
                        message: "Hasło musi mieć co najmniej 6 znaków",
                      },
                    })}
                    type="password"
                    placeholder="Hasło"
                    className="px-[16px] py-[10px] text-sm font-semibold flex-1 outline-none rounded-md"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {errorMessage && (
                <div className="text-red-500 text-sm mb-[24px]">
                  {errorMessage}
                </div>
              )}
              <Link
                href="/forgot-password"
                className="flex items-center justify-end w-full"
              >
                <p className="text-sm font-semibold text-[#888ea8]">
                  Nie pamiętasz hasła?
                </p>
              </Link>
              
              <button
                className={`bg-main-green text-white text-base font-semibold rounded-md py-[10px] mt-[8px] flex items-center justify-center ${isSubmitting ? 'opacity-70' : ''}`}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (                  
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />                  
                ) : (
                  'Zaloguj się'
                )}
              </button>
              <Link
                href="/trainings"
                className={`bg-white text-main-green border border-main-green hover:bg-gray-100 transition-colors text-base font-semibold rounded-md py-[10px] mt-[8px] flex items-center justify-center ${isSubmitting ? 'opacity-70' : ''}`}                             
              >
                Zobacz szkolenia
              </Link>
            </form>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
