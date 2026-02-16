import Image from "next/image";

export const MapSplashScreen = () => {
  return (
    <div className="absolute top-0 w-full h-screen left-0 bg-transparent">
      <div className="backdrop-blur-xs bg-white/40 w-full h-full flex flex-col items-center justify-center">
        <Image
          src="/images/logo/logo.png"
          alt="loading"
          className="mb-4"
          width={160}
          height={0}
          sizes="100vw"
        />
        <Image
          src="/images/loading.svg"
          alt="loading"
          width={60}
          height={0}
          sizes="100vw"
        />
        <p className="text-lg font-semibold mt-2 text-zinc-800">
          발자취를 채우는 중...
        </p>
      </div>
    </div>
  );
};
