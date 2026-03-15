import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "parent" | "admin";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  setAuth: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    set({ user: null, token: null, isAuthenticated: false });
  },

  setLoading: isLoading => set({ isLoading }),
}));
