# ✈️ 로그트립 logtrip

> **여행의 순간을 일기로 기록하고 세계 지도로 채워 나가는 하이브리드 앱 서비스**

<img src="https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=Typescript&logoColor=white"> <img src="https://img.shields.io/badge/Next.js-14+-000000?style=flat-square&logo=Next.js&logoColor=white"/> <img src="https://img.shields.io/badge/React Native-61DAFB?style=flat-square&logo=React&logoColor=black"/> <img src="https://img.shields.io/badge/supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white"> <img src="https://img.shields.io/badge/pnpm-f9ad01?style=flat-square&logo=pnpm&logoColor=white">

## 🚀 서비스 소개

`log-trip`은 여행 중에 발생하는 다양한 에피소드와 정보를 실시간으로 기록하기 위해 제작되었습니다. 단순한 텍스트 기록을 넘어 사진과 장소 기반의 로그를 생성하며, 모노레포 아키텍처를 통해 확장성 있는 구조로 설계되었습니다.

<img src="https://file.notion.so/f/f/84a0f652-4c42-495c-a0da-0d97df943c45/a8f205ba-6bcf-49b2-a85b-776166dd7d79/Frame_1.jpg?table=block&id=2686f796-3e8d-80eb-8bc1-cf1ebbbf2ef6&spaceId=84a0f652-4c42-495c-a0da-0d97df943c45&expirationTimestamp=1769443200000&signature=k6lPsC4TvmUbLLU116EU95sOofewr1K6LpjdZFPwF-I&downloadName=Frame+1.jpg" width="20%" alt="일기 화면" /> <img src="https://file.notion.so/f/f/84a0f652-4c42-495c-a0da-0d97df943c45/8f5e4ed9-0f7e-46de-a794-cd015f454f77/Frame_2.jpg?table=block&id=2686f796-3e8d-80d2-b135-e0564cbff7ce&spaceId=84a0f652-4c42-495c-a0da-0d97df943c45&expirationTimestamp=1769443200000&signature=8qBplqGTsFVSeSFo1eie3xiwzf8QO0t_QtOUrlzD_Ew&downloadName=Frame+2.jpg" width="20%" alt="세계지도 화면" />

## ✨ 주요 기능

- **📍 여행 일기 생성**: 여행지에서의 활동을 사진과 함께 기록
- **📷 사진 업로드**: 여행의 순간을 담은 이미지 스토리지 연동
- **🗺️ 세계지도 색칠**: 작성된 일기 기반으로 방문한 나라를 세계지도에 표시
- **🔐 사용자 인증**: Supabase Auth를 활용한 로그인 및 세션 관리
- **📱 모바일 최적화**: 어디서든 편리하게 기록할 수 있는 하이브리드 앱

## 🛠 Tech Stack

### Frontend

- **Framework**: React Native, Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query

### Backend & Infrastructure

- **BaaS**: Supabase (Database, Auth, Storage, Edge Functions)
- **Monorepo Management**: Turborepo
- **Package Manager**: pnpm
- **Deployment**: Vercel(web), ios(mobile)

## 📁 프로젝트 구조 (Monorepo)

Turborepo를 사용하여 패키지와 앱을 효율적으로 분리 관리합니다.

```text
log-trip/
├── apps/
│   ├── mobile/          # App React Native 모바일
│   └── web/             # Webview Next.js 웹
├── supabase/
│   └── functions/       # Supabase Edge Functions 모음
├── .npmrc               # npm 설정 파일 (모바일쪽 빌드를 위한 설정 필수)
├── package.json
├── turbo.json           # Turborepo 설정
└── pnpm-workspace.yaml  # pnpm 워크스페이스 설정
```
