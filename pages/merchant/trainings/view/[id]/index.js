import { MainComponent } from "@/components/MainComponent";
import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import Image from "next/image";
import MerchantLayout from "@/components/Layouts/MerchantLayout";
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
    <MerchantLayout path={["Szkolenia", "Lista szkoleń", "Szczegóły"]} firstPath="trainings">
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
          </div>
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
        
      </MainComponent>
    </MerchantLayout>
  );
}
