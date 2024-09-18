import { MainComponent } from "@/components/MainComponent";
import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import Image from "next/image";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const { id } = router.query;

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

  if (isPending) return <div className="flex items-center justify-center h-screen">Ładowanie...</div>;

  return (
    <AdminLayout path={["Szkolenia", "Lista szkoleń", "Szczegóły"]}>
      <MainComponent>
        {/* Top Section */}
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col items-start">
            <div className="border rounded-md font-medium px-2 py-1 border-main-blue text-main-blue mb-2">
              <p>{training.category}</p>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              {training.title}
            </h3>
            <div className="flex flex-row gap-4 text-gray-600 mt-2">
              <div className="flex items-center gap-1">
                <Image
                  src="/icons/calendar-icon.svg"
                  alt="calendar"
                  width={16}
                  height={16}
                />
                <span className="text-sm">{format(new Date(training.createdAt), 'dd.MM.yyyy')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Image
                  src="/icons/profile-circle-icon.svg"
                  alt="profile"
                  width={16}
                  height={16}
                />
                <span className="text-sm">
                  Liczba osób które kupiło szkolenie: 0
                </span>
              </div>
            </div>
          </div>
          <Link href={`/admin/trainings/edit/${id}`}>
            <ButtonGreen title="Edytuj szkolenie" />
          </Link>
        </div>

        {/* Description Section */}
        <div className="mb-6 mt-6">
          <p className="text-gray-700 text-sm">
            {training.introduction}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          <p className="text-sm">
            {training.description}
          </p>
        </div>

        {/* File Download Section */}
        <Link href={training.fileUrl} download target="_blank">
        <div className="flex flex-col items-start mt-6">
          <label
            htmlFor="file-upload"
            className="flex flex-row items-center border border-main-gray rounded-md px-[12px] py-[8px] gap-2 hover:bg-main-gray cursor-pointer"
          >
            <Image src="/icons/download-file-icon.svg" width={24} height={24} />
            <div>
              <p className="text-dark-green text-xs font-semibold">
                Plik szkolenia
              </p>
              <p className="text-xs text-gray-400">Pobierz pdf</p>
            </div>            
          </label>
        </div>
        </Link>
      </MainComponent>
    </AdminLayout>
  );
}
