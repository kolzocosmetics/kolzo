import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Temporary User interface to avoid import issues
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
  addresses: any[];
  preferences: any;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  lastLoginAttempt: number
  loginAttempts: number
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  checkAuth: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
  validateEmail: (email: string) => boolean
  validatePassword: (password: string) => { isValid: boolean; errors: string[] }
  isRateLimited: () => boolean
  resetLoginAttempts: () => void
}

// Email validation
const validateEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation
const validatePasswordStrength = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      lastLoginAttempt: 0,
      loginAttempts: 0,

      login: async (email: string, _password: string) => {
        // Validate email format
        if (!get().validateEmail(email)) {
          throw new Error('Please enter a valid email address')
        }

        // Check rate limiting
        if (get().isRateLimited()) {
          throw new Error('Too many login attempts. Please try again later.')
        }

        set({ isLoading: true, error: null })
        
        try {
          // Update login attempts
          const currentTime = Date.now()
          const { lastLoginAttempt, loginAttempts } = get()
          
          // Reset attempts if more than 15 minutes have passed
          if (currentTime - lastLoginAttempt > 15 * 60 * 1000) {
            set({ loginAttempts: 1, lastLoginAttempt: currentTime })
          } else {
            set({ 
              loginAttempts: loginAttempts + 1, 
              lastLoginAttempt: currentTime 
            })
          }

          // Temporarily disabled API call
          // const { user, token } = await api.login(email, password)
          
          // Mock response for now
          const user = { 
            _id: '1', 
            name: 'Test User', 
            email, 
            role: 'user' as const, 
            addresses: [], 
            preferences: {}, 
            createdAt: new Date().toISOString(), 
            updatedAt: new Date().toISOString() 
          }
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            loginAttempts: 0 // Reset on successful login
          })
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed'
          })
          throw error
        }
      },

      signup: async (name: string, email: string, password: string) => {
        // Validate inputs
        if (!name.trim()) {
          throw new Error('Name is required')
        }

        if (!get().validateEmail(email)) {
          throw new Error('Please enter a valid email address')
        }

        const passwordValidation = get().validatePassword(password)
        if (!passwordValidation.isValid) {
          throw new Error(passwordValidation.errors.join(', '))
        }

        set({ isLoading: true, error: null })
        
        try {
          // Temporarily disabled API call
          // const { user, token } = await api.signup(name, email, password)
          
          // Mock response for now
          const user = { 
            _id: '1', 
            name, 
            email, 
            role: 'user' as const, 
            addresses: [], 
            preferences: {}, 
            createdAt: new Date().toISOString(), 
            updatedAt: new Date().toISOString() 
          }
          
          set({
            user,
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

      logout: async () => {
        set({ isLoading: true })
        
        try {
          // Temporarily disabled API call
          // await api.logout()
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          })
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('kolzo-token')
        if (!token) {
          set({ isAuthenticated: false, user: null })
          return
        }

        try {
          // Temporarily disabled API call
          // const user = await api.getCurrentUser()
          
          // Mock response for now
          const user = { 
            _id: '1', 
            name: 'Test User', 
            email: 'test@example.com', 
            role: 'user' as const, 
            addresses: [], 
            preferences: {}, 
            createdAt: new Date().toISOString(), 
            updatedAt: new Date().toISOString() 
          }
          
          set({
            user,
            isAuthenticated: true,
            error: null
          })
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            error: null
          })
        }
      },

      updateProfile: async (updates: Partial<User>) => {
        const { user } = get()
        if (!user) {
          throw new Error('User not authenticated')
        }

        set({ isLoading: true })
        
        try {
          // Temporarily disabled API call
          // const updatedUser = await api.updateProfile(updates)
          
          // Mock response for now
          const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() }
          
          set({
            user: updatedUser,
            isLoading: false,
            error: null
          })
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Profile update failed'
          })
          throw error
        }
      },

      validateEmail: (email: string): boolean => {
        return validateEmailFormat(email)
      },

      validatePassword: (password: string): { isValid: boolean; errors: string[] } => {
        return validatePasswordStrength(password)
      },

      isRateLimited: (): boolean => {
        const { loginAttempts, lastLoginAttempt } = get()
        const currentTime = Date.now()
        
        // Allow 5 attempts per 15 minutes
        if (loginAttempts >= 5 && (currentTime - lastLoginAttempt) < 15 * 60 * 1000) {
          return true
        }
        
        return false
      },

      resetLoginAttempts: () => {
        set({ loginAttempts: 0, lastLoginAttempt: 0 })
      },

      clearError: () => {
        set({ error: null })
      }
    }),
    {
      name: 'kolzo-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        lastLoginAttempt: state.lastLoginAttempt,
        loginAttempts: state.loginAttempts
      })
    }
  )
) 