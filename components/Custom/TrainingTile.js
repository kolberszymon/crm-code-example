import Image from "next/image";
import { ButtonGreen } from "../Buttons/ButtonGreen";
import Link from "next/link";
import { MulticolorTitleTile } from "./MulticolorTitleTile";
import { ButtonGray } from "../Buttons/ButtonGray";

export const TrainingTile = ({ training, onDelete, onDuplicate }) => {
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
        <Link href={`/admin/trainings/edit/${training.id}`}>
          <ButtonGray title="Edytuj szkolenie" />
        </Link>
      </div>
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-row gap-3 items-center">
          {/* Duplicate */}
          <button className="w-[30px] h-[30px] rounded-full bg-main-gray flex items-center justify-center hover:bg-gray-200 transition-colors" onClick={onDuplicate}>
            <Image src="/icons/copy-icon-bold.svg" width={13} height={13} />
          </button>
          {/* View */}
          <Link href={`/admin/trainings/view/${training.id}`}>
            <button className="w-[30px] h-[30px] rounded-full bg-main-gray flex items-center justify-center hover:bg-gray-200 transition-colors">
              <Image src="/icons/eye.svg" width={18} height={18} />
            </button>
          </Link>
          {/* Delete */}
          <button className="w-[30px] h-[30px] rounded-full bg-main-gray flex items-center justify-center hover:bg-gray-200 transition-colors" onClick={onDelete}>
            <Image src="/icons/trash.svg" width={16} height={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
