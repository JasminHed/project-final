import { create } from "zustand";

//Used for signup and log in authorozation logic
export const useUserStore = create((set) => ({
  isLoggedIn: !!localStorage.getItem("accessToken"),
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
