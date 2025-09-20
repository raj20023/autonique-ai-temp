import axios, { AxiosResponse } from 'axios';
import { AuthToken, User, Page, FAQ, FAQCreateData, FAQUpdateData } from '@/types';

// Use hardcoded production API URL (Railway env vars don't work well with frontend)
const API_BASE_URL = 'https://api.autonique.in';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('🚨 API received 401, token invalid');
      localStorage.removeItem('access_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  getLoginUrl: (redirectUri: string): Promise<AxiosResponse<{ login_url: string }>> =>
    api.get(`/auth/login?redirect_uri=${encodeURIComponent(redirectUri)}`),
  
  handleCallback: (code: string, redirectUri: string): Promise<AxiosResponse<AuthToken>> =>
    api.get(`/auth/callback?code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`),
};

// User API
export const userApi = {
  getCurrentUser: (): Promise<AxiosResponse<User>> =>
    api.get('/users/me'),
  
  updateCurrentUser: (data: Partial<User>): Promise<AxiosResponse<User>> =>
    api.put('/users/me', data),
  
  deleteCurrentUser: (): Promise<AxiosResponse<{ message: string }>> =>
    api.delete('/users/me'),
};

// Pages API
export const pagesApi = {
  getPages: (): Promise<AxiosResponse<Page[]>> =>
    api.get('/pages/'),
  
  getPage: (pageId: number): Promise<AxiosResponse<Page>> =>
    api.get(`/pages/${pageId}`),
  
  updatePage: (pageId: number, data: Partial<Page>): Promise<AxiosResponse<Page>> =>
    api.put(`/pages/${pageId}`, data),
  
  subscribeWebhook: (pageId: number): Promise<AxiosResponse<{ message: string }>> =>
    api.post(`/pages/${pageId}/subscribe-webhook`),
};

// FAQ API
export const faqApi = {
  getFAQs: (skip = 0, limit = 100): Promise<AxiosResponse<FAQ[]>> =>
    api.get(`/faqs/?skip=${skip}&limit=${limit}`),
  
  getFAQ: (faqId: number): Promise<AxiosResponse<FAQ>> =>
    api.get(`/faqs/${faqId}`),
  
  createFAQ: (data: FAQCreateData): Promise<AxiosResponse<FAQ>> =>
    api.post('/faqs/', data),
  
  createFAQsBulk: (faqs: FAQCreateData[]): Promise<AxiosResponse<FAQ[]>> =>
    api.post('/faqs/bulk', { faqs }),
  
  uploadFAQsCSV: (file: File): Promise<AxiosResponse<FAQ[]>> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/faqs/upload-csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  updateFAQ: (faqId: number, data: FAQUpdateData): Promise<AxiosResponse<FAQ>> =>
    api.put(`/faqs/${faqId}`, data),
  
  deleteFAQ: (faqId: number): Promise<AxiosResponse<{ message: string }>> =>
    api.delete(`/faqs/${faqId}`),
  
  testFAQMatch: (message: string): Promise<AxiosResponse<{ match_found: boolean; faq?: any; message: string }>> =>
    api.post('/faqs/test-match', null, { params: { message } }),
};

export default api;
