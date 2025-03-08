import { API_ENDPOINTS } from '../apiConfig';
import { apiCall, ApiResponse } from '../customApiCall';
import { TipFormData } from '../queries/Tip';


export const AddTip = async (formdata: TipFormData, token: string) => {
  return await apiCall(API_ENDPOINTS.tips.createTip , 'POST', formdata, token);
};