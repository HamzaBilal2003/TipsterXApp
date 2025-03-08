
# API Integration Guide

## 1. Define API Endpoints
All API endpoints are defined in `utils/apiConfig.ts`. This file exports constants for the base URL and various endpoints.

```ts
export const API_BASE_URL = 'https://46.202.154.203';
export const API_DOMAIN = API_BASE_URL + '/api';

export const API_ENDPOINTS = {
  AUTH: {
    Login: API_DOMAIN + '/public/login',
    Register: API_DOMAIN + '/auth/customer/register',
    // ... other endpoints
  },
  CHATS: {
    GetAllChats: API_DOMAIN + '/customer/get-all-chats',
    GetChatDetails: API_DOMAIN + '/customer/get-chat',
    SendMessage: API_DOMAIN + '/customer/send-message',
  },
  // ... other categories
};
```

## 2. Create API Call Function
The `apiCall` function is defined in `utils/customApiCalls.ts`. This function handles making HTTP requests to the API.

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
Create functions to call specific API endpoints. These functions are defined in various files under the `utils/queries` and `utils/mutations` directories.

### Example: Chat Queries
In `utils/queries/chatQueries.ts`:

```ts
import { apiCall } from '../customApiCalls';
import { API_ENDPOINTS } from '../apiConfig';

export const getAllChats = async (token: string) => {
  return await apiCall(API_ENDPOINTS.CHATS.GetAllChats, 'GET', undefined, token);
};

export const getChatDetails = async (chatId: string, token: string) => {
  return await apiCall(API_ENDPOINTS.CHATS.GetChatDetails + '/' + chatId, 'GET', undefined, token);
};
```

### Example: Auth Mutations
In `utils/mutations/authMutations.ts`:

```ts
import { apiCall } from '../customApiCalls';
import { API_ENDPOINTS } from '../apiConfig';

export const loginUser = async (data: { email: string; password: string }) => {
  return await apiCall(API_ENDPOINTS.AUTH.Login, 'POST', data);
};

export const registerUser = async (data: IRegisterReq) => {
  return await apiCall(API_ENDPOINTS.AUTH.Register, 'POST', data);
};
```

## 4. Use API Functions in Components
Import and use these API functions in your React components. Use hooks like `useQuery` and `useMutation` from `@tanstack/react-query` to manage API calls.

### Example: Using `getAllChats` in a Component
In `app/(tabs)/chat.tsx`:

```tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllChats } from '@/utils/queries/chatQueries';
import { useAuth } from '@/contexts/authContext';

const Chat = () => {
  const { token } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: chatData, isLoading, error } = useQuery({
    queryKey: ['allchats'],
    queryFn: () => getAllChats(token),
    refetchInterval: 1000,
  });

  // Render chat data
};
```

## 5. Handle API Responses
Handle the API responses and errors appropriately in your components.

```tsx
const Chat = () => {
  const { token } = useAuth();
  const { data: chatData, isLoading, error } = useQuery({
    queryKey: ['allchats'],
    queryFn: () => getAllChats(token),
    refetchInterval: 1000,
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error loading chats</Text>;
  }

  return (
    <FlatList
      data={chatData}
      renderItem={({ item }) => <ChatItem chat={item} />}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};
```

## 6. Secure API Calls
Ensure that sensitive data like tokens are securely managed. Use context providers to manage authentication tokens.

### Example: Auth Context
In `contexts/authContext.tsx`:

```tsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

## Conclusion
By following these steps, you can integrate the API into your project effectively. Ensure to handle errors and loading states appropriately in your components.
