import React from "react";
import Image from "next/image";
import Link from "next/link";
import { GroupByCountryLabel } from "@/shared";
import { ICompanion } from "../..";
import { CompanionItemContent } from "./CompanionItemContent";

export const CompanionItem = React.memo(({ item }: { item: ICompanion }) => {
  return (
    <li>
      <article className="w-full h-auto mb-2 bg-white block p-4">
        <Link href={`/companion/${item.id}`}>
          <GroupByCountryLabel regions={item.companion_regions} />
          <CompanionItemContent item={item} />

          <div className="flex items-center my-3 gap-x-2">
            <div className="w-5 h-5 overflow-hidden rounded-full">
              <Image
                src={item.user_info.profile_image}
                className="object-cover w-full h-full"
                width={0}
                height={0}
                sizes="100vw"
                alt="profile image"
              />
            </div>
            <p className="text-sm text-slate-700">
              {item.user_info.nickname} ·{" "}
              {item.user_info.gender === "female" ? "여자" : "남자"}
            </p>
          </div>
        </Link>
      </article>
    </li>
  );
});

CompanionItem.displayName = "CompanionItem";
