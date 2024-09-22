import Image from "next/image";

import Link from "next/link";
import { MulticolorTitleTile } from "./MulticolorTitleTile";
import { ButtonGray } from "../Buttons/ButtonGray";

export const TrainingTileMerchant = ({ training, onDelete, onDuplicate }) => {
  return (
    <div className="flex flex-row border border-gray-200 rounded-md p-4 items-center gap-4">
      <div className="flex flex-col flex-1 items-start gap-4">
        <MulticolorTitleTile
          title={training.category}
          color="blue"          
        />
        <div className="flex flex-col">
          <h4 className="text-sm font-medium text-zinc-950">
            {training.title}
          </h4>
          <p className="text-xs text-zinc-600 font-normal text-wrap">
            {training.description}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-row gap-3 items-center">
          {/* View */}
          <Link href={`/merchant/trainings/view/${training.id}`}>
            <button className="w-[30px] h-[30px] rounded-full bg-main-gray flex items-center justify-center hover:bg-gray-200 transition-colors">
              <Image src="/icons/eye.svg" width={18} height={18} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
