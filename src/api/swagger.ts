// Swagger 기반 자동 생성 API 서비스 (axios 기반)
// 각 도메인별 엔드포인트 함수, 타입 적용
import axios from '../utils/axios';
import * as T from '../types/swagger';

// User 관련
export const getProfile = () => axios.get<T.User>('/users/users/me/');
export const updateProfile = (data: T.ProfileUpdate) => axios.put<T.User>('/users/users/me/', data);
export const deleteProfile = () => axios.delete('/users/users/me/');
export const getUserList = () => axios.get<T.User[]>('/users/users/');
export const bulkApproveUsers = (data: T.UserBulkApprove) => axios.post('/users/users/bulk-approve/', data);
export const register = (data: T.Register) => axios.post('/users/signup/', data);
export const login = (data: { email: string; password: string }) => axios.post('/users/token/login/', data);
export const logout = () => axios.post('/users/token/logout/');
export const refreshToken = (csrfToken: string) => axios.post('/users/token/refresh/', {}, { headers: { 'X-CSRFToken': csrfToken } });
export const verifyToken = (data: T.TokenVerify) => axios.post('/users/token/verify/', data);
export const checkNickname = (data: T.NicknameCheck) => axios.post('/users/nickname/check/', data);
export const changePassword = (data: T.PasswordChange) => axios.post('/users/password-change/', data);
export const passwordReset = (data: { email: string }) => axios.post('/users/password-reset/', data);
export const resendVerificationEmail = (data: T.ResendVerificationEmail) => axios.post('/users/resend-verification-email/', data);
export const verifyEmail = (data: T.EmailVerification) => axios.post('/users/verify-email/', data);
// Token Info (JWT 토큰 정보 확인)
export const getTokenInfo = () => axios.get<T.User>('/users/token/info/');
// 이메일 인증 링크 확인(GET)
export const verifyEmailLink = () => axios.get('/users/verify/email/');

// Order 관련
export const getOrderList = (params?: any) => axios.get<T.Order[]>('/orders/orders/', { params });
export const getOrder = (id: number) => axios.get<T.Order>(`/orders/orders/${id}/`);
export const createOrder = (data: T.OrderCreate) => axios.post<T.Order>('/orders/orders/', data);
export const updateOrder = (id: number, data: Partial<T.Order>) => axios.put<T.Order>(`/orders/orders/${id}/`, data);
export const partialUpdateOrder = (id: number, data: Partial<T.Order>) => axios.patch<T.Order>(`/orders/orders/${id}/`, data);
export const deleteOrder = (id: number) => axios.delete(`/orders/orders/${id}/`);
export const cancelOrder = (id: number) => axios.post(`/orders/orders/${id}/cancel/`);
export const refundOrder = (id: number) => axios.post(`/orders/orders/${id}/refund/`);
export const exportOrderPdf = (id: number) => axios.get(`/orders/orders/${id}/export/pdf/`, { responseType: 'blob' });
export const exportOrdersCsv = () => axios.get('/orders/orders/export/csv/', { responseType: 'blob' });

// OrderStatusLog
export const getOrderStatusLogs = (params?: any) => axios.get('/order-status-logs/', { params });
export const getOrderStatusLog = (id: number) => axios.get(`/order-status-logs/${id}/`);

// Work
export const getWorkList = (params?: any) => axios.get('/works/works/', { params });
export const getWork = (id: number) => axios.get(`/works/works/${id}/`);
export const createWork = (data: T.WorkCreateUpdate) => axios.post('/works/works/', data);
export const updateWork = (id: number, data: T.WorkCreateUpdate) => axios.put(`/works/works/${id}/`, data);
export const partialUpdateWork = (id: number, data: Partial<T.WorkCreateUpdate>) => axios.patch(`/works/works/${id}/`, data);
export const deleteWork = (id: number) => axios.delete(`/works/works/${id}/`);

