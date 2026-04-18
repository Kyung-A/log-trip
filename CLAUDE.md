# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 개요

**로그트립(LogTrip)** — 여행 기록을 다이어리로 남기고 세계 지도를 채워나가는 하이브리드 모바일 + 웹 앱입니다. React Native WebView 셸이 Next.js 웹 앱을 감싸는 구조이며, Supabase를 통해 인증을 공유합니다.

## 명령어

패키지 매니저: **pnpm** (v10), **Turborepo** 워크스페이스 사용.

```bash
# Web (Next.js)
pnpm --filter=web dev
pnpm --filter=web build
pnpm --filter=web lint

# Mobile (Expo)
pnpm --filter=mobile ios
pnpm --filter=mobile android
pnpm --filter=mobile dev
pnpm --filter=mobile lint

# 둘 동시에 실행
./dev.sh
```

## 아키텍처

### 모노레포 구조

```
apps/
  web/      # Next.js 14+ (App Router), React 19, TypeScript, Tailwind, Mapbox GL
  mobile/   # React Native 0.81, Expo 54, Expo Router
```

공용 `packages/` 디렉토리는 없으며, 공유 로직은 각 앱 내부에 위치합니다.

### Feature-Sliced Design (FSD)

두 앱 모두 FSD 기반 레이어 구조를 따르며, ESLint import 규칙으로 강제됩니다.

```
entities/   → 도메인 모델 (diary, user, companion, region, companion-application)
  /api      → Supabase 호출
  /model    → 비즈니스 로직 / 데이터 변환
  /ui       → 엔티티 전용 컴포넌트
  /types.ts

features/   → 사용자 기능 단위 (diary-create, diary-update, companion, world-map-viewer, …)
  /model    → 훅 및 로직
  /ui       → 컴포넌트

shared/     → 공통 유틸리티
  /lib/supabase/   → client.ts, server.ts, proxy.ts
  /lib/nativeBridge.ts  → 네이티브 ↔ WebView 메시지 브릿지
  /api/storage/    → 이미지 업로드 헬퍼
  /hooks, /ui, /util, /consts
```

**import 방향은 단방향으로 고정:** `shared → features → entities`. ESLint가 역방향 import를 금지합니다(예: entities에서 features import 불가).

### 하이브리드 인증 흐름

1. 네이티브 앱에서 Expo를 통해 소셜 로그인 처리 (카카오, 네이버, 애플).
2. 세션 토큰을 쿠키 형태로 WebView에 주입.
3. Next.js 미들웨어가 Supabase SSR(`@supabase/ssr`)로 쿠키를 읽어 서버 컴포넌트 인증.

### 데이터 페칭 & 캐싱

- **서버 컴포넌트**는 Supabase SSR 클라이언트로 직접 호출.
- **클라이언트 컴포넌트**는 Supabase 브라우저 클라이언트 사용.
- 캐싱은 Next.js `unstable_cache` + `revalidateTag` 사용 (React Query 미사용) — 독립된 WebView 탭들이 React Query 캐시를 공유할 수 없어 서버 캐싱 방식으로 전환.

### 주요 라이브러리

| 관심사 | Web | Mobile |
|---|---|---|
| 라우팅 | Next.js App Router | Expo Router |
| 인증 | Supabase SSR | Expo + AsyncStorage |
| 지도 | Mapbox GL | — |
| 폼 | react-hook-form | react-hook-form |
| 알림 | react-toastify | react-native-toast-message |
| 캘린더 | react-calendar | — |

### 경로 별칭

`@/*`는 `web`과 `mobile` 모두 앱 루트로 resolve됩니다.

## 절대 규칙

- `.env`, `.env.*`, `*secret*`, `*credential*` 등 환경변수 및 민감 정보가 담긴 파일은 절대 git commit/push하지 않는다.
- Supabase 키, API 키, 토큰 등을 코드에 하드코딩하지 않는다.

## 코딩 컨벤션

### 네이밍 규칙

| 대상 | 케이스 | 예시 |
|---|---|---|
| 컴포넌트 파일 | PascalCase | `DiaryCard.tsx` |
| 유틸 / 훅 / API 호출 파일 | camelCase | `useDiary.ts`, `getDiary.ts` |
| 페이지 / features / entities 디렉토리 | kebab-case | `diary-create/`, `world-map-viewer/` |

### 커밋 메시지

- `feat:`, `fix:`, `refactor:`, `style:`, `chore:`, `docs:` 접두사를 사용한다.
- 커밋 메시지 본문은 **한글**로 작성한다.
- 예시: `feat: 여행 일정 상세 페이지 추가`, `fix: 로그인 토큰 갱신 오류 수정`

### React 컴포넌트

- **named export**를 사용한다 (default export 금지).
- 각 도메인(entities, features)의 진입점은 **배럴 패턴**(`index.ts`)으로 export하여 외부에서 내부 구조를 직접 참조하지 않도록 한다.
