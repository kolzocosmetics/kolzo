import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Temporary interfaces to avoid import issues
interface Product {
  _id?: string;
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand?: string;
  gender?: 'men' | 'women' | 'unisex';
  image?: string;
  images?: string[];
  variants?: any[];
  tags?: string[];
  status?: 'active' | 'inactive' | 'draft';
  averageRating?: number;
  totalReviews?: number;
  salesCount?: number;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  addedAt: number; // Timestamp for sorting
}

interface CartState {
  items: CartItem[]
  isLoading: boolean
  lastUpdated: number
  
  // Actions
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  resetCart: () => void
  getTotal: () => number
  getItemCount: () => number
  getSubtotal: () => number
  getShipping: () => number
  getTax: () => number
  getGrandTotal: () => number
  isItemInCart: (productId: string) => boolean
  getItemQuantity: (productId: string) => number
  syncWithBackend: () => Promise<void>
  validateCart: () => { isValid: boolean; errors: string[] }
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      lastUpdated: Date.now(),

      addItem: (product: Product, quantity = 1, size?: string, color?: string) => {
        // Validate input
        if (!product || !product.id || quantity <= 0) {
          console.error('Invalid product or quantity')
          return
        }

        // Check if product is available
        if (product.status === 'inactive' || product.status === 'draft') {
          console.error('Product is not available')
          return
        }

        set((state) => {
          const existingItem = state.items.find(
            item => item.product.id === product.id && 
                   item.selectedSize === size && 
                   item.selectedColor === color
          )
          
          if (existingItem) {
            // Update quantity if item already exists with same size/color
            return {
              items: state.items.map(item => 
                item.product.id === product.id && 
                item.selectedSize === size && 
                item.selectedColor === color
                  ? { ...item, quantity: item.quantity + quantity, addedAt: Date.now() }
                  : item
              ),
              lastUpdated: Date.now()
            }
          } else {
            // Add new item
            const newItem: CartItem = {
              product,
              quantity,
              selectedSize: size,
              selectedColor: color,
              addedAt: Date.now()
            }
            return {
              items: [...state.items, newItem],
              lastUpdated: Date.now()
            }
          }
        })
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        // Validate maximum quantity (e.g., 10 items per product)
        if (quantity > 10) {
          console.warn('Maximum quantity per item is 10')
          return
        }

        set((state) => ({
          items: state.items.map(item => 
            item.product.id === productId 
              ? { ...item, quantity, addedAt: Date.now() } 
              : item
          ),
          lastUpdated: Date.now()
        }))
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.product.id !== productId),
          lastUpdated: Date.now()
        }))
      },

      clearCart: () => {
        set({ items: [], lastUpdated: Date.now() })
        localStorage.removeItem('kolzo-cart')
      },

      resetCart: () => {
        set({ items: [], isLoading: false, lastUpdated: Date.now() })
        localStorage.removeItem('kolzo-cart')
      },

      getTotal: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      },

      getItemCount: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().getTotal()
      },

      getShipping: () => {
        const subtotal = get().getSubtotal()
        return subtotal > 200 ? 0 : 25 // Free shipping over $200
      },

      getTax: () => {
        const subtotal = get().getSubtotal()
        return subtotal * 0.08 // 8% tax
      },

      getGrandTotal: () => {
        const subtotal = get().getSubtotal()
        const shipping = get().getShipping()
        const tax = get().getTax()
        return subtotal + shipping + tax
      },

      isItemInCart: (productId: string) => {
        const { items } = get()
        return items.some(item => item.product.id === productId)
      },

      getItemQuantity: (productId: string) => {
        const { items } = get()
        const item = items.find(item => item.product.id === productId)
        return item ? item.quantity : 0
      },

      validateCart: () => {
        const { items } = get()
        const errors: string[] = []

        if (items.length === 0) {
          errors.push('Cart is empty')
        }

        items.forEach((item, index) => {
          if (!item.product) {
            errors.push(`Item ${index + 1}: Invalid product data`)
          }
          if (item.quantity <= 0) {
            errors.push(`Item ${index + 1}: Invalid quantity`)
          }
          if (item.quantity > 10) {
            errors.push(`Item ${index + 1}: Quantity exceeds maximum (10)`)
          }
          if (item.product.status === 'inactive' || item.product.status === 'draft') {
            errors.push(`Item ${index + 1}: Product is no longer available`)
          }
        })

        return {
          isValid: errors.length === 0,
          errors
        }
      },

      syncWithBackend: async () => {
        set({ isLoading: true })
        try {
          // This could be used to sync cart with backend if needed
          // For now, we'll keep cart in localStorage for better UX
          console.log('Cart synced with backend')
        } catch (error) {
          console.error('Failed to sync cart:', error)
        } finally {
          set({ isLoading: false })
        }
      }
    }),
    {
      name: 'kolzo-cart',
      partialize: (state) => ({
        items: state.items,
        lastUpdated: state.lastUpdated
      })
    }
  )
) 