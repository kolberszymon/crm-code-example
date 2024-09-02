import { useForm } from "react-hook-form";
import { MainComponent } from "@/components/MainComponent";
import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import { ButtonWhiteWithBorder } from "@/components/Buttons/ButtonWhiteWithBorder";
import Link from "next/link";
import Image from "next/image";
import AdminLayout from "@/components/Layouts/AdminLayout";
import Icons from "@/constants/icons";

export default function AddTraining() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <AdminLayout>
      <MainComponent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Dodaj szkolenie</h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-[32px]">
          <div className="space-y-4">
            {/* Training Category */}
            <div className="w-1/2 flex flex-row gap-[24px]">
              <div className="flex flex-col gap-[4px]">
                <label htmlFor="category" className="block text-xs font-medium text-zinc-600">Cena szkolenia w tokenach</label>
                <div className="w-40 h-7 bg-white rounded-md border border-zinc-400 justify-center items-center flex flex-row gap-[8px] p-[8px]">
                  <Icons.CoinImage w={16} h={16} />
                  <input
                    {...register("price", {
                      required: "Cena szkolenia jest wymagana",
                      min: { value: 0, message: "Cena nie może być ujemna" },
                    })}
                    type="number"
                    className="text-xs font-normal text-zinc-950 outline-none border-none w-full"
                    placeholder="500"
                  />
                </div>
                {errors.price && (
                  <span className="text-red-600 text-sm">
                    {errors.price.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-[4px]">
                <label htmlFor="category" className="block text-xs font-medium text-zinc-600">Cena szkolenia w złotówkach</label>
                <div className="w-40 h-7 bg-white rounded-md border border-zinc-400 justify-center items-center flex flex-row gap-[8px] p-[8px]">
                  <input
                    {...register("price", {
                      required: "Cena szkolenia jest wymagana",
                      min: { value: 0, message: "Cena nie może być ujemna" },
                    })}
                    type="number"
                    className="text-xs font-normal text-zinc-950 outline-none border-none w-full"
                    placeholder="1000 zł"
                  />
                </div>
                {errors.price && (
                  <span className="text-red-600 text-sm">
                    {errors.price.message}
                  </span>
                )}
              </div>


            </div>

            <div className="w-1/2">
              <label htmlFor="category" className="block text-xs font-medium text-zinc-600">
                Wpisz nową kategorię lub wybierz istniejącą
              </label>
              <select
                id="category"
                {...register("category", {
                  required: "Kategoria jest wymagana",
                })}
                className="mt-1 block w-full border rounded-md p-2 text-xs"
              >
                <option value="">Wybierz kategorię</option>
                <option value="Marketing">Marketing</option>
              </select>
              {errors.category && (
                <span className="text-red-600 text-sm">
                  {errors.category.message}
                </span>
              )}
            </div>

            {/* Training Name */}
            <div className="w-1/2">
              <label htmlFor="name" className="block text-xs font-medium text-zinc-600">
                Nazwa szkolenia
              </label>
              <input
                type="text"
                id="name"
                {...register("name", {
                  required: "Nazwa szkolenia jest wymagana",
                })}
                className="mt-1 block w-full border rounded-md p-2 text-xs"
              />
              {errors.name && (
                <span className="text-red-600 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Training Introduction */}
            <div className="w-1/2">
              <label
                htmlFor="introduction"
                className="block text-xs font-medium text-zinc-600"
              >
                Wstęp
              </label>
              <textarea
                id="introduction"
                {...register("introduction", {
                  required: "Wstęp jest wymagany",
                })}
                className="mt-1 block w-full border rounded-md p-2 text-xs min-h-[120px]"
                rows="3"
                placeholder="Zapraszamy na kompleksowe szkolenie z marketingu, które zostało stworzone z myślą o osobach pragnących poszerzyć swoją wiedzę i umiejętności w zakresie promocji, komunikacji oraz strategii rynkowych. Nasze szkolenie jest idealne zarówno dla początkujących, jak i dla profesjonalistów chcących zaktualizować swoje umiejętności w dynamicznie zmieniającym się świecie marketingu."
              />
              {errors.introduction && (
                <span className="text-red-600 text-sm">
                  {errors.introduction.message}
                </span>
              )}
            </div>

            {/* Training Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-xs font-medium text-zinc-600"
              >
                Opis szkolenia
              </label>
              <textarea
                id="description"
                {...register("description", {
                  required: "Opis szkolenia jest wymagany",
                })}
                className="mt-1 block w-full border rounded-md p-2 text-xs min-h-[280px]"
                rows="6"
              />
              {errors.description && (
                <span className="text-red-600 text-sm">
                  {errors.description.message}
                </span>
              )}
            </div>

            {/* Upload File */}
            <div className="flex flex-col items-start">
              <label
                htmlFor="file-upload"
                className="flex flex-row items-center border border-main-gray rounded-md px-[12px] py-[8px] gap-2 hover:bg-main-gray cursor-pointer"
              >
                <Image
                  src="/icons/file-icon-green.svg"
                  width={24}
                  height={24}
                />
                <div>
                  <p className="text-dark-green text-xs font-semibold">
                    Plik szkolenia
                  </p>
                  <p className="text-xs text-gray-400">
                    Marketing internetowy.pdf
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  {...register("file", {
                    required: "Plik szkolenia jest wymagany",
                  })}
                />
              </label>
              {errors.file && (
                <span className="text-red-600 text-sm">
                  {errors.file.message}
                </span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-start space-x-4">
            <ButtonGreen title="Zapisz zmiany" type="submit" />
            <Link href="/admin/trainings">
              <ButtonWhiteWithBorder title="Anuluj" />
            </Link>
          </div>
        </form>
      </MainComponent>
    </AdminLayout>
  );
}
