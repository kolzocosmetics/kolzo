import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  size?: string
  color?: string
}

interface CartState {
  items: CartItem[]
  isLoading: boolean
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(i => i.id === item.id)
          
          if (existingItem) {
            // Update quantity if item already exists
            return {
              items: state.items.map(i => 
                i.id === item.id 
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              )
            }
          } else {
            // Add new item
            return {
              items: [...state.items, { ...item, quantity: 1 }]
            }
          }
        })
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(item => item.id !== id)
            }
          }
          
          return {
            items: state.items.map(item => 
              item.id === id ? { ...item, quantity } : item
            )
          }
        })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotal: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      },

      getItemCount: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.quantity, 0)
      }
    }),
    {
      name: 'kolzo-cart',
      partialize: (state) => ({
        items: state.items
      })
    }
  )
) 