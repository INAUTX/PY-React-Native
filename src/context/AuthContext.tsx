import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { User } from '../types/auth';

interface AuthContextProps {
  userToken: string | null;
  user: User | null;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (token: string, user: User) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  userToken: null,
  user: null,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const signIn = async (token: string, userData: User) => {
    try {
      await AsyncStorage.setItem('token', token);
      setUserToken(token);
      setUser(userData);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el token');
    }
  };

  const signUp = async (token: string, userData: User) => {
    try {
      await AsyncStorage.setItem('token', token);
      setUserToken(token);
      setUser(userData);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el token');
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUserToken(null);
      setUser(null);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar sesión');
    }
  };

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setUserToken(token);
        // Opcionalmente, podrías verificar la validez del token con el backend
      }
    } catch (error) {
      console.log('Error al obtener el token', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, user, signIn, signOut, signUp }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
