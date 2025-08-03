import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

// Mock user database (in real app, this would be an API)
const mockUsers: { [email: string]: { password: string; user: User } } = {
  'demo@kolzo.com': {
    password: 'demo123',
    user: {
      id: '1',
      email: 'demo@kolzo.com',
      name: 'Demo User',
      createdAt: '2025-01-01T00:00:00Z'
    }
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const userData = mockUsers[email]
          
          if (!userData || userData.password !== password) {
            throw new Error('Invalid email or password')
          }
          
          set({
            user: userData.user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed'
          })
          throw error
        }
      },

      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null })
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          if (mockUsers[email]) {
            throw new Error('User already exists')
          }
          
          const newUser: User = {
            id: Date.now().toString(),
            email,
            name,
            createdAt: new Date().toISOString()
          }
          
          // In real app, this would be an API call
          mockUsers[email] = {
            password,
            user: newUser
          }
          
          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Signup failed'
          })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null
        })
      },

      clearError: () => {
        set({ error: null })
      }
    }),
    {
      name: 'kolzo-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
) 