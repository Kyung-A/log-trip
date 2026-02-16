import Image from "next/image";

export const SplashScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-beige">
      <Image
        src="/images/logo/logo.png"
        alt="loading"
        className="mb-7"
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
    </div>
  );
};
