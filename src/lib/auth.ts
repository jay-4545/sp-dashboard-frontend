const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  sessionStorage.setItem(TOKEN_KEY, accessToken);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  document.cookie = 'auth_present=1; path=/; SameSite=Lax';
}

export function setToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
  document.cookie = 'auth_present=1; path=/; SameSite=Lax';
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem('auth_user');
  document.cookie = 'auth_present=; path=/; max-age=0';
}

export function isAuthenticated(): boolean {
  return !!getToken() || !!getRefreshToken();
}
