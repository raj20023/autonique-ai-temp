import { AuthToken } from '@/types';

export const AUTH_TOKEN_KEY = 'access_token';
export const USER_DATA_KEY = 'user_data';

export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const setUserData = (userData: any): void => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

export const getUserData = (): any | null => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const handleAuthCallback = (authData: AuthToken): void => {
  setAuthToken(authData.access_token);
  // Redirect to dashboard
  window.location.href = '/dashboard';
};

export const logout = (): void => {
  removeAuthToken();
  window.location.href = '/';
};

export const getFacebookLoginUrl = (): string => {
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/callback`;
  const scope = 'pages_show_list,pages_messaging,instagram_basic,instagram_manage_messages';
  
  return `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code&auth_type=rerequest`;
};
