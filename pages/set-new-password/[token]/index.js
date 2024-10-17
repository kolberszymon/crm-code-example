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
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const { token, type } = useRouter().query;
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
      router.push("/login");    
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
              {type === 'forgotPassword' ? 'Zmień hasło' : 'Ustaw nowe hasło'}
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
                  <div className="flex flex-row border border-main-gray rounded-md pl-[16px] focus-within:border-zinc-800 transition-colors items-center">
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
                      type={showPassword ? "text" : "password"}
                      placeholder="Hasło"
                      className="px-[16px] py-[10px] text-sm flex-1 outline-none rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="w-[30px] h-[30px] mr-[8px] rounded-full hover:bg-gray-200 bg-zinc-100 flex items-center justify-center focus:outline-none"
                    >
                      {showPassword ? (
                        <Image width={16} height={16} src="/icons/eye-closed.svg" className="text-gray-500" />
                      ) : (
                        <Image width={16} height={16} src="/icons/eye.svg" className="text-gray-500" />
                      )}
                    </button>
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
                  <div className="flex flex-row border border-main-gray rounded-md pl-[16px] focus-within:border-zinc-800 transition-colors items-center">
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
                      type={showPasswordConfirmation ? "text" : "password"}
                      placeholder="Powtórz hasło"
                      className="px-[16px] py-[10px] text-sm flex-1 outline-none rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                      className="w-[30px] h-[30px] mr-[8px] rounded-full hover:bg-gray-200 bg-zinc-100 flex items-center justify-center focus:outline-none"
                    >
                      {showPasswordConfirmation ? (
                        <Image width={16} height={16} src="/icons/eye-closed.svg" className="text-gray-500" />
                      ) : (
                        <Image width={16} height={16} src="/icons/eye.svg" className="text-gray-500" />
                      )}
                    </button>
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
                  {type === 'forgotPassword' ? 'Zmień hasło' : 'Ustaw hasło'}
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
