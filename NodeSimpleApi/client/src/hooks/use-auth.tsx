import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { Cinema, LoginCinema } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type CinemaWithoutPassword = Omit<Cinema, 'mot_de_passe'>;

type AuthContextType = {
  cinema: CinemaWithoutPassword | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<{ token: string, cinema: CinemaWithoutPassword }, Error, LoginCinema>;
  logoutMutation: UseMutationResult<void, Error, void>;
};

type AuthResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    cinema: CinemaWithoutPassword;
  };
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  const {
    data: authData,
    error,
    isLoading,
  } = useQuery<{ cinema: CinemaWithoutPassword } | null, Error>({
    queryKey: ["/api/auth/verify"],
    queryFn: async ({ queryKey }) => {
      try {
        const res = await fetch(queryKey[0] as string, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
          credentials: "include",
        });
        
        if (res.status === 401) {
          return null;
        }
        
        if (!res.ok) {
          throw new Error(`${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        return data.data;
      } catch (err) {
        return null;
      }
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCinema) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      const data = await res.json() as AuthResponse;
      
      // Store token in localStorage
      localStorage.setItem('auth_token', data.data.token);
      
      return data.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Login successful",
        description: `Welcome, ${data.cinema.nom}!`,
      });
      
      // Update auth state
      queryClient.setQueryData(["/api/auth/verify"], { cinema: data.cinema });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Remove token from localStorage
      localStorage.removeItem('auth_token');
    },
    onSuccess: () => {
      // Clear auth state
      queryClient.setQueryData(["/api/auth/verify"], null);
      
      toast({
        title: "Logout successful",
        description: "You have been logged out successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        cinema: authData?.cinema || null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
