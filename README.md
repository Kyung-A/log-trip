# ✈️ 로그트립 logtrip

> **여행의 순간을 일기로 기록하고 세계 지도로 채워 나가는 하이브리드 앱 서비스**

<img src="https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=Typescript&logoColor=white"> <img src="https://img.shields.io/badge/Next.js-14+-000000?style=flat-square&logo=Next.js&logoColor=white"/> <img src="https://img.shields.io/badge/React Native-61DAFB?style=flat-square&logo=React&logoColor=black"/> <img src="https://img.shields.io/badge/supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white"> <img src="https://img.shields.io/badge/pnpm-f9ad01?style=flat-square&logo=pnpm&logoColor=white">

## 🚀 서비스 소개

`로그트립`은 여행 중에 발생하는 다양한 에피소드와 정보를 기록하기 위해 제작되었습니다. 단순한 텍스트 기록을 넘어 사진과 장소 기반의 로그를 생성하며, 모노레포 아키텍처를 통해 확장성 있는 구조로 설계되었습니다.

**[🔗 App Store 다운로드](https://apps.apple.com/kr/app/%EB%A1%9C%EA%B7%B8%ED%8A%B8%EB%A6%BD-%EB%82%B4-%EC%97%AC%ED%96%89%EC%9D%84-%EC%84%B8%EA%B3%84%EC%A7%80%EB%8F%84%EC%97%90-%EA%B8%B0%EB%A1%9D/id6751894902)**

<img src="app-img1.jpg" width="20%" alt="일기 화면" /> <img src="app-img2.jpg" width="20%" alt="세계지도 화면" />

## ✨ 주요 기능

- **📍 여행 일기 생성**: 여행지에서의 활동을 사진과 함께 기록
- **📷 사진 업로드**: 여행의 순간을 담은 이미지 스토리지 연동
- **🗺️ 세계지도 색칠**: 작성된 일기 기반으로 방문한 나라를 세계지도에 표시
- **🔐 사용자 인증**: Supabase Auth를 활용한 로그인 및 세션 관리
- **📱 모바일 최적화**: 어디서든 편리하게 기록할 수 있는 하이브리드 앱

## 🛠 Tech Stack

### Frontend & Mobile

- **Mobile**: React Native (WebView 기반 하이브리드 구조)
- **Web**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **State & Data**: TanStack Query → **Next.js Server Caching(unstable_cache)으로 고도화**

### Backend & Infrastructure

- **BaaS**: Supabase (Database, Auth, Storage, Edge Functions)
- **Monorepo Management**: Turborepo
- **Package Manager**: pnpm
- **Deployment**: Vercel (Web), iOS App Store (Mobile)

## 🚀 핵심 기술적 도전 (Deep Dive)

_프로젝트를 진행하며 고민한 상세 과정은 [개발 블로그](https://kyung-a.tistory.com/category/Project/%EB%A1%9C%EA%B7%B8%ED%8A%B8%EB%A6%BD)에 기록되어 있습니다._

### ✅ 하이브리드 앱의 인증 체계 설계 (Native ↔ Web)

- **도전**: 네이티브 소셜 로그인 후 웹뷰(Next.js) 환경에 인증 세션을 안전하게 공유해야 하는 과제.
- **해결**: React Native에서 발급받은 토큰을 WebView의 **Cookie**로 직접 주입하고, Next.js의 Middleware와 Supabase SSR 기능을 활용하여 **서버 컴포넌트에서도 인증된 데이터를 즉시 조회**할 수 있는 워크플로우를 구축했습니다.
- [🔗 관련 블로그 포스팅](https://kyung-a.tistory.com/78)

### ✅ 데이터 캐싱 전략: Client-side에서 Server-side로의 전환

- **도전**: 네이티브 탭바 사용 시, 각 탭의 웹뷰가 **독립된 브라우저 인스턴스**로 동작하여 React Query의 메모리 캐시가 공유되지 않는 문제 발생.
- **해결**: 클라이언트 기반 캐싱의 한계를 인지하고, Next.js의 서버 단 캐싱(`unstable_cache`) 및 `revalidateTag` 전략으로 전환하여 **탭 간 데이터 불일치 문제를 해결**하고 지도의 대용량 GeoJSON 데이터 조회 효율을 높였습니다.
- [🔗 관련 블로그 포스팅](https://kyung-a.tistory.com/79)
