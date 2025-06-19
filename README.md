# front

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/hyazzangs-projects/v0-front)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/SteCjJr65oK)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/hyazzangs-projects/v0-front](https://vercel.com/hyazzangs-projects/v0-front)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/SteCjJr65oK](https://v0.dev/chat/projects/SteCjJr65oK)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## 보안/인증
- refresh token은 httpOnly cookie로 관리 권장(SECURITY_GUIDE.md 참고)
- CSP 헤더 적용(see next.config.js)

## 테스트
- 유닛: src/__tests__/*.test.tsx
- E2E: playwright/cypress 샘플 추가 가능

## 실시간 알림
- src/utils/socket.ts 참고
- 알림 UI: Toast, Badge 등 연동 샘플 구현 가능

## 기타
- SEO/OG: Head 태그에 og:title, og:description, og:image 등 추가 권장
- PWA: next-pwa 등 적용 가능
- API Mock: msw 등 샘플 적용 가능

---
더 궁금한 점은 언제든 문의하세요!
