import { apiCall } from "../customApiCall";
import { API_ENDPOINTS } from "../apiConfig";

export const fetchNotifications = async (token: string): Promise<ApiResponseType> => {
  const url = `${API_ENDPOINTS.Notification.getNotification}`;
  return await apiCall(url, 'GET', undefined, token);
};


interface Notification {
    id: number;
    user_id: number;
    triggered_by_username: string;
    type: string;
    post_id: number | null;
    message: string;
    is_read: number;
    created_at: string;
    updated_at: string;
  }

  interface ApiResponseType {
    data: Notification[];
    message: string;
    status: string;
  }