import { create } from "zustand";

export const useUserStore = create((set) => ({
  // State
  isLoggedIn: false,
  user: { name: "", email: "" },

  // Actions
  setIsLoggedIn: (value) => set({ isLoggedIn: value }),

  setUser: (userData) => set({ user: userData }),

  login: (userData, token, userId) =>
    set({
      isLoggedIn: true,
      user: userData,
    }),

  logout: () =>
    set({
      isLoggedIn: false,
      user: { name: "", email: "" },
    }),
}));
