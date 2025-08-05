export interface User {
  id: number;
  fb_user_id: string;
  name: string;
  email?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Page {
  id: number;
  user_id: number;
  fb_page_id: string;
  ig_business_id?: string;
  page_name: string;
  instagram_username?: string;
  webhook_subscribed: boolean;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface FAQ {
  id: number;
  user_id: number;
  question: string;
  answer: string;
  similarity_threshold: number;
  usage_count: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Message {
  id: number;
  user_id: number;
  matched_faq_id?: number;
  ig_user_id: string;
  ig_message_id: string;
  message_text: string;
  response_text?: string;
  similarity_score?: number;
  auto_replied: boolean;
  reply_sent_at?: string;
  created_at: string;
}

export interface FAQMatch {
  faq_id: number;
  question: string;
  answer: string;
  similarity_score: number;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface FAQCreateData {
  question: string;
  answer: string;
  similarity_threshold?: number;
}

export interface FAQUpdateData {
  question?: string;
  answer?: string;
  similarity_threshold?: number;
  is_active?: boolean;
}
