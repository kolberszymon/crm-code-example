import { MainComponent } from "@/components/MainComponent";
import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import Image from "next/image";
import AdminLayout from "@/components/Layouts/AdminLayout";

export default function Home() {
  return (
    <AdminLayout>
      <MainComponent>
        {/* Top Section */}
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col items-start">
            <div className="border rounded-md font-medium px-2 py-1 border-main-blue text-main-blue mb-2">
              <p>Marketing</p>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Szkolenie z marketingu
            </h3>
            <div className="flex flex-row gap-4 text-gray-600 mt-2">
              <div className="flex items-center gap-1">
                <Image
                  src="/icons/calendar-icon.svg"
                  alt="calendar"
                  width={16}
                  height={16}
                />
                <span className="text-sm">12.16.2024</span>
              </div>
              <div className="flex items-center gap-1">
                <Image
                  src="/icons/profile-circle-icon.svg"
                  alt="profile"
                  width={16}
                  height={16}
                />
                <span className="text-sm">
                  Liczba osób które kupiło szkolenie: 256
                </span>
              </div>
            </div>
          </div>
          <ButtonGreen title="Edytuj szkolenie" />
        </div>

        {/* Description Section */}
        <div className="mb-6 mt-6">
          <p className="text-gray-700">
            Zapraszamy na kompleksowe szkolenie z marketingu, które zostało
            stworzone z myślą o osobach pragnących poszerzyć swoją wiedzę i
            umiejętności w zakresie promocji, komunikacji oraz strategii
            rynkowych. Nasze szkolenie jest idealne zarówno dla początkujących,
            jak i dla profesjonalistów chcących zaktualizować swoją umiejętności
            w wyznaczaniu zmieniających się trendów marketingowych.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Cele Szkolenia:
            </h4>
            <ul className="list-disc list-inside text-gray-700">
              <li>
                Zdobędziesz wiedzę na temat podstawowych i zaawansowanych
                narzędzi marketingowych.
              </li>
              <li>
                Rozwój umiejętności analizy rynkowej i tworzenia skutecznych
                strategii marketingowych.
              </li>
              <li>Zrozumienie zachowań konsumentów i trendów rynkowych.</li>
              <li>
                Budowanie efektywnych kampanii marketingowych i mierzenie ich
                efektywności.
              </li>
              <li>
                Nauka wykorzystania mediów społecznościowych, SEO, SEM oraz
                content marketingu.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Grupa Docelowa:
            </h4>
            <ul className="list-disc list-inside text-gray-700">
              <li>Specjaliści działów marketingu.</li>
              <li>Osoby prowadzące działalność gospodarczą.</li>
              <li>Osoby pracujące nad rozwojem produktów i usług.</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Program Szkolenia:
            </h4>
            <ul className="list-disc list-inside text-gray-700">
              <li>Wprowadzenie do marketingu.</li>
              <li>Strategie marketingowe.</li>
              <li>Marketing Mix.</li>
              <li>Marketing cyfrowy.</li>
              <li>Analiza i pomiar efektywności.</li>
              <li>Budowanie relacji z klientami.</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Metody Szkoleniowe:
            </h4>
            <ul className="list-disc list-inside text-gray-700">
              <li>Interaktywne wykłady i prezentacje.</li>
              <li>Studia przypadków.</li>
              <li>Dyskusje w grupach.</li>
              <li>Sesje Q&A z ekspertami.</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Korzyści z Udziału:
            </h4>
            <ul className="list-disc list-inside text-gray-700">
              <li>Certyfikat ukończenia szkolenia.</li>
              <li>Interaktywne warsztaty.</li>
              <li>Materiał szkoleniowy.</li>
            </ul>
          </div>
        </div>

        {/* File Download Section */}
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
            <input id="file-upload" type="file" className="hidden" />
          </label>
        </div>
      </MainComponent>
    </AdminLayout>
  );
}
