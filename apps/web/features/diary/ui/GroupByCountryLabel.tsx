import React from "react";

export const GroupByCountryLabel = React.memo(
  ({ countryName, regions }: { countryName: string; regions: string[] }) => {
    return (
      <div className="px-2 py-1 bg-gray-100 rounded-md">
        <p className="text-base">{countryName}</p>
        <p className="text-sm -mt-0.5 text-gray-600">{regions}</p>
      </div>
    );
  }
);

GroupByCountryLabel.displayName = "GroupByCountryLabel";
