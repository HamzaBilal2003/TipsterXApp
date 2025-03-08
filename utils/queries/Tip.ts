import { API_ENDPOINTS } from '../apiConfig';
import { apiCall, ApiResponse } from '../customApiCall';

export const GetTips = async (token: string): Promise<BettingTipResponse> => {
  return await apiCall(API_ENDPOINTS.tips.GetTips, 'GET', undefined, token);
};

export const getTipFaqs = async (token: string): Promise<faqsResponse> => {
  return await apiCall(API_ENDPOINTS.tips.faqs, 'GET', undefined, token);
}
export const TipHistory = async (token: string): Promise<BettingTipResponse> => {
  return await apiCall(API_ENDPOINTS.tips.userTips, 'GET', undefined, token);
};
export const GetCompany = async (token: string): Promise<companyResponse> => {
  return await apiCall(API_ENDPOINTS.tips.companies, 'GET', undefined, token);
};


interface BettingTipResponse {
  status: string;
  data: {
    id: number;
    user_id: number;
    betting_company_id: number;
    codes: string;
    ods: string;
    status: string;
    result: string;
    match_date: string;
    betting_category: string;
    created_at: string;
    updated_at: string;
    betting_company: {
      created_at: string;
      id: number;
      logo: string;
      status: string;
      title: string;
      updated_at: string;
    };
    user: {
      id: number;
      username: string;
      profile_picture: string;
      win_rate: string;
      last_five: string[];
    };
  }[];
  message: string;
}


interface faqsResponse {
  status: string;
  data: {
    id: number;
    question: string;
    answer: string;
    createdAt: string;
    updatedAt: string;
    type: string;
  }[];
  message: string;
}

interface companyResponse {
  status: string;
  data: {
    id: number;
    title: string;
    logo: string;
    status: string;
    created_at: string;
    updated_at: string;
  }[];
  message: string;
}


export interface TipFormData {
  codes: string;
  ods: string;
  betting_company_id: number;
  betting_category: string;
  match_date: string;
  user_id: number;
}