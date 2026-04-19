"use client";

import { useMemo, useState } from "react";

import { Search } from "lucide-react";

import { IRegion } from "@/entities/region";

interface ICitySelectField {
  value: IRegion[];
  options?: IRegion[] | null;
  onChange: (value: IRegion[]) => void;
}

export const CitySelectList = ({ value, options, onChange }: ICitySelectField) => {
  const [search, setSearch] = useState("");

  const handleToggle = (item: IRegion) => {
    const isSelected = value.some((v) => v.region_code === item.region_code);
    const next = isSelected
      ? value.filter((v) => v.region_code !== item.region_code)
      : [...value, item];
    onChange(next);
  };

  const filteredList = useMemo(
    () =>
      options?.filter(
        (v) => v.region_name.includes(search) || v.country_name.includes(search),
      ),
    [options, search],
  );

  return (
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
          {value.map((v) => (
            <p key={v.region_code} className="p-2 rounded bg-[#ebebeb] font-semibold">
              {v.region_name}
            </p>
          ))}
        </div>
      </header>

      <main className="overflow-y-scroll h-screen">
        {filteredList?.map((item) => {
          const selected = value.some((v) => v.region_code === item.region_code);
          return (
            <label
              key={`${item.id}-${item.region_code}`}
              className="flex items-center px-6 py-3 border-b border-gray-100 gap-x-2"
            >
              <input
                type="checkbox"
                checked={selected}
                onChange={() => handleToggle(item)}
                className="border border-zinc-400 w-5 h-5 checked:accent-black checked:border-black rounded"
              />
              <span className="text-xl">{item.region_name}</span>
              <span className="text-base text-gray-600">{item.country_name}</span>
            </label>
          );
        })}
      </main>
    </div>
  );
};

CitySelectList.displayName = "CitySelectList";
