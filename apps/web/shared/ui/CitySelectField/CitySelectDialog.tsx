import { IRegion } from "@/features/region";
import { Search, X } from "lucide-react";

interface ICitySelectDialog {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxToggle: (item: IRegion) => void;
  draft: IRegion[];
  filteredList?: IRegion[] | null;
}

export const CitySelectDialog = ({
  isOpen,
  onClose,
  onConfirm,
  onSearch,
  onCheckboxToggle,
  draft,
  filteredList,
}: ICitySelectDialog) => {
  return (
    <dialog
      open={isOpen}
      className="max-w-3xl z-50 w-screen fixed top-0 mx-auto"
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full bg-white">
        <header className="px-6 pb-4 border-b border-[#ebebeb]">
          <div className="flex items-center justify-between w-full pt-4">
            <button onClick={onClose}>
              <X size={28} />
            </button>
            <p className="text-xl font-semibold">도시 선택</p>
            <button onClick={onConfirm}>
              <p className="text-lg text-blue-500 underline">완료</p>
            </button>
          </div>

          <div className="flex items-center px-3 py-4 mt-4 rounded-lg bg-[#ebebeb]">
            <Search size={24} />
            <input
              className="ml-3 text-lg w-full outline-none"
              placeholder="도시 또는 나라 검색"
              onChange={onSearch}
            />
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {draft?.map((v) => (
              <p
                key={v.region_name}
                className="p-2 rounded bg-[#ebebeb] font-semibold"
              >
                {v.region_name}
              </p>
            ))}
          </div>
        </header>

        <main className="overflow-y-scroll h-screen">
          {filteredList?.map((item) => {
            const selected = draft?.some(
              (v) => item.region_code === v.region_code
            );

            return (
              <label
                key={`${item.id}-${item.region_code}`}
                className="flex items-center px-6 py-3 border-b border-gray-100 gap-x-2"
              >
                <input
                  type="checkbox"
                  onClick={() => onCheckboxToggle(item)}
                  defaultChecked={selected}
                  className="border border-zinc-400 w-5 h-5 checked:accent-black checked:border-black rounded"
                />
                <span className="text-xl">{item.region_name}</span>
                <span className="text-base text-gray-600">
                  {item.country_name}
                </span>
              </label>
            );
          })}
        </main>
      </div>
    </dialog>
  );
};
