import { API_ENDPOINTS } from '../apiConfig';
import { apiCall, ApiResponse } from '../customApiCall';

export const AddPost = async (formdata: FormData, token: string) => {
  return await apiCall(API_ENDPOINTS.Post.AddPost, 'POST', formdata, token);
};

interface responseForm {
  status: string;
  data: {
      title: string,
      content: string;
      images: string[];
      user_id: number;
      updated_at: string;
      created_at: string;
      id: number;
      image_1: string;
      image_2: string;
      image_3: string;
  };
  message: string
}