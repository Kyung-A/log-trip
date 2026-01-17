"use client";

import Image from "next/image";

export const EmptyView = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full min-h-screen h-ull bg-beige">
      <Image
        src="/images/logo/logo.png"
        className="object-cover w-32 h-32"
        alt="logo"
        width={0}
        height={0}
        sizes="100vw"
      />
      <p className="text-base whitespace-pre-wrap text-center text-zinc-700">
        {message}
      </p>
    </div>
  );
};
