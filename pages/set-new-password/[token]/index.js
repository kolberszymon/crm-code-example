import Image from "next/image";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";
import { AuthLayout } from "@/components/Layouts/AuthLayout";
import { useQuery, useMutation } from "@tanstack/react-query";
import Link from "next/link";

export default function SetNewPassword() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { token } = useRouter().query;
  const router = useRouter();
  

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues
  } = useForm();

  const {data: passwordSetLink, isLoading} = useQuery({
    queryKey: ['passwordSetLink', token],
    queryFn: async () => {
      const res = await fetch(`/api/password-set-link/fetch-one?token=${token}`);
      
      const data = await res.json();

      console.log(data);
      return data;
    },
  });

  // useMutation update password
  const {mutate: updatePassword, isLoading: isUpdatingPassword} = useMutation({
    mutationFn: async (formData) => {
      const res = await fetch(`/api/password-set-link/update-password`, {
        method: 'POST',
        body: JSON.stringify({token, password: formData.password}),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message);
      }

      return data;
    },
    onSuccess: () => {
      setSuccessMessage("Hasło zostało zmienione, nastąpi przekierowanie do logowania");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    },
    onError: () => {
      setErrorMessage("Wystąpił błąd podczas zmiany hasła");
    },
  });

  const onSubmit = async (formData) => {
    updatePassword(formData);
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center">
        <Link href="/login">
          <Image src="/logo.svg" width={241} height={62} alt="logo" />
        </Link>
        <div className="flex flex-row mt-[40px] rounded-3xl overflow-hidden h-[549px] border border-main-green">
          <Image
            src="/images/monlib-horse.png"
            width={585}
            height={549}
            alt="horse"
          />
          <div className="w-[585px] h-[549px] bg-white pl-[109px] pr-[48px] py-[70px] flex flex-col">
            <h4 className="text-4xl font-extrabold text-main-green">
              Ustaw nowe hasło
            </h4>
            <p className="text-sm font-normal text-[#002d21]">
              Wpisz nowe hasło
            </p>
            {isLoading ? <div>Ładownie...</div> : 
              <form
                className="py-[24px] flex flex-col gap-[16px]"
                onSubmit={handleSubmit(onSubmit)}
              >              
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
                <div className="flex flex-col gap-[6px]">
                  <label className="text-sm font-semibold text-[#002d21]">
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
                      {...register("passwordConfirmation", {
                        required: "Powtórz hasło jest wymagane",
                        validate: (value) => {
                          if (value !== getValues("password")) {
                            return "Powtórzone hasło musi być identyczne";
                          }
                        },
                      })}
                      type="password"
                      placeholder="Powtórz hasło"
                      className="px-[16px] py-[10px] text-sm font-semibold flex-1 outline-none rounded-md"
                    />
                  </div>
                  {errors.passwordConfirmation && (
                    <p className="text-red-500 text-sm">{errors.passwordConfirmation.message}</p>
                  )}
                </div>

                {errorMessage && (
                  <div className="text-red-500 text-sm mb-[24px]">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="text-green-500 text-sm mb-[24px]">
                    {successMessage}
                  </div>
                )}
                {passwordSetLink && passwordSetLink.isActive ? 
                <button
                  className="bg-main-green text-white text-base font-semibold rounded-md py-[10px] mt-[8px] disabled:bg-gray-400"
                  type="submit"
                  disabled={!isValid || isUpdatingPassword}
                >
                  Zmień hasło
                </button>
                :
                <div className="text-red-500 text-sm mb-[24px]">Niepoprawny link lub link wygasł</div>
                }
              </form>
            }
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
