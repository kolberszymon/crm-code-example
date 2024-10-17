import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { MainComponent } from "@/components/MainComponent";
import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import { ButtonWhiteWithBorder } from "@/components/Buttons/ButtonWhiteWithBorder";
import { useRouter } from "next/router";
import Image from "next/image";
import AdminLayout from "@/components/Layouts/AdminLayout";
import Icons from "@/constants/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showToastNotificationSuccess, showToastNotificationError } from "@/components/Custom/ToastNotification";
import CreatableSearchBar from "@/components/Custom/CreatableSearchBar";

function sliceS3Url(url) {
  const pdfIndex = url.indexOf('.pdf');
  if (pdfIndex !== -1) {
    return url.slice(0, pdfIndex + 4); // +4 to include '.pdf'
  }
  return url; // Return original URL if '.pdf' is not found
}

export default function AddTraining() {
  const [file, setFile] = useState(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { id } = router.query;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    trigger
  } = useForm();

  const { data: categories, isPending: isCategoriesPending } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/trainings/fetch-categories');
      const data = await response.json();
      return data.map(category => ({ value: category.name, label: category.name }));
    },
  });

  const {mutate: createCategory, isPending: isCreateCategoryPending} = useMutation({
    mutationFn: async (formData) => {
      const response = await fetch('/api/trainings/create-category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries('categories');
    }
  });

  // useQuery to fetch training by id
  const { data: training, isPending } = useQuery({
    queryKey: ['training', id],
    queryFn: async () => {
      const response = await fetch(`/api/trainings/fetch-one?id=${id}`);
      const data = await response.json();

      console.log(data);
      return data;
    },
  });
  

  // Create useMutation to create training
  const {mutate: createTraining} = useMutation({
    mutationFn: async (formData) => {
      const body = { ...formData };

      if (file) {
        const fileUrl = await uploadFileToS3(file);
        body.fileUrl = fileUrl;
      }

      const response = await fetch("/api/trainings/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Błąd podczas tworzenia szkolenia");
      }

      const data = await response.json();

      return data;
    },
    onSuccess: (data) => {
      showToastNotificationSuccess("Sukces", data.message);
      router.push("/admin/trainings");
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
    },
    onError: (error) => {
      console.log(error);
      showToastNotificationError("Błąd", error.message);
    },
  });
  
  // upload file to s3
  const uploadFileToS3 = async (file) => {
    const response = await fetch(`/api/aws/get-upload-url?fileName=${encodeURIComponent(file.name)}`);
    const data = await response.json();
    const uploadUrl = data.url;
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
    });

    return sliceS3Url(uploadResponse.url);
  };

  const handleCreateCategory = (inputValue) => {
    createCategory({ name: inputValue });
      
    return { value: inputValue, label: inputValue };
  };

  const onSubmit = (data) => {
    createTraining({...data, id});
  };

  useEffect(() => {
    // Trigger validation for the file field whenever file state changes
    trigger("file");
  }, [file, trigger]);

  if (isPending) return <div className="flex items-center justify-center h-screen">Ładowanie...</div>;

  return (
    <AdminLayout path={["Szkolenia", "Lista szkoleń", "Edycja"]} firstPath="trainings" >
      <MainComponent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Edytuj szkolenie</h3>
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
                    {...register("priceTokens", {
                      required: "Cena szkolenia jest wymagana",
                      min: { value: 0, message: "Cena nie może być ujemna" },
                      valueAsNumber: true,
                    })}
                    type="number"
                    className="text-xs font-normal text-zinc-950 outline-none border-none w-full"
                    placeholder="500"
                    defaultValue={training.priceTokens}
                  />
                </div>
                {errors.priceTokens && (
                  <span className="text-red-600 text-sm">
                    {errors.priceTokens.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-[4px]">
                <label htmlFor="category" className="block text-xs font-medium text-zinc-600">Cena szkolenia w złotówkach</label>
                <div className="w-40 h-7 bg-white rounded-md border border-zinc-400 justify-center items-center flex flex-row gap-[8px] p-[8px]">
                  <input
                    {...register("pricePln", {
                      required: "Cena szkolenia jest wymagana",
                      min: { value: 0, message: "Cena nie może być ujemna" },
                      valueAsNumber: true,
                    })}
                    type="number"
                    className="text-xs font-normal text-zinc-950 outline-none border-none w-full"
                    placeholder="1000 zł"
                    defaultValue={training.pricePln}
                  />
                </div>
                {errors.pricePln && (
                  <span className="text-red-600 text-sm">
                    {errors.pricePln.message}
                  </span>
                )}
              </div>


            </div>

            <div className="w-1/2">
              <label htmlFor="category" className="block text-xs font-medium text-zinc-600">
                Wpisz nową kategorię lub wybierz istniejącą
              </label>
              <Controller
                name="category"
                control={control}
                rules={{ required: "Kategoria jest wymagana" }}
                render={({ field }) => (
                  <CreatableSearchBar
                    defaultValue={categories.find(category => category.value === training.category)}
                    options={categories || []}
                    onChange={(selectedOption) => field.onChange(selectedOption.value)}
                    onCreateOption={handleCreateCategory}
                    placeholder={isCategoriesPending ? "Ładowanie kategorii..." : "Wybierz lub dodaj kategorię"}
                    isLoading={isCategoriesPending || isCreateCategoryPending}
                  />
                )}
              />
              {errors.category && (
                <span className="text-red-600 text-sm">
                  {errors.category.message}
                </span>
              )}
            </div>

            {/* Training Name */}
            <div className="w-1/2">
              <label htmlFor="title" className="block text-xs font-medium text-zinc-600">
                Nazwa szkolenia
              </label>
              <input
                type="text"
                id="title"
                {...register("title", {
                  required: "Nazwa szkolenia jest wymagana",
                })}
                className="mt-1 block w-full border rounded-md p-2 text-xs"
                defaultValue={training.title}
              />
              {errors.title && (
                <span className="text-red-600 text-sm">
                  {errors.title.message}
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
                defaultValue={training.introduction}
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
                defaultValue={training.description}
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
                  alt="file-icon"
                />
                <div>
                  <p className="text-dark-green text-xs font-semibold">
                    Plik szkolenia
                  </p>
                  <p className="text-xs text-gray-400">
                    {file ? file.name : "Plik jest dostępny w bazie danych, kliknij aby zmienić"}
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  {...register("file", {
                    validate: () => {                      
                      if (training.fileUrl) {
                        return true;
                      }

                      if (!file) {
                        return false;
                      }

                      if (file.type !== "application/pdf") {
                        return "Dozwolone są tylko pliki PDF";
                      }

                      return true;
                    }
                  })}
                  onChange={(e) => {
                    if (e.target.files.length > 0 && e.target.files[0].size > 50000000) {
                      showToastNotificationError("Błąd", "Plik jest większy niż 50MB");
                    } else {
                      setFile(e.target.files[0]);
                    }
                  }}
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
            <ButtonGreen title="Zapisz zmiany" type="submit" disabled={!isValid}/>            
            <ButtonWhiteWithBorder title="Anuluj" onPress={() => router.back()} type="button"/>            
          </div>
        </form>
      </MainComponent>
    </AdminLayout>
  );
}
