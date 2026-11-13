export interface PromptItem {
  id: string;
  title: string;
  category: string;
  thumbnail_url: string;
  video_url?: string;
  prompt_text: string;
  is_premium: boolean;
  views_count: string;
  created_at: string;
  negative_prompt?: string;
  aspect_ratio?: '9:16' | '16:9' | '1:1';
  model_recommended?: string;
  tags?: string[];
  author_id?: string;
  author_email?: string;
}

export interface MasterPromptGuide {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  featured_image: string;
  full_guide: string;
  universal_template: string;
  workflow_steps?: string[];
  recommended_tools?: string[];
  is_premium: boolean;
  views_count?: string;
  read_time?: string;
  created_at: string;
}

export type UserRole = 'guest' | 'free' | 'subscriber' | 'admin';

export type SubscriptionStatus = 'active' | 'inactive' | 'pending';

export type PaymentMethod = 'JazzCash' | 'Easypaisa' | 'Bank Transfer';

export type PaymentRequestStatus = 'pending' | 'approved' | 'rejected';

export interface PaymentRequest {
  id: string;
  userId: string;
  userEmail: string;
  trxId: string;
  screenshotUrl: string;
  paymentMethod?: PaymentMethod;
  status: PaymentRequestStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface UserSubscription {
  uid: string;
  email: string;
  display_name: string;
  photo_url?: string;
  subscriptionStatus: SubscriptionStatus;
  is_premium: boolean;
  role?: 'user' | 'admin';
  premium_until?: string;
  stripe_customer_id?: string;
  saved_prompt_ids?: string[];
  plan?: 'monthly' | 'yearly' | 'lifetime';
}

export interface AITool {
  name: string;
  category: 'Video Generation' | 'Image Generation' | 'Voice & Audio' | 'Upscaling';
  description: string;
  bestFor: string;
  url: string;
  badge?: string;
  logoUrl: string;
}