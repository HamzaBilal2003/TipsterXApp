
# Authentication Guide

This guide will cover how to handle authentication in your project, including login, signup, and password management. It will also explain how to handle errors and maintain user sessions.

## 1. Define API Endpoints
All authentication-related API endpoints are defined in `utils/apiConfig.ts`.

```ts
export const API_ENDPOINTS = {
  AUTH: {
    Login: API_DOMAIN + '/public/login',
    Register: API_DOMAIN + '/auth/customer/register',
    ForgotPassword: API_DOMAIN + '/auth/customer/forgot-password',
    VerifyEmailOtp: API_DOMAIN + '/auth/customer/verify-email-otp',
    VerifyPasswordOtp: API_DOMAIN + '/auth/customer/verify-password-otp',
    ResendOtp: API_DOMAIN + '/auth/customer/resend-otp',
    Notifications: API_DOMAIN + '/auth/customer/notifications',
    MarkAllRead: API_DOMAIN + '/auth/customer/mark-all-read',
    // ... other endpoints
  },
  // ... other categories
};
```

## 2. Create API Call Function
The `apiCall` function is defined in `utils/customApiCalls.ts`.

```ts
import axios from 'axios';

export const apiCall = async (url, method, data, token) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await axios({
    url,
    method,
    data,
    headers,
  });
  return response.data;
};
```

## 3. Define API Functions
Create functions to call specific API endpoints. These functions are defined in `utils/mutations/authMutations.ts`.

```ts
import { apiCall } from '../customApiCalls';
import { API_ENDPOINTS } from '../apiConfig';

export const loginUser = async (data: { email: string; password: string }) => {
  return await apiCall(API_ENDPOINTS.AUTH.Login, 'POST', data);
};

export const registerUser = async (data: IRegisterReq) => {
  return await apiCall(API_ENDPOINTS.AUTH.Register, 'POST', data);
};

export const forgotPassword = async (data: { email: string }) => {
  return await apiCall(API_ENDPOINTS.AUTH.ForgotPassword, 'POST', data);
};

export const verifyEmailOtp = async (token: string, otp: string) => {
  const data = { otp: otp };
  return await apiCall(API_ENDPOINTS.AUTH.VerifyEmailOtp, 'POST', data, token);
};

export const verifyPasswordOtp = async (email: string, otp: string) => {
  const data = { email: email, otp: otp };
  return await apiCall(API_ENDPOINTS.AUTH.VerifyPasswordOtp, 'POST', data);
};

export const resendOtp = async (token?: string, email?: string) => {
  if (token) {
    return await apiCall(API_ENDPOINTS.AUTH.ResendOtp, 'POST', { token });
  }
  if (email) {
    return await apiCall(API_ENDPOINTS.AUTH.ResendOtp, 'POST', { email });
  }
};
```

## 4. Use API Functions in Components
Import and use these API functions in your React components. Use hooks like `useMutation` from `@tanstack/react-query` to manage API calls.

### Example: Login
In `app/signin.tsx`:

```tsx
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '@/utils/mutations/authMutations';
import { useAuth } from '@/contexts/authContext';
import { showTopToast } from '@/utils/helpers';
import * as SecureStore from 'expo-secure-store';

const Signin = () => {
  const { setToken, setUserData } = useAuth();

  const { mutate: handleLogin, isPending: loginPending } = useMutation({
    mutationFn: loginUser,
    mutationKey: ['login'],
    onSuccess: async (data) => {
      const { token, data: userData } = data;
      setToken(token);
      setUserData(userData);
      await SecureStore.setItemAsync('USER_TOKEN', token);
      await SecureStore.setItemAsync('USER_DATA', JSON.stringify(userData));
      navigate('(tabs)');
    },
    onError: (error: ApiError) => {
      showTopToast({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    },
  });

  // Render login form
};
```

### Example: Signup
In `app/signup.tsx`:

```tsx
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '@/utils/mutations/authMutations';
import { useAuth } from '@/contexts/authContext';
import { showTopToast } from '@/utils/helpers';

const Signup = () => {
  const { setToken } = useAuth();

  const { mutate: signUp, isPending } = useMutation({
    mutationKey: ['signup'],
    mutationFn: registerUser,
    onSuccess: async (data) => {
      setToken(data.token);
      navigate('otpverification', { context: 'signup', email: null });
    },
    onError: (error: ApiError) => {
      showTopToast({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    },
  });

  // Render signup form
};
```

### Example: Forgot Password
In `app/forgetpassword.tsx`:

```tsx
import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '@/utils/mutations/authMutations';
import { showTopToast } from '@/utils/helpers';

const ForgotPassword = () => {
  const { mutate: handleForgotPassword, isPending: forgotPasswordPending } = useMutation({
    mutationKey: ['forgot-password'],
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      navigate('otpverification', { context: 'forgot-password', email: data.data.email });
    },
    onError: (error: ApiError) => {
      showTopToast({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    },
  });

  // Render forgot password form
};
```

## 5. Handle API Responses
Handle the API responses and errors appropriately in your components.

```tsx
const Signin = () => {
  const { setToken, setUserData } = useAuth();
  const { mutate: handleLogin, isPending: loginPending } = useMutation({
    mutationFn: loginUser,
    mutationKey: ['login'],
    onSuccess: async (data) => {
      const { token, data: userData } = data;
      setToken(token);
      setUserData(userData);
      await SecureStore.setItemAsync('USER_TOKEN', token);
      await SecureStore.setItemAsync('USER_DATA', JSON.stringify(userData));
      navigate('(tabs)');
    },
    onError: (error: ApiError) => {
      showTopToast({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    },
  });

  if (loginPending) {
    return <ActivityIndicator />;
  }

  // Render login form
};
```

## 6. Secure API Calls
Ensure that sensitive data like tokens are securely managed. Use context providers to manage authentication tokens.

### Example: Auth Context
In `contexts/authContext.tsx`:

```tsx
import React, { createContext, useContext, useReducer } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setToken = async (token) => {
    await SecureStore.setItemAsync('authToken', token);
    dispatch({ type: 'SET_TOKEN', payload: token });
  };

  const setUserData = (userData) => {
    dispatch({ type: 'SET_USER_DATA', payload: userData });
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('authToken');
    dispatch({ type: 'LOGOUT' });
    navigate('/signin');
  };

  return (
    <AuthContext.Provider value={{ ...state, setToken, setUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## 7. Maintain User Session
To maintain the user session, check for the token in `SecureStore` when the app starts.

### Example: App Initialization
In `app/_layout.tsx`:

```tsx
import React, { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@/contexts/authContext';

const AppLayout = ({ children }) => {
  const { setToken, setUserData } = useAuth();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = await SecureStore.getItemAsync('authToken');
      const userData = await SecureStore.getItemAsync('USER_DATA');
      if (token && userData) {
        setToken(token);
        setUserData(JSON.parse(userData));
        navigate('(tabs)');
      } else {
        navigate('/signin');
      }
    };

    initializeAuth();
  }, []);

  return <>{children}</>;
};

export default AppLayout;
```

## Conclusion
By following these steps, you can handle authentication in your project effectively. Ensure to handle errors and loading states appropriately in your components. To maintain user sessions, store tokens securely and check for them when the app starts.
