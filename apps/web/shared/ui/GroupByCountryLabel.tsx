"use client";

import React, { useMemo } from "react";
import { groupByCountry } from "..";
import { IDiaryRegionsRender } from "@/features/diary";

export const GroupByCountryLabel = React.memo(
  ({ regions }: { regions: IDiaryRegionsRender[] }) => {
    const groupedRegions = useMemo(() => groupByCountry(regions), [regions]);

    const regionItems = useMemo(() => {
      return Object.entries(groupedRegions).map(
        ([countryCode, { country_name, regions }]) => ({
          key: countryCode,
          countryName: country_name,
          regions: regions.join(", "),
        })
      );
    }, [groupedRegions]);

    return (
      <div className="flex items-center gap-x-4">
        {regionItems?.map((item) => (
          <div key={item.key} className="px-2 py-1 bg-gray-100 rounded-md">
            <p className="text-base">{item.countryName}</p>
            <p className="text-sm -mt-0.5 text-gray-600">{item.regions}</p>
          </div>
        ))}
      </div>
    );
  }
);

GroupByCountryLabel.displayName = "GroupByCountryLabel";
