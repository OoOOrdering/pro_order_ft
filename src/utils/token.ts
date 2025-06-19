// JWT 토큰 관련 유틸 함수 (TypeScript)

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

export const setToken = (token: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', token);
};

export const removeToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
};

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
};

export const setRefreshToken = (token: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('refresh_token', token);
};

export const removeRefreshToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('refresh_token');
};

export const logout = () => {
  removeToken();
  removeRefreshToken();
  // 필요시 추가적인 로그아웃 처리 (예: 사용자 상태 초기화 등)
};
