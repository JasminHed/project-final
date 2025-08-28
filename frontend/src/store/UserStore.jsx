import { create } from "zustand";
import { persist } from "zustand/middleware";

// Used for signup and login authorization logic
export const useUserStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: !!localStorage.getItem("accessToken"),
      user: { name: "", email: "" },
      token: localStorage.getItem("accessToken") || null,
      userId: localStorage.getItem("userId") || null,

      // Actions
      setIsLoggedIn: (value) => set({ isLoggedIn: value }),
      setUser: (userData) => set({ user: userData }),
      setToken: (token) => set({ token }),
      setUserId: (id) => set({ userId: id }),

      validateToken: async () => {
        const token = get().token;
        if (!token) return false;

        try {
          const response = await fetch("/users/me", {
            headers: { Authorization: token },
          });

          if (!response.ok) {
            get().logout();
            return false;
          }
          return true;
        } catch {
          get().logout();
          return false;
        }
      },

      login: (userData, token, userId) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("accessToken", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("loginTime", Date.now()); //when did user log in

        set({
          isLoggedIn: true,
          user: userData,
          token,
          userId,
        });
      },

      //checks if 12 hours has passed after log in, log out automatically (only frontend localstorage)
      checkLoginTimeout: () => {
        const loginTime = localStorage.getItem("loginTime");
        if (loginTime && Date.now() - loginTime > 12 * 60 * 60 * 1000) {
          get().logout();
          return false;
        }
        return true;
      },

      logout: () => {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("loginTime");

        set({
          isLoggedIn: false,
          user: { name: "", email: "" },
          token: null,
          userId: null,
        });
      },
    }),
    {
      name: "user-storage", // localStorage key
    }
  )
);
