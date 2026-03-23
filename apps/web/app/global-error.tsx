"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
          <button
            onClick={() => reset()}
            style={{
              textAlign: "center",
              padding: "0px 12px",
              fontSize: "14px",
              marginTop: 6,
            }}
          >
            새로고침
          </button>
        </main>
      </body>
    </html>
  );
}
