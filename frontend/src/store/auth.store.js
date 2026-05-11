import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken) => set({
        user,
        accessToken,
        isAuthenticated: true
      }),

      clearAuth: () => set({
        user: null,
        accessToken: null,
        isAuthenticated: false
      }),

      updateUser: (partialUser) => set((state) => ({
        user: state.user ? { ...state.user, ...partialUser } : null
      })),

      setAccessToken: (accessToken) => set({ accessToken })
    }),
    {
      name: 'postagent-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

export default useAuthStore