// ChatRoom
export const getChatRoomList = (params?: any) => axios.get('/chat-rooms/chat-rooms/', { params });
export const getChatRoom = (id: string) => axios.get(`/chat-rooms/chat-rooms/${id}/`);
export const createChatRoom = (data: T.ChatRoomCreate) => axios.post('/chat-rooms/chat-rooms/', data);
export const updateChatRoom = (id: string, data: T.ChatRoomUpdate) => axios.put(`/chat-rooms/chat-rooms/${id}/`, data);
export const partialUpdateChatRoom = (id: string, data: Partial<T.ChatRoomUpdate>) => axios.patch(`/chat-rooms/chat-rooms/${id}/`, data);
export const deleteChatRoom = (id: string) => axios.delete(`/chat-rooms/chat-rooms/${id}/`);
export const joinChatRoom = (id: string) => axios.post(`/chat-rooms/chat-rooms/${id}/join/`);
export const leaveChatRoom = (id: string) => axios.post(`/chat-rooms/chat-rooms/${id}/leave/`);
export const addParticipants = (id: string) => axios.post(`/chat-rooms/chat-rooms/${id}/add-participants/`);
export const removeParticipants = (id: string) => axios.post(`/chat-rooms/chat-rooms/${id}/remove-participants/`);
export const markChatRoomAsRead = (id: string) => axios.post(`/chat-rooms/chat-rooms/${id}/mark-as-read/`);

// ChatMessage
export const getChatMessages = (chatRoomPk: string, params?: any) => axios.get(`/chat-rooms/${chatRoomPk}/messages/`, { params });
export const getChatMessage = (chatRoomPk: string, id: string) => axios.get(`/chat-rooms/${chatRoomPk}/messages/${id}/`);
export const createChatMessage = (chatRoomPk: string, data: T.ChatMessageCreate) => axios.post(`/chat-rooms/${chatRoomPk}/messages/`, data);
export const updateChatMessage = (chatRoomPk: string, id: string, data: T.ChatMessageUpdate) => axios.put(`/chat-rooms/${chatRoomPk}/messages/${id}/`, data);
export const partialUpdateChatMessage = (chatRoomPk: string, id: string, data: Partial<T.ChatMessageUpdate>) => axios.patch(`/chat-rooms/${chatRoomPk}/messages/${id}/`, data);
export const deleteChatMessage = (chatRoomPk: string, id: string) => axios.delete(`/chat-rooms/${chatRoomPk}/messages/${id}/`);

// Notification
export const getNotificationList = (params?: any) => axios.get('/notifications/notifications/', { params });
export const getNotification = (id: string) => axios.get(`/notifications/notifications/${id}/`);
export const createNotification = (data: T.Notification) => axios.post('/notifications/notifications/', data);
export const updateNotification = (id: string, data: T.Notification) => axios.put(`/notifications/notifications/${id}/`, data);
export const partialUpdateNotification = (id: string, data: Partial<T.Notification>) => axios.patch(`/notifications/notifications/${id}/`, data);
export const deleteNotification = (id: string) => axios.delete(`/notifications/notifications/${id}/`);
export const markNotificationAsRead = (id: string) => axios.post(`/notifications/notifications/${id}/mark-as-read/`);
export const getUnreadNotifications = (params?: any) => axios.get('/notifications/notifications/unread/', { params });
export const getUnreadNotificationCount = () => axios.get('/notifications/notifications/unread_count/');

// Notice
export const getNoticeList = (params?: any) => axios.get('/notices/notices/', { params });
export const getNotice = (id: number) => axios.get(`/notices/notices/${id}/`);
export const createNotice = (data: T.NoticeCreateUpdate) => axios.post('/notices/notices/', data);
export const updateNotice = (id: number, data: T.NoticeCreateUpdate) => axios.put(`/notices/notices/${id}/`, data);
export const partialUpdateNotice = (id: number, data: Partial<T.NoticeCreateUpdate>) => axios.patch(`/notices/notices/${id}/`, data);
export const deleteNotice = (id: number) => axios.delete(`/notices/notices/${id}/`);
export const getRecentNotices = () => axios.get('/notices/notices/recent/');

// FAQ
export const getFaqList = (params?: any) => axios.get('/faqs/faqs/', { params });
export const getFaq = (id: number) => axios.get(`/faqs/faqs/${id}/`);
export const createFaq = (data: T.FAQCreateUpdate) => axios.post('/faqs/faqs/', data);
export const updateFaq = (id: number, data: T.FAQCreateUpdate) => axios.put(`/faqs/faqs/${id}/`, data);
export const partialUpdateFaq = (id: number, data: Partial<T.FAQCreateUpdate>) => axios.patch(`/faqs/faqs/${id}/`, data);
export const deleteFaq = (id: number) => axios.delete(`/faqs/faqs/${id}/`);
export const getPublishedFaqs = (params?: any) => axios.get('/faqs/faqs/published/', { params });

