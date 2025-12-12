"use client";

import { CompanionCard, useFetchCompanions } from "@/features/companion";
import Image from "next/image";
import { Suspense } from "react";
import Loading from "./loading";

export default function Companion() {
  const { data } = useFetchCompanions();

  return (
    <Suspense fallback={<Loading />}>
      {data && data.length > 0 ? (
        <ul className="w-full bg-zinc-100">
          {data.map((item) => (
            <CompanionCard key={item.id} item={item} />
          ))}
        </ul>
      ) : (
        <div className="items-center justify-center flex-1 gap-6">
          {/* <Image
            source={require("@/assets/images/logo.png")}
            className="object-cover w-32 h-32"
          /> */}
          <p>지금 바로 동행 모집하는 글을 작성해보세요!</p>
        </div>
      )}
    </Suspense>
  );
}
