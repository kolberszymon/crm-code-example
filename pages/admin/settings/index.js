import { useForm } from "react-hook-form";
import { MainComponent } from "@/components/MainComponent";
import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import { useState } from "react";
import { Modal } from "@/components/Modal";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import AdminLayout from "@/components/Layouts/AdminLayout";

export default function Settings() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const openModal = () => {
    reset();
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const newPassword = watch("newPassword");

  const onSubmit = (data) => {
    console.log(data);
    closeModal(); // Close modal after submission
  };

  return (
    <AdminLayout path={["Konto", "Ustawienia"]}>
      <MainComponent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Ustawienia</h3>
        </div>
        <div className="bg-white p-6 rounded-md border border-main-gray mb-[16px]">
          <h4 className="text-base font-semibold mb-[24px]">Dane merchanta</h4>
          <div className="mb-[16px]">
            <p className="text-sm font-medium text-zinc-950">Nazwa merchanta</p>
            <p className="text-sm font-normal text-zinc-600">Agencja pracy</p>
          </div>
          <div className="mb-[16px]">
            <p className="text-sm font-medium text-zinc-950">Email</p>
            <p className="text-sm font-normal text-zinc-600">
              joannakowalczyk@mail.com
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-950">Hasło</p>
            <p className="text-sm font-normal text-zinc-600">***********</p>
          </div>
        </div>
        <ButtonGreen title="Zmień hasło" onPress={openModal} />
        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          closeModal={closeModal}
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
              <ButtonGreen title="Zmień hasło" type="submit" />
              <ButtonGray title="Anuluj" onPress={() => closeModal()} />
            </div>
          </form>
        </Modal>
      </MainComponent>
    </AdminLayout>
  );
}
