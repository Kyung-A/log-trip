"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Search } from "lucide-react";
import { FieldValues } from "react-hook-form";

import { IRegion } from "@/entities/region";

interface ICitySelectField<T extends FieldValues> {
  value: IRegion[];
  options?: IRegion[] | null;
  onConfirm: (value: IRegion[]) => void;
  // control: Control<T>;
}

export const CitySelectList = <T extends FieldValues>({
  value,
  options,
  onConfirm,
  // control,
}: ICitySelectField<T>) => {
  const [search, setSearch] = useState<string>("");
  const [draft, setDraft] = useState<IRegion[]>([]);

  const handleToggle = useCallback((item: IRegion) => {
    setDraft((prev) => {
      const isSelected = prev?.some(
        (data) => data.region_code === item.region_code,
      );

      if (isSelected) {
        return prev?.filter((p) => !(p.region_code === item.region_code));
      } else {
        return [...prev, item];
      }
    });
  }, []);

  const handleConfirm = useCallback(() => {
    onConfirm(draft);
  }, [draft, onConfirm]);

  const filteredList = useMemo(() => {
    return options?.filter(
      (v) => v.region_name.includes(search) || v.country_name.includes(search),
    );
  }, [options, search]);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  return (
    <>
      <div onClick={(e) => e.stopPropagation()} className="w-full bg-white">
        <header className="px-6 pb-4 border-b border-[#ebebeb]">
          <div className="flex items-center px-3 py-4 mt-4 rounded-lg bg-[#ebebeb]">
            <Search size={24} />
            <input
              className="ml-3 text-lg w-full outline-none"
              placeholder="도시 또는 나라 검색"
              onChange={(e) => setSearch(e.target.value)}
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
              (v) => item.region_code === v.region_code,
            );

            return (
              <label
                key={`${item.id}-${item.region_code}`}
                className="flex items-center px-6 py-3 border-b border-gray-100 gap-x-2"
              >
                <input
                  type="checkbox"
                  onClick={() => handleToggle(item)}
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
    </>
  );
};

CitySelectList.displayName = "CitySelectList";
