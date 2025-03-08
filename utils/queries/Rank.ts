import { API_ENDPOINTS } from "../apiConfig";
import { apiCall } from "../customApiCall";

export const getRank = async (token:string) : Promise<GetRankResponse> => {
  return await apiCall(API_ENDPOINTS.rank.getRank, "GET" ,undefined,token);
};
export const FetchUserRank = async (token:string) : Promise<UserRankResponse> => {
  return await apiCall(API_ENDPOINTS.rank.getUserRank, "GET" ,undefined,token);
};


export const Fetchfaqs = async (token:string) : Promise<rankfaqsResponse> => {
  return await apiCall(API_ENDPOINTS.rank.faqs, "GET" ,undefined,token);
};



interface GetRankResponse {
  status: string;
  data: RankData;
  message: string;
}

interface RankData {
  points: number;
  profile_picture: string;
  rank: number;
  user_id: number;
  username: string;
  win_rate: string;
}
interface UserRankResponse {
  status: string;
  data: {
    userId: number;
    rank: number;
    points: number;
    weekStart: string;
    status: string;
  };
  message: string;
}

interface rankfaqsResponse {
  status: "success";
  data: {
    id: number;
    question: string;
    answer: string;
    createdAt: string;
    updatedAt: string;
    type: "ranking";
  }[];
  message: string;
}