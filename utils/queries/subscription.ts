import { apiCall,ApiResponse } from "../customApiCall";
import { API_ENDPOINTS } from "../apiConfig";

export const fetchPackage = async (token: string): Promise<PackagesResponse> => {
    // const data = { token: token }
    return await apiCall(API_ENDPOINTS.subscriotion.getpackages, 'GET', undefined, token);
};
export const subscriptions = async (packageId : number,token: string): Promise<PackagesResponse> => {
    const data = { package_id: packageId }
    return await apiCall(API_ENDPOINTS.subscriotion.subscriptions, 'POST', data, token);
};

interface Package {
    id: number;
    title: string;
    duration: string;
    amount: string;
    created_at: string;
    updated_at: string;
}

interface PackagesResponse {
    message: string;
    data: Package[];
}