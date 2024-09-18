import { ButtonGreen } from "@/components/Buttons/ButtonGreen";
import Image from "next/image";
import { useState, useMemo } from "react";
import { MainComponent } from "@/components/MainComponent";
import { SearchBar } from "@/components/Inputs/SearchBar";
import { MerchantPayoffTable } from "@/components/Tables/MerchantPayoffTable";
import { Modal } from "@/components/Modal";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import { showToastNotificationSuccess, showToastNotificationError } from "@/components/Custom/ToastNotification";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { SelectDropdown } from "@/components/Inputs/SelectDropdown";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";


export default function MerchantPayoff() {  
  const queryClient = useQueryClient();

  const [searchValue, setSearchValue] = useState(null);
  const [merchantType, setMerchantType] = useState("");
  const [selectedRowValues, setSelectedRowValues] = useState({});

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
          <button
            className="p-[8px] bg-[#f6f7f8] rounded-full hover:bg-gray-200 transition-colors disabled:hover:bg-[#f6f7f8]"
            disabled={selectedRowValues.length === 0}
          >
            <Image
              src="/icons/download-icon.svg"
              width={16}
              height={16}
              alt="download icon"
            />
          </button>
        </div>
        {isLoading ? <div>Ładowanie...</div> : (
        <MerchantPayoffTable
          tableData={merchants}
          setSelectedRowValues={setSelectedRowValues}
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
