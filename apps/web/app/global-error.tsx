"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <main className="w-screen h-screen flex flex-col items-center justify-center px-4">
          <h1 className="text-xl font-semibold">서비스 점검중</h1>
          <p className="text-center mt-2">
            현재 좀 더 안정적인 서비스를 제공 하기위해
            <br />
            개편중에 있습니다. <br />
            이용에 불편을 드려 죄송합니다.
          </p>
        </main>
      </body>
    </html>
  );
}
