import { create } from "zustand";
import { persist } from "zustand/middleware";

// Used for signup and login authorization logic
export const useUserStore = create(
  persist(
    (set) => ({
      isLoggedIn: !!localStorage.getItem("accessToken"),
      user: { name: "", email: "" },
      token: localStorage.getItem("accessToken") || null,
      userId: localStorage.getItem("userId") || null,

      // Actions
      setIsLoggedIn: (value) => set({ isLoggedIn: value }),
      setUser: (userData) => set({ user: userData }),
      setToken: (token) => set({ token }),
      setUserId: (id) => set({ userId: id }),

      login: (userData, token, userId) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("accessToken", token);
        localStorage.setItem("userId", userId);

        set({
          isLoggedIn: true,
          user: userData,
          token,
          userId,
        });
      },

      logout: () => {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");

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

/*dubbelkolla detta, ta bort som localstorage, // Ta bort dessa från initial state:
isLoggedIn: !!localStorage.getItem("accessToken"), // ❌
token: localStorage.getItem("accessToken") || null, // ❌  
userId: localStorage.getItem("userId") || null, // ❌

// Ta bort alla localStorage anrop från login():
localStorage.setItem("user", JSON.stringify(userData)); // ❌
localStorage.setItem("accessToken", token); // ❌
localStorage.setItem("userId", userId); // ❌

// Ta bort alla localStorage anrop från logout():
localStorage.removeItem("user"); // ❌
localStorage.removeItem("accessToken"); // ❌
localStorage.removeItem("userId"); // 
*/

/*export const useUserStore = create(
  persist(
    (set) => ({
      isLoggedIn: false, // Enkel initial state
      user: { name: "", email: "" },
      token: null,
      userId: null,

      // Actions
      setIsLoggedIn: (value) => set({ isLoggedIn: value }),
      setUser: (userData) => set({ user: userData }),
      setToken: (token) => set({ token }),
      setUserId: (id) => set({ userId: id }),

      login: (userData, token, userId) => {
        set({
          isLoggedIn: true,
          user: userData,
          token,
          userId,
        });
      },

      logout: () => {
        set({
          isLoggedIn: false,
          user: { name: "", email: "" },
          token: null,
          userId: null,
        });
      },
    }),
    {
      name: "user-storage", // persist middleware hanterar localStorage
    }
  )
); */
