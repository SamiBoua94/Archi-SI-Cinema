import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { CinemaProfile } from '../lib/types';
import * as api from '../lib/api';

type AuthContextType = {
  cinema: CinemaProfile | null;
  isAuthenticated: boolean;
  login: (login: string, motDePasse: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [cinema, setCinema] = useState<CinemaProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const cinemaProfile = await api.fetchData<CinemaProfile>('/api/auth/cinema');
        setCinema(cinemaProfile);
        setIsAuthenticated(true);
      } catch (error) {
        // Utilisateur non connecté, c'est normal
        console.log('User not authenticated on load');
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (login: string, motDePasse: string) => {
    try {
      const { cinema } = await api.postData<{ login: string; motDePasse: string }, { cinema: CinemaProfile; message: string }>(
        '/api/auth/login',
        { login, motDePasse }
      );

      setCinema(cinema);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.postData('/api/auth/logout', {});
      setCinema(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ cinema, isAuthenticated, login, logout }}>
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

export default useAuth;