import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
}

interface WishlistState {
  items: WishlistItem[]
  isLoading: boolean
  
  // Actions
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  clearWishlist: () => void
  isInWishlist: (id: string) => boolean
  getItemCount: () => number
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(i => i.id === item.id)
          
          if (!existingItem) {
            return {
              items: [...state.items, item]
            }
          }
          
          return state
        })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }))
      },

      clearWishlist: () => {
        set({ items: [] })
      },

      isInWishlist: (id) => {
        const { items } = get()
        return items.some(item => item.id === id)
      },

      getItemCount: () => {
        const { items } = get()
        return items.length
      }
    }),
    {
      name: 'kolzo-wishlist',
      partialize: (state) => ({
        items: state.items
      })
    }
  )
) 