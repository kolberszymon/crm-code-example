import { useForm } from "react-hook-form";
import { MainComponent } from "@/components/MainComponent";
import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import { useState } from "react";
import { Modal } from "@/components/Modal";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import { useSession } from "next-auth/react";
import { showToastNotificationSuccess, showToastNotificationError } from "@/components/Custom/ToastNotification";
import { useMutation, useQuery } from "@tanstack/react-query";
import MerchantLayout from "@/components/Layouts/MerchantLayout";
import Image from "next/image";
import Link from "next/link";



export default function Settings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, status } = useSession();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const newPassword = watch("newPassword");

  // Create useQuery for getting merchant dadta
  const { data: merchantData, isLoading: isMerchantDataLoading } = useQuery({
    queryKey: ["merchantData"],
    queryFn: async () => {      
      const response = await fetch(`/api/merchant/fetch-by-user-id?id=${session?.user?.id}`);
      const data = await response.json();

      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Create useMutation for changing password
  const { mutate, isPending } = useMutation({
    mutationFn: async (formData) => {
      const response = await fetch("/api/password/change-password", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }

      return data;
    },
    onSuccess: () => {
      showToastNotificationSuccess("Sukces!", "Hasło zmienione pomyślnie");
      setIsModalOpen(false);
    },
    onError: (error) => {
      showToastNotificationError("Błąd!", error.message);
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  if (!merchantData || isMerchantDataLoading) {
    return <div>Ładowanie</div>;
  }

  return (
    <MerchantLayout path={["Konto", "Ustawienia"]}>
      <MainComponent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Ustawienia</h3>
        </div>
        <div className="flex flex-col bg-white p-6 rounded-md border border-main-gray w-full">
          <h4 className="text-base font-semibold mb-[24px]">Dane merchanta</h4>
          <div className="flex flex-row">
            <div className=" mb-[16px] w-[50%]">
              
              <div className="mb-[16px]">
                <p className="text-sm font-medium text-zinc-950">Nazwa merchanta</p>
                <p className="text-sm font-normal text-zinc-600">{merchantData.merchantName}</p>
              </div>
              <div className="mb-[16px]">
                <p className="text-sm font-medium text-zinc-950">Email</p>
                <p className="text-sm font-normal text-zinc-600">
                  {merchantData?.user?.email}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-950">Hasło</p>
                <p className="text-sm font-normal text-zinc-600">***********</p>
              </div>
            </div>
            <div className="w-[50%] flex flex-col gap-[16px]">              
              <div className="flex items-center gap-[4px]">
                <Link href="/" className="text-zinc-600 text-xs font-medium">Regulamin</Link>
                <Image src="/icons/share-icon.svg" width={16} height={16} alt="external-link" />
              </div>
              <div className="flex items-center gap-[4px]">
                <Link href="/" className="text-zinc-600 text-xs font-medium">Polityka prywatności</Link>
                <Image src="/icons/share-icon.svg" width={16} height={16} alt="external-link" />
              </div>
            </div>
          </div>
        </div>
        <ButtonGreen title="Zmień hasło" onPress={() => {
          reset()
          setIsModalOpen(true)          
        }} />
        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          closeModal={() => { setIsModalOpen(false) }}
          title="Zmiana hasła"
        >
          <div className="text-sm text-gray-500 mb-4">
            Wpisz aktualne hasło i następnie ustaw nowe hasło
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium"
              >
                Aktualne hasło
              </label>
              <input
                type="password"
                id="currentPassword"
                placeholder="***********"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                {...register("currentPassword", {
                  required: "Pole jest wymagane",
                })}
              />
              {errors.currentPassword && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium"
              >
                Nowe hasło
              </label>
              <input
                type="password"
                id="newPassword"
                placeholder="Hasło"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                {...register("newPassword", {
                  required: "Pole jest wymagane",
                  minLength: {
                    value: 8,
                    message: "Hasło musi mieć przynajmniej 8 znaków",
                  },
                })}
              />
              {errors.newPassword && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium"
              >
                Powtórz nowe hasło
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Hasło"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                {...register("confirmPassword", {
                  validate: (value) =>
                    value === newPassword || "Hasła nie są takie same",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className="flex justify-start space-x-4">
              <ButtonGreen title="Zmień hasło" type="submit" disabled={isPending} />
              <ButtonGray title="Anuluj" onPress={() => setIsModalOpen(false)} />
            </div>
          </form>
        </Modal>
      </MainComponent>
    </MerchantLayout>
  );
}
