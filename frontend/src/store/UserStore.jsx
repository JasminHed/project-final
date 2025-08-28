import { create } from "zustand";
import { persist } from "zustand/middleware";

// creates a persistent user store that tracks login status, user info, token, user ID + actions to update or validate
export const useUserStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: !!localStorage.getItem("accessToken"),
      user: { name: "", email: "" },
      token: localStorage.getItem("accessToken") || null,
      userId: localStorage.getItem("userId") || null,

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

      //logs in a user by saving their info, token, and login time to localStorage + updates store
      login: (userData, token, userId) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("accessToken", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("loginTime", Date.now());

        set({
          isLoggedIn: true,
          user: userData,
          token,
          userId,
        });
      },

      //automatically logs out the user if 12 hours have passed since login
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
      name: "user-storage",
    }
  )
);
