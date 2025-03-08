import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'; import * as SecureStore from 'expo-secure-store'; import { router } from 'expo-router';
import ErrorComponent from './ErrorComponent';

export interface KycStateTwo { id: number; userId: number; bvn: string; surName: string; firtName: string; dob?: string; status?: string; state: string; }

interface UserData {
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
}

interface AuthContextType {
  token: string;
  userData: UserData | null;
  setToken: (token: string) => Promise<void>;
  setUserData: (userData: UserData | null) => void;
  logout: () => Promise<void>;
}

interface AuthState { token: string; userData: AuthContextType['userData']; }

type AuthAction = | { type: 'SET_TOKEN'; payload: string } | { type: 'SET_USER_DATA'; payload: AuthContextType['userData'] } | { type: 'LOGOUT' };

const initialState: AuthState = { token: '', userData: null, };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_USER_DATA':
      return { ...state, userData: action.payload };
    case 'LOGOUT':
      return { ...initialState };
    default:
      throw new Error(`Unhandled action type: ${(action as any).type}`);
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const token = await SecureStore.getItemAsync('authToken');
        const userData = await SecureStore.getItemAsync('USER_DATA');

        if (token && userData) {
          dispatch({ type: 'SET_TOKEN', payload: token });
          dispatch({ type: 'SET_USER_DATA', payload: JSON.parse(userData) });
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
      }
    };
    loadAuthData();
  }, []);

  const setToken = async (token: string) => {
    try {
      await SecureStore.setItemAsync('authToken', token);
      dispatch({ type: 'SET_TOKEN', payload: token });
    } catch (error) {
      console.error('Error setting token:', error);
    }
  };

  const setUserData = (userData: AuthContextType['userData']) => {
    try {
      dispatch({ type: 'SET_USER_DATA', payload: userData });
    } catch (error) {
      console.error('Error setting user data:', error);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('USER_DATA');
      dispatch({ type: 'LOGOUT' });
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, setToken, setUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};