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
  initializeFromStorage: () => void;
}

export const useAuthStore = create<AuthState>(set => {
  // Initialize from localStorage if available
  const getInitialState = () => {
    if (typeof window === "undefined") {
      return { user: null, token: null, isAuthenticated: false };
    }
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        return { user, token, isAuthenticated: true };
      } catch {
        return { user: null, token: null, isAuthenticated: false };
      }
    }
    return { user: null, token: null, isAuthenticated: false };
  };

  const initialState = getInitialState();

  return {
    ...initialState,
    isLoading: false,

    setAuth: (user, token) => {
      if (typeof window !== "undefined") {
        console.log("[Zustand] setAuth called with user role:", user.role);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        console.log("[Zustand] Saved to localStorage - user role:", user.role);
        console.log(
          "[Zustand] Verify localStorage user:",
          localStorage.getItem("user"),
        );
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

    initializeFromStorage: () => {
      const initialState = getInitialState();
      set(initialState);
    },
  };
});
