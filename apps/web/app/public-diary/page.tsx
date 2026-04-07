import Image from "next/image";

// TODO: 이전 버전 사용자를 위한 임시 유지 페이지, 추후 삭제 예정
export default async function PublicDiary() {
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
        여행 일정을 계획하는 서비스를 준비중입니다.
      </p>
    </div>
  );
}
