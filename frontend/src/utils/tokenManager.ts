/**
 * Token Management Utility
 * Handles JWT token storage, validation, and automatic refresh
 */

interface TokenData {
  access_token: string;
  token_type: string;
  expires_in: number;
  issued_at: number;
}

class TokenManager {
  private static instance: TokenManager;
  private refreshPromise: Promise<string> | null = null;

  private constructor() {}

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * Store token with expiration tracking
   */
  setToken(tokenData: any): void {
    const data: TokenData = {
      access_token: tokenData.access_token,
      token_type: tokenData.token_type || 'bearer',
      expires_in: tokenData.expires_in || 604800, // 7 days default
      issued_at: Date.now()
    };

    localStorage.setItem('token_data', JSON.stringify(data));
    localStorage.setItem('access_token', data.access_token);
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Get token data with expiration info
   */
  getTokenData(): TokenData | null {
    const data = localStorage.getItem('token_data');
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired or will expire soon
   */
  isTokenExpired(): boolean {
    const tokenData = this.getTokenData();
    if (!tokenData) return true;

    const now = Date.now();
    const expiresAt = tokenData.issued_at + (tokenData.expires_in * 1000);
    const bufferTime = 5 * 60 * 1000; // 5 minutes buffer

    return now >= (expiresAt - bufferTime);
  }

  /**
   * Get time until token expires (in minutes)
   */
  getTimeUntilExpiry(): number {
    const tokenData = this.getTokenData();
    if (!tokenData) return 0;

    const now = Date.now();
    const expiresAt = tokenData.issued_at + (tokenData.expires_in * 1000);
    const timeLeft = expiresAt - now;

    return Math.max(0, Math.floor(timeLeft / (1000 * 60)));
  }

  /**
   * Clear all token data
   */
  clearToken(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_data');
    this.refreshPromise = null;
  }

  /**
   * Refresh token by redirecting to login
   */
  async refreshToken(): Promise<string> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = new Promise((resolve, reject) => {
      // Clear expired token
      this.clearToken();
      
      // Redirect to login page
      const currentPath = window.location.pathname;
      const loginUrl = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
      
      // Store current path for redirect after login
      localStorage.setItem('redirect_after_login', currentPath);
      
      // Redirect to login
      window.location.href = loginUrl;
      
      // This won't actually resolve since we're redirecting
      reject(new Error('Token expired, redirecting to login'));
    });

    return this.refreshPromise;
  }

  /**
   * Get valid token, refreshing if necessary
   */
  async getValidToken(): Promise<string | null> {
    const token = this.getToken();
    
    if (!token) {
      await this.refreshToken();
      return null;
    }

    if (this.isTokenExpired()) {
      console.log('🔄 Token expired, refreshing...');
      await this.refreshToken();
      return null;
    }

    return token;
  }

  /**
   * Handle API response for token validation
   */
  handleApiResponse(response: Response): boolean {
    if (response.status === 401) {
      console.log('🚨 Received 401, token invalid');
      this.refreshToken();
      return false;
    }
    return true;
  }
}

export const tokenManager = TokenManager.getInstance();

/**
 * API fetch wrapper with automatic token handling
 */
export async function apiRequest(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await tokenManager.getValidToken();
  
  if (!token) {
    throw new Error('No valid token available');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle token validation
  if (!tokenManager.handleApiResponse(response)) {
    throw new Error('Token validation failed');
  }

  return response;
}

export default tokenManager;
