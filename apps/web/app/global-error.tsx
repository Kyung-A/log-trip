"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html
      lang="ko"
      style={{
        margin: 0,
        padding: 0,
      }}
    >
      <body
        style={{
          margin: 0,
          padding: 0,
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <main
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            margin: 0,
            fontFamily: "sans-serif",
            backgroundColor: "#fff",
            color: "#333",
          }}
        >
          <h1
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              margin: "0 0 8px 0",
              padding: 0,
            }}
          >
            앱 업데이트 확인
          </h1>
          <p
            style={{
              textAlign: "center",
              lineHeight: "1.6",
              margin: 0,
              padding: 0,
              fontSize: "0.95rem",
              color: "#666",
            }}
          >
            앱 업데이트 후 다시 재로그인 부탁드립니다.
            <br />
            만약 문제가 지속 될 경우
            <br />
            nek1717@naver.com으로 메일을 남겨주세요.
          </p>
        </main>
      </body>
    </html>
  );
}
