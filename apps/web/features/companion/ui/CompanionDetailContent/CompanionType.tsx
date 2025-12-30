import { Users, VenusAndMars } from "lucide-react";
import React from "react";

interface ICompanionType {
  gender?: string;
  acceptedCount?: number;
  companionCount?: number;
}

export const CompanionType = React.memo(
  ({ gender, acceptedCount, companionCount }: ICompanionType) => {
    return (
      <section>
        <h3 className="text-base font-semibold">동행 유형</h3>

        <div className="p-3 mt-2 rounded-lg bg-zinc-100 gap-y-1">
          <div className="flex items-center gap-x-2">
            <VenusAndMars name="person" size={16} color="#4b5563" />
            <p className="text-gray-800">
              {gender === "R" ? "무관" : gender === "M" ? "남자만" : "여자만"}
            </p>
          </div>

          <div className="flex items-center gap-x-2">
            <Users size={16} color="#4b5563" />
            <p className="text-gray-800">
              현재 인원 : {acceptedCount} / {companionCount}
            </p>
          </div>
        </div>
      </section>
    );
  }
);

CompanionType.displayName = "CompanionType";
