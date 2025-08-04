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

interface WishlistItem {
  _id: string;
  product: Product;
  addedAt: string;
  notes?: string;
}

interface WishlistState {
  items: WishlistItem[]
  isLoading: boolean
  lastUpdated: number
  
  // Actions
  fetchWishlist: () => Promise<void>
  addItem: (product: Product, notes?: string) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  clearWishlist: () => Promise<void>
  isInWishlist: (productId: string) => boolean
  getItemCount: () => number
  getWishlistTotal: () => number
  getWishlistByCategory: (category: string) => WishlistItem[]
  getWishlistByGender: (gender: string) => WishlistItem[]
  updateItemNotes: (productId: string, notes: string) => void
  moveToCart: (productId: string) => void
  validateWishlist: () => { isValid: boolean; errors: string[] }
  migrateWishlistData: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      lastUpdated: Date.now(),

      // Migration function to clean up old wishlist data
      migrateWishlistData: () => {
        const { items } = get()
        // Filter out any items that don't have proper product data
        const validItems = items.filter(item => 
          item.product && 
          item.product.id && 
          item.product.name && 
          typeof item.product.price === 'number' &&
          item.product.status !== 'inactive' &&
          item.product.status !== 'draft'
        )
        
        if (validItems.length !== items.length) {
          console.log('Migrating wishlist data: removing invalid items')
          set({ items: validItems, lastUpdated: Date.now() })
        }
      },

      fetchWishlist: async () => {
        set({ isLoading: true })
        try {
          // const items = await api.getWishlist() // Mock data
          // set({ items, isLoading: false })
          console.log('Fetching wishlist (mock data)')
          set({ isLoading: false })
        } catch (error) {
          console.error('Failed to fetch wishlist:', error)
          set({ isLoading: false })
        }
      },

      addItem: async (product: Product, notes?: string) => {
        // Validate input
        if (!product || !product.id || !product.name) {
          console.error('Invalid product data')
          throw new Error('Invalid product data')
        }

        // Check if product is available
        if (product.status === 'inactive' || product.status === 'draft') {
          console.error('Product is not available')
          throw new Error('Product is not available')
        }

        // Check wishlist size limit (e.g., 50 items)
        const { items } = get()
        if (items.length >= 50) {
          console.error('Wishlist is full (maximum 50 items)')
          throw new Error('Wishlist is full (maximum 50 items)')
        }

        set({ isLoading: true })
        try {
          // Check if product is already in wishlist
          const existingItem = items.find(item => item.product.id === product.id)
          
          if (existingItem) {
            console.log('Product already in wishlist')
            set({ isLoading: false })
            return
          }
          
          const newItem: WishlistItem = {
            _id: `wishlist-${Date.now()}`,
            product: { 
              ...product,
              // Ensure all required properties are present
              id: product.id,
              name: product.name,
              price: typeof product.price === 'number' ? product.price : 0,
              category: product.category,
              description: product.description,
              image: product.image
            },
            addedAt: new Date().toISOString(),
            notes
          }
          
          set((state) => ({
            items: [...state.items, newItem],
            isLoading: false,
            lastUpdated: Date.now()
          }))
          
          console.log(`Added ${product.name} to wishlist with price: ${product.price}`)
        } catch (error) {
          console.error('Failed to add to wishlist:', error)
          set({ isLoading: false })
          throw error
        }
      },

      removeItem: async (productId: string) => {
        set({ isLoading: true })
        try {
          set((state) => ({
            items: state.items.filter(item => item.product.id !== productId),
            isLoading: false,
            lastUpdated: Date.now()
          }))
          console.log(`Removed item from wishlist: ${productId}`)
        } catch (error) {
          console.error('Failed to remove from wishlist:', error)
          set({ isLoading: false })
          throw error
        }
      },

      clearWishlist: async () => {
        set({ isLoading: true })
        try {
          // Clear all items one by one (backend doesn't have bulk delete)
          const { items } = get()
          for (const item of items) {
            // await api.removeFromWishlist(item.product._id) // Mock data
            console.log(`Clearing item from wishlist (mock data): ${item.product._id}`)
          }
          set({ items: [], isLoading: false, lastUpdated: Date.now() })
        } catch (error) {
          console.error('Failed to clear wishlist:', error)
          set({ isLoading: false })
          throw error
        }
      },

      isInWishlist: (productId: string) => {
        const { items } = get()
        return items.some(item => item.product.id === productId)
      },

      getItemCount: () => {
        const { items } = get()
        return items.length
      },

      getWishlistTotal: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.product.price, 0)
      },

      getWishlistByCategory: (category: string) => {
        const { items } = get()
        return items.filter(item => 
          item.product.category.toLowerCase() === category.toLowerCase()
        )
      },

      getWishlistByGender: (gender: string) => {
        const { items } = get()
        return items.filter(item => 
          item.product.gender === gender || 
          item.product.gender === 'unisex'
        )
      },

      updateItemNotes: (productId: string, notes: string) => {
        set((state) => ({
          items: state.items.map(item => 
            item.product.id === productId 
              ? { ...item, notes }
              : item
          ),
          lastUpdated: Date.now()
        }))
      },

      moveToCart: (productId: string) => {
        const { items } = get()
        const item = items.find(item => item.product.id === productId)
        
        if (item) {
          // Import cart store dynamically to avoid circular dependency
          import('./cartStore').then(({ useCartStore }) => {
            const { addItem } = useCartStore.getState()
            addItem(item.product, 1)
            
            // Remove from wishlist
            get().removeItem(productId)
          })
        }
      },

      validateWishlist: () => {
        const { items } = get()
        const errors: string[] = []

        items.forEach((item, index) => {
          if (!item.product) {
            errors.push(`Item ${index + 1}: Invalid product data`)
          }
          if (!item.product.id || !item.product.name) {
            errors.push(`Item ${index + 1}: Missing required product information`)
          }
          if (typeof item.product.price !== 'number' || item.product.price < 0) {
            errors.push(`Item ${index + 1}: Invalid product price`)
          }
          if (item.product.status === 'inactive' || item.product.status === 'draft') {
            errors.push(`Item ${index + 1}: Product is no longer available`)
          }
        })

        return {
          isValid: errors.length === 0,
          errors
        }
      }
    }),
    {
      name: 'kolzo-wishlist',
      partialize: (state) => ({
        items: state.items,
        lastUpdated: state.lastUpdated
      })
    }
  )
) 