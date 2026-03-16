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
    <html lang="ko">
      <body style={{ margin: 0, padding: 0 }}>
        <main
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 16px",
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
            }}
          >
            서비스 점검중
          </h1>
          <p
            style={{
              textAlign: "center",
              lineHeight: "1.6",
              margin: 0,
              fontSize: "0.95rem",
              color: "#666",
            }}
          >
            현재 좀 더 안정적인 서비스를 제공하기 위해
            <br />
            개편중에 있습니다. <br />
            이용에 불편을 드려 죄송합니다.
          </p>
        </main>
      </body>
    </html>
  );
}