// CSPost
export const getCSPostList = (params?: any) => axios.get('/cs-posts/', { params });
export const getCSPost = (id: number) => axios.get(`/cs-posts/${id}/`);
export const createCSPost = (data: T.CSPostCreate) => axios.post('/cs-posts/', data);
export const updateCSPost = (id: number, data: T.CSPostUpdate) => axios.put(`/cs-posts/${id}/`, data);
export const partialUpdateCSPost = (id: number, data: Partial<T.CSPostUpdate>) => axios.patch(`/cs-posts/${id}/`, data);
export const deleteCSPost = (id: number) => axios.delete(`/cs-posts/${id}/`);

// CSReply
export const getCSReplyList = (csPostPk: string, params?: any) => axios.get(`/cs-replies/cs-posts/${csPostPk}/replies/`, { params });
export const getCSReply = (csPostPk: string, id: string) => axios.get(`/cs-replies/cs-posts/${csPostPk}/replies/${id}/`);
export const createCSReply = (csPostPk: string, data: T.CSReplyCreate) => axios.post(`/cs-replies/cs-posts/${csPostPk}/replies/`, data);
export const updateCSReply = (csPostPk: string, id: string, data: T.CSReplyCreate) => axios.put(`/cs-replies/cs-posts/${csPostPk}/replies/${id}/`, data);
export const partialUpdateCSReply = (csPostPk: string, id: string, data: Partial<T.CSReplyCreate>) => axios.patch(`/cs-replies/cs-posts/${csPostPk}/replies/${id}/`, data);
export const deleteCSReply = (csPostPk: string, id: string) => axios.delete(`/cs-replies/cs-posts/${csPostPk}/replies/${id}/`);

// Review
export const getReviewList = (params?: any) => axios.get('/reviews/', { params });
export const getReview = (id: number) => axios.get(`/reviews/${id}/`);
export const createReview = (data: T.ReviewCreateUpdate) => axios.post('/reviews/', data);
export const updateReview = (id: number, data: T.ReviewCreateUpdate) => axios.put(`/reviews/${id}/`, data);
export const partialUpdateReview = (id: number, data: Partial<T.ReviewCreateUpdate>) => axios.patch(`/reviews/${id}/`, data);
export const deleteReview = (id: number) => axios.delete(`/reviews/${id}/`);

// Like
export const getLikeList = (params?: any) => axios.get('/likes/likes/', { params });
export const createLike = (data: T.LikeCreate) => axios.post('/likes/likes/', data);
export const deleteLike = (id: number) => axios.delete(`/likes/likes/${id}/`);

// PresetMessage
export const getPresetMessageList = (params?: any) => axios.get('/preset-messages/', { params });
export const getPresetMessage = (id: string) => axios.get(`/preset-messages/${id}/`);
export const createPresetMessage = (data: T.PresetMessageCreateUpdate) => axios.post('/preset-messages/', data);
export const updatePresetMessage = (id: string, data: T.PresetMessageCreateUpdate) => axios.put(`/preset-messages/${id}/`, data);
export const partialUpdatePresetMessage = (id: string, data: Partial<T.PresetMessageCreateUpdate>) => axios.patch(`/preset-messages/${id}/`, data);
export const deletePresetMessage = (id: string) => axios.delete(`/preset-messages/${id}/`);

// Progress
export const getProgressList = (params?: any) => axios.get('/progress/', { params });
export const getProgress = (id: number) => axios.get(`/progress/${id}/`);
export const createProgress = (data: T.ProgressCreateUpdate) => axios.post('/progress/', data);
export const updateProgress = (id: number, data: T.ProgressCreateUpdate) => axios.put(`/progress/${id}/`, data);
export const partialUpdateProgress = (id: number, data: Partial<T.ProgressCreateUpdate>) => axios.patch(`/progress/${id}/`, data);
export const deleteProgress = (id: number) => axios.delete(`/progress/${id}/`);

// Analytics
export const getDailyAnalytics = (params?: any) => axios.get('/analytics/daily-analytics/', { params });
export const getEventLogs = (params?: any) => axios.get('/analytics/event-logs/', { params });
export const getEventLog = (id: number) => axios.get(`/analytics/event-logs/${id}/`);
export const createEventLog = (data: T.EventLog) => axios.post('/analytics/event-logs/', data);

// Dashboard
export const getDashboardList = (params?: any) => axios.get('/dashboard/', { params });
export const getDashboard = (id: string) => axios.get(`/dashboard/${id}/`);
export const getGlobalDashboard = () => axios.get('/dashboard/global/');

// 이미지 업로드/삭제
export const uploadImage = (formData: FormData) => axios.post('/images/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteImage = (formData: FormData) => axios.delete('/images/upload', { data: formData, headers: { 'Content-Type': 'multipart/form-data' } });
