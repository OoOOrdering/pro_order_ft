// 이 파일은 Swagger(OpenAPI) definitions 기반 자동 생성 타입입니다.
// 각 도메인별 요청/응답 타입을 포함합니다.

export interface User {
  id: number;
  email: string;
  name: string;
  nickname: string;
  phone?: string;
  user_type: 'ADMIN' | 'NORMAL' | 'BLACKLIST';
  user_type_display?: string;
  user_grade?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  user_grade_display?: string;
  is_active: boolean;
  is_email_verified: boolean;
  image_url?: string;
  created_at: string;
}

export interface ProfileUpdate {
  name: string;
  nickname: string;
  phone?: string;
  profile_image_file?: string;
}

export interface EventLog {
  id: number;
  user: User;
  event_name: string;
  event_type?: 'PAGE_VIEW' | 'CLICK' | 'FORM_SUBMISSION' | 'PURCHASE' | 'LOGIN' | 'LOGOUT' | 'API_CALL' | 'ERROR' | 'OTHER';
  value?: string;
  timestamp: string;
  object_id?: number;
  object_type?: string;
  metadata?: Record<string, any>;
}

export interface ChatRoomCreate {
  name: string;
  description?: string;
  max_participants?: number;
  room_type?: 'DIRECT' | 'GROUP';
  participant_ids: number[];
}

export interface ChatRoomUpdate {
  name: string;
  is_active?: boolean;
}

export interface ChatMessageCreate {
  chat_room: number;
  message_type?: 'text' | 'image' | 'file' | 'system';
  content?: string;
}

export interface ChatMessageUpdate {
  content?: string;
}

export interface CSPostCreate {
  post_type?: 'inquiry' | 'report' | 'suggestion' | 'etc';
  title: string;
  content: string;
  attachment_url?: string;
}

export interface CSPostUpdate {
  title: string;
  content: string;
  attachment_url?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'closed';
}

export interface CSReplyCreate {
  content: string;
}

export interface DashboardSummary {
  id: number;
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  total_revenue: string;
  new_users_today: number;
  active_chat_rooms: number;
  unresolved_cs_posts: number;
  last_updated: string;
  user?: number;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface FAQCreateUpdate {
  question: string;
  answer: string;
  category?: string;
  is_published?: boolean;
}

export interface Like {
  id: number;
  user: User;
  content_type: number;
  content_type_name: string;
  object_id: number;
  content_object_data: string;
  created_at: string;
}

export interface LikeCreate {
  content_type: number;
  object_id: number;
}

export interface NoticeCreateUpdate {
  title: string;
  content: string;
  is_published?: boolean;
  is_important?: boolean;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  author: User;
  is_published: boolean;
  is_important: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  title: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  user: number;
}

export interface OrderStatusLogCreate {
  order: number;
  new_status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  reason: string;
  memo?: string;
}

export interface OrderItem {
  id?: number;
  product_name: string;
  quantity: number;
  price: string;
}

export interface OrderCreate {
  shipping_address: string;
  shipping_phone: string;
  shipping_name: string;
  shipping_memo?: string;
  items: OrderItem[];
  payment_method: string;
  payment_id?: string;
  total_amount: string;
}

export interface Order {
  id: number;
  user: User;
  order_number: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  status_display: string;
  total_amount: string;
  payment_method: string;
  payment_status: string;
  payment_id: string;
  shipping_address: string;
  shipping_phone: string;
  shipping_name: string;
  shipping_memo?: string;
  created_at: string;
  updated_at: string;
  cancelled_at?: string;
  refunded_at?: string;
  cancel_reason?: string;
  refund_reason?: string;
  items: OrderItem[];
}

export interface PresetMessage {
  id: number;
  user?: number;
  title: string;
  content: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PresetMessageCreateUpdate {
  title: string;
  content: string;
  is_active?: boolean;
}

export interface ProgressList {
  id: number;
  order: Order;
  last_updated_by: User;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  current_step?: string;
  notes?: string;
  estimated_completion_date?: string;
  actual_completion_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ProgressCreateUpdate {
  order: number;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  current_step?: string;
  notes?: string;
  estimated_completion_date?: string;
  actual_completion_date?: string;
}

export interface ReviewCreateUpdate {
  order?: number;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  is_public?: boolean;
}

export interface NicknameCheck {
  nickname: string;
}

export interface PasswordChange {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

export interface ResendVerificationEmail {
  email: string;
}

export interface Register {
  email: string;
  nickname: string;
  name: string;
  password: string;
  password_confirm: string;
}

export interface TokenVerify {
  token: string;
}

export interface UserBulkApprove {
  user_ids: number[];
}

export interface EmailVerification {
  token: string;
}

export interface WorkCreateUpdate {
  order: number;
  assignee?: number;
  work_type?: 'DESIGN' | 'DEVELOPMENT' | 'MARKETING' | 'OTHER';
  title: string;
  description?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  due_date?: string;
  completed_at?: string;
}

export interface CSPost {
  id: number;
  title: string;
  content: string;
  // TODO: 실제 API 응답에 맞게 필드 추가
}
