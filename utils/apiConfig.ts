export const API_BASE_URL = 'https://tipster.hmstech.org';
export const API_BASE_URL_IMG = 'https://tipster.hmstech.org/storage/';
export const API_DOMAIN = API_BASE_URL + '/api/';
export const API_Images_Domain = "https://tipster.hmstech.org/storage/"

export const API_ENDPOINTS = {
  AUTH: {
    Login: API_DOMAIN + 'auth/login',
    MarkAllRead: API_DOMAIN + '/public/mark-all-read',
    Register: API_DOMAIN + 'auth/register',
    Logout: API_DOMAIN + '/auth/logout',
    VerifyEmailOtp: API_DOMAIN + 'auth/otp-verification',
    ResendOtp: API_DOMAIN + '/auth/resend-otp',
    ForgotPassword: API_DOMAIN + 'auth/forget-password',
    VerifyPasswordOtp: API_DOMAIN + 'auth/verify-forget-password-otp/',
    ResetPassword: API_DOMAIN + 'auth/reset-password',
    EditProfile: API_DOMAIN + 'user/update-profile/',
    KyCRequest: API_DOMAIN + '/auth/kyc-request',
    ChangePassword: API_DOMAIN + '/auth/change-password',
    Notifications: API_DOMAIN + '/auth/get-all-notifications',
    SetNewPassword: API_DOMAIN + '/auth/set-new-password',
    GetKycDetails: API_DOMAIN + '/auth/get-kyc-details',
    changePasswordEdit: API_DOMAIN + 'user/change-password',
  },
  Post : {
    GetPosts:API_DOMAIN + 'posts/get-all',
    GetLikes:API_DOMAIN+ "posts/like",
    AddPost:API_DOMAIN+ "posts/create",
    deletePost: API_DOMAIN + "posts/delete-post/"
  },
  tips : {
    createTip:API_DOMAIN + "tip/create",
    GetTips:API_DOMAIN + 'tip/get-all-free-running-tips',
    faqs:API_DOMAIN+"Faq/get-all/tip",
    userTips:API_DOMAIN+"tip/get-all-of-user",
    companies:API_DOMAIN+"betting-company/get-all",
  },
  subscriotion:{
    getpackages : API_DOMAIN + "packages",
    subscriptions : API_DOMAIN + "subscriptions",
  },
  rank : {
    getRank: API_DOMAIN + "ranking/get-top-30-rankings",
    getUserRank: API_DOMAIN + "ranking/get-user-ranking",
    faqs:API_DOMAIN+"Faq/get-all/ranking",
  },
  profile : {
    getProfile: API_DOMAIN + "user/view-profile/",
    bankDetail: API_DOMAIN + 'bank/get-for-user'
  },
  Notification:{
    getNotification: API_DOMAIN + 'notifications/'
  },



  PUBLIC: {
    GetCountries: API_DOMAIN + '/public/countries',
    ReadAllMessages: API_DOMAIN + '/customer/read-all-messages',
  },

  CHATS: {
    GetAllChats: API_DOMAIN + '/customer/get-all-chats',
    GetChatDetails: API_DOMAIN + '/customer/get-chat', //with chatid parameter
    SendMessage: API_DOMAIN + '/customer/send-message',
  },
};
