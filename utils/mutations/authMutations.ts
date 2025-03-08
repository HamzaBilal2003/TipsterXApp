import { API_ENDPOINTS } from '../apiConfig';
import { apiCall, ApiResponse } from '../customApiCall';

export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  return await apiCall(API_ENDPOINTS.AUTH.Login, 'POST', data);
};

export const verifyEmailOtp = async ({otp,email}:{otp: string,email:string}) : Promise<RegisterResponse> => {
  const data = { otp: otp,email:email };
  return await apiCall(API_ENDPOINTS.AUTH.VerifyEmailOtp, 'POST', data);
};

export const verifyPasswordOtp = async (email: string, otp: string) => {
  const data = {
    email: email,
    otp: otp,
  };
  return await apiCall(
    API_ENDPOINTS.AUTH.VerifyPasswordOtp,
    'POST',
    data,
    undefined
  );
};
export const FetchResetPassword = async (email: string, password: string) => {
  const data = {
    email: email,
    password: password,
  };
  return await apiCall(
    API_ENDPOINTS.AUTH.ResetPassword,
    'POST',
    data,
    undefined
  );
};

export const forgotPassword = async (data: {
  email: string;
}): Promise<IForgotPasswordOtp> => {  
  return await apiCall(API_ENDPOINTS.AUTH.ForgotPassword, 'POST', data);
};

export const register = async (data: FormData): Promise<RegisterResponse> => {
  return await apiCall(API_ENDPOINTS.AUTH.Register, 'POST', data,undefined);
};

export const resendOtp = async (token?: string, email?: string) => {
  if (token) {
    return await apiCall(API_ENDPOINTS.AUTH.ResendOtp, 'POST', { token });
  }
  if (email) {
    return await apiCall(API_ENDPOINTS.AUTH.ResendOtp, 'POST', { email });
  }
};

// notifications



export const getNotifications = async (
  token: string
): Promise<NotificationResponse> => {
  return await apiCall(
    API_ENDPOINTS.AUTH.Notifications,
    'GET',
    undefined,
    token
  );
};
export const markAllRead = async (
  token: string
): Promise<NotificationResponse> => {
  return await apiCall(
    API_ENDPOINTS.AUTH.MarkAllRead,
    'GET',
    undefined,
    token
  );
};

export const editProfile = async (data: FormData,user_id:number ,token: string) : Promise<EditProfileResponse> => {
  return await apiCall(API_ENDPOINTS.AUTH.EditProfile + user_id, 'POST', data, token);
}

export const ResetPasswordOfEdit = async (data: FormData,token: string) : Promise<EditProfileResponse> => {
  return await apiCall(API_ENDPOINTS.AUTH.changePasswordEdit, 'POST', data, token);
}


interface Notification {
  id: number;
  title: string;
  description: string;
  userId: number;
  isRead: boolean;
  createdAt: string;
}

interface NotificationResponse {
  status: string;
  message: string;
  data: Notification[];
}

export enum UserRoles {
  admin = 'admin',
  customer = 'customer',
  agent = 'agent',
}



export interface LoginResponse {
  message: string;
  status: string;
  data: {
    user: {
      id: number;
      username: string;
      email: string;
      email_verified_at: string | null;
      phone: string;
      dob: string; // Formatted as "DD-MM-YYYY"
      nationality: string;
      profile_picture: string;
      otp: string | null;
      otp_verified: string;
      is_active: number;
      created_at: string;
      updated_at: string;
      vip_status: string;
      bio: string;
    };
    token: string;
  };
}

interface IForgotPasswordOtp {
  status: string;
  data: {
    email: string;
    otp: number;
    userId: number;
    updatedAt: string;
    createdAt: string;
    id: number;
  };
  message: string;
}
interface IRegisterReq {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  username: string;
  gender: string;
  country: string;
}

interface IKycReques {
  surName?: string;
  firstName?: string;
  bvn?: string;
  dob?: string;
}

interface IChangePasswordReq {
  oldPassword: string;
  newPassword: string;
}
export interface FormData {
  username: string;
  phone: string;
  email: string;
  dob:string;
  nationality: string;
  password: string;
  profileImage?: string;
}
export interface RegisterResponse {
  status: string;
  message: string;
  data: {
    id: number;
    username: string;
    email: string;
    phone: string;
    dob: string; // Formatted as "DD-MM-YYYY"
    nationality: string;
    otp: number;
    created_at: string;
    updated_at: string;
};
}


interface EditProfileResponse {
  status: string;
  data: {
    id: number;
    username: string;
    email: string;
    email_verified_at: string | null;
    phone: string;
    dob: string;
    nationality: string;
    profile_picture: string;
    otp: string | null;
    otp_verified: string;
    is_active: number;
    created_at: string;
    updated_at: string;
    vip_status: string;
    bio: string;
  };
  message: string;
}