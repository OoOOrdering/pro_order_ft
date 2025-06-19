# 보안 및 인증 가이드 (프론트엔드)

## 1. refresh token httpOnly cookie 적용 권장
- refresh token은 localStorage에 저장하지 않고, 백엔드에서 httpOnly, Secure, SameSite=Strict 쿠키로 발급해야 안전합니다.
- 프론트엔드는 refresh token을 직접 다루지 않고, 인증 관련 API 요청 시 쿠키가 자동 전송됩니다.
- 예시 (백엔드 응답):
  ```http
  Set-Cookie: refresh_token=...; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800
  ```
- 프론트엔드에서는 access token만 localStorage에 저장/관리하고, refresh는 쿠키로만 관리합니다.
- 기존 localStorage 기반 refresh token 코드는 제거 권장.

## 2. XSS/CSRF 방어 (CSP/Helmet)
- next.config.js에서 CSP(Content-Security-Policy) 헤더를 추가할 수 있습니다.
- 예시:
  ```js
  // next.config.js
  module.exports = {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: "default-src 'self'; img-src *; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
            },
          ],
        },
      ];
    },
  };
  ```
- Helmet은 Next.js API route 등 서버사이드에서만 사용 가능합니다.

## 3. 로그아웃 시 상태 초기화
- 전역 상태관리(recoil, react-query 등) 사용 시 로그아웃 시점에 상태 초기화 필요
- 예시:
  ```ts
  import { QueryClient } from 'react-query';
  const queryClient = new QueryClient();
  // ...
  export const logout = () => {
    removeToken();
    removeRefreshToken();
    queryClient.clear(); // react-query 상태 초기화
    // 기타 상태관리도 초기화
  };
  ```
