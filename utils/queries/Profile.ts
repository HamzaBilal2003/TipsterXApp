import { apiCall } from "../customApiCall";
import { API_ENDPOINTS } from "../apiConfig";



export const getProfile = async (userId: number,token:string) : Promise<ProfileView> => {
    return await apiCall(API_ENDPOINTS.profile.getProfile + userId, "GET" ,undefined,token);
};

export const GetBankDetail = async (token:string) : Promise<BankDetail> => {
    return await apiCall(API_ENDPOINTS.profile.bankDetail, "GET" ,undefined,token);
}

interface ProfileView {
    status: "success";
    data: {
        userId: string;
        user: {
            id: number;
            username: string;
            email: string;
            email_verified_at: string | null;
            phone: string;
            dob: string;
            nationality: string;
            profile_picture: string;
            otp: string | null;
            otpVerified: string;
            isActive: number;
            createdAt: string;
            updatedAt: string;
            vip_status: string;
            bio?:string;
        };
        win_rate: string;
        total_wins: number;
        last_five: string[];
        average_odds: number;
        total_predictions: number;
        tips: Tip[];
        isFollowing: boolean;
        subscriber: number;
        follower_count: number;
        graphicalData: GraphicalData[];
    };
    message: string;
}

interface Tip {
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
    betting_company: BettingCompany;
    user: User;
}

interface BettingCompany {
    id: number;
    title: string;
    logo: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface User {
    id: number;
    username: string;
    profile_picture: string;
    win_rate: string;
    last_five: string[];
}

interface GraphicalData {
    month: string;
    win_rate: number;
}

interface BankDetail {
    status: "success";
    data: {
        id: number;
        userId: number;
        bank_name: string;
        account_number: string;
        account_name: string;
        created_at: string;
        updated_at: string;
    };
    message: string;
}