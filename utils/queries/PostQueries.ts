import { API_ENDPOINTS } from '../apiConfig';
import { apiCall, ApiResponse } from '../customApiCall';

export const fetchAllPosts = async (token: string) : Promise<ApiResponseType> => {
    // const data = { token: token }
    return await apiCall(API_ENDPOINTS.Post.GetPosts, 'GET', undefined, token);
};


export const LikePost = async (PostId :number , token: string) => {
    // const data = { token: token }
    return await apiCall(API_ENDPOINTS.Post.GetLikes + "/" + PostId , 'GET', undefined, token);
};


export const deletePost = async (PostId :number , token: string) => {
    // const data = { token: token }
    return await apiCall(API_ENDPOINTS.Post.deletePost + PostId , 'GET', undefined, token);
};



interface User {
    id: number;
    username: string;
    profile_picture: string;
}

interface Comment {
    id: number;
    user: User;
    content: string;
}

interface Post {
    id: number;
    user: User;
    timestamp: string;
    content: string;
    type: string;
    likes_count: number;
    comments_count: number;
    share_count: number;
    view_count: number;
    recent_comments: Comment[];
    image_1: string;
}

interface ApiResponseType {
    data: Post[];
    message: string;
    status: string;
}