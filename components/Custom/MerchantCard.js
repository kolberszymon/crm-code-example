import Link from "next/link";
import Image from "next/image";
import { MulticolorTitleTile } from "@/components/Custom/MulticolorTitleTile";
import { ButtonGray } from "@/components/Buttons/ButtonGray";
import { ButtonWhiteWithBorder } from "@/components/Buttons/ButtonWhiteWithBorder";

export const MerchantCard = ({ item, openModal }) => (
  <div className="p-4 border rounded-md">
    <div className="flex justify-between items-center">
      <MulticolorTitleTile title={item.accountType} color={item.accountType === "View" ? "blue" : "orange"} />
      <div className="flex flex-row gap-3">
        <Link href={`/admin/merchants/view/${item.id}`}>
          <button className="p-[4px] rounded-full bg-main-gray flex items-center justify-center hover:bg-gray-200 transition-colors">
            <Image src="/icons/eye.svg" width={16} height={16} alt="eye" />
          </button>
        </Link>
        <button
          className="p-[4px] rounded-full bg-main-gray flex items-center justify-center hover:bg-gray-200 transition-colors"
          onClick={openModal}
        >
          <Image src="/icons/trash.svg" width={14} height={16} alt="trash" />
        </button>
      </div>
    </div>
    <div className="mt-4">
      <h4 className="text-sm text-zinc-950 font-medium">{item.merchantName.length > 0 ? item.merchantName : "-"}</h4>
      <p className="text-xs text-zinc-600 font-normal">{item.merchantCompany.length > 0 ? item.merchantCompany : "-"}</p>
    </div>
    <div className="mt-4 flex justify-start gap-[8px]">
      <Link href={`/admin/employees?searchValue=${item.merchantCompany}`}>
        <ButtonGray title="Pracownicy" />
      </Link>
      {item.accountType === "View" && (
        <Link href={`/admin/employees/payoff?searchValue=${item.merchantCompany}`}>
          <ButtonWhiteWithBorder title="Rozlicz pracowników"/>
        </Link>
      )}
    </div>
  </div>
);

