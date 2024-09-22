import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { MainComponent } from "@/components/MainComponent";
import { SearchBar } from "@/components/Inputs/SearchBar";
import { MerchantPayoffTable } from "@/components/Tables/MerchantPayoffTable";
import { Modal } from "@/components/Modal";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import { showToastNotificationSuccess, showToastNotificationError } from "@/components/Custom/ToastNotification";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { SelectDropdown } from "@/components/Inputs/SelectDropdown";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { CSVLink } from "react-csv";

export default function MerchantPayoff() {  
  const queryClient = useQueryClient();

  const [searchValue, setSearchValue] = useState("");
  const [merchantType, setMerchantType] = useState("");
  const [selectedRowValues, setSelectedRowValues] = useState({});
  const [csvData, setCsvData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: merchantsRaw, isLoading } = useQuery({
    queryKey: ['merchants-edit'],
    queryFn: async () => {
      const response = await fetch('/api/merchant/fetch-all-edit');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      return data;
    },
  });

  const updateTokenBalancesMutation = useMutation({
    mutationFn: async (selectedMerchants) => {
      const response = await fetch('/api/merchant/update-token-balances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedMerchants),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {        
        throw new Error(data.message || "Wystąpił błąd podczas przesyłania tokenów");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['merchants']);
      showToastNotificationSuccess("Sukces!", "Tokeny zostały przesłane");
    },
    onError: (error) => {
      console.error("Error updating token balances:", error);
      showToastNotificationError("Błąd!", error.message);
    },
  });

  const merchants = useMemo(() => {
    if (!merchantsRaw) return [];

    return merchantsRaw.map((merchant) => {
      return {
        merchantId: merchant.id,
        userId: merchant.user.id,
        merchantName: merchant.merchantName,
        merchantType: merchant.accountType,
        merchantBalance: merchant.user.tokens,
        topUpAmount: merchant.lastTopupAmount,
      };
    });
  }, [merchantsRaw]);

  const submitPayoff = () => {
    updateTokenBalancesMutation.mutate(selectedRowValues);
    
    setIsModalOpen(false);
  }

  useEffect(() => {
    const data = Object.values(selectedRowValues).map(row => ({
      merchantName: row.merchantName,
      merchantType: row.merchantType,
      merchantBalance: row.merchantBalance,      
      topUpAmount: row.topUpAmount,
    }));
    setCsvData(data);
  }, [selectedRowValues]);

  const csvHeaders = [
    { label: "Nazwa merchanta", key: "merchantName" },
    { label: "Typ merchanta", key: "merchantType" },
    { label: "Saldo merchanta", key: "merchantBalance" },
    { label: "Wyskość ostatniego doładowania", key: "topUpAmount" },
  ];

  return (
    <AdminLayout path={["Merchant", "Rozliczenia z Merchantami"]}>
      <MainComponent>
        <div className="flex flex-row justify-between items-center">
          <p className="text-zinc-950 text-base font-semibold leading-normal">
            Rozliczenia z Merchantami
          </p>
          <ButtonGreen
            title="Wyślij przelew"
            onPress={() => {
              setIsModalOpen(true);
            }}
            disabled={selectedRowValues.length === 0}
          />
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-4 my-[32px]">
            <SearchBar
              value={searchValue}
              setValue={setSearchValue}
              extraCss="my-[32px]"
            />
               <SelectDropdown
              value={merchantType}
              setValue={setMerchantType}
              options={["Merchant", "View", "Edit"]}
              extraCss=""
            />
          </div>
          <CSVLink
            data={csvData}
            headers={csvHeaders}
            filename="rozliczenia_z_merchantami.csv"
            className={`p-[8px] bg-[#f6f7f8] rounded-full hover:bg-gray-200 transition-colors ${
              Object.keys(selectedRowValues).length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            target="_blank"
            onClick={(event) => {
              if (Object.keys(selectedRowValues).length === 0) {
                event.preventDefault();
              }
            }}   
          >
            <Image
              src="/icons/download-icon.svg"
              width={16}
              height={16}
              alt="download icon"
            />
          </CSVLink>
        </div>
        {isLoading ? <div>Ładowanie...</div> : (
        <MerchantPayoffTable
          tableData={merchants}
          setSelectedRowValues={setSelectedRowValues}
          searchValue={searchValue}
        />
        )}

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          title="Czy na pewno chcesz przesłać tokeny?"
        >
          <div className="text-sm text-gray-500 mb-4">
            Zatwierdź, by potwierdzić
          </div>
          <div className="flex flex-row gap-[8px]">
            <ButtonGreen
              title="Zatwierdź"
              onPress={submitPayoff}
            />
            <ButtonGray title="Anuluj" onPress={() => setIsModalOpen(false)} />
          </div>
        </Modal>
      </MainComponent>
    </AdminLayout>
  );
}
