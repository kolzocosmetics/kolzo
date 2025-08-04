import { create } from 'zustand'
// import api from '../utils/api' // Temporarily disabled

// Import local product data
import productsData from '../data/products.json'
import productsDataF from '../data/products-f.json'
import productsDataM from '../data/products-m.json'

// Temporary Product interface to avoid import issues
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

interface ProductState {
  products: Product[]
  featuredProducts: Product[]
  recommendedProducts: Product[]
  categories: string[]
  brands: string[]
  currentProduct: Product | null
  isLoading: boolean
  error: string | null
  pagination: {
    page: number
    total: number
    pages: number
    limit: number
  }
  
  // Actions
  fetchProducts: (params?: {
    page?: number
    limit?: number
    category?: string
    brand?: string
    minPrice?: number
    maxPrice?: number
    sort?: string
    search?: string
    gender?: 'men' | 'women'
  }) => Promise<void>
  fetchFeaturedProducts: () => Promise<void>
  fetchProduct: (id: string) => Promise<void>
  fetchCategories: () => Promise<void>
  fetchBrands: () => Promise<void>
  searchProducts: (query: string) => Promise<void>
  getRecommendedProducts: (currentProduct?: Product, searchQuery?: string) => Promise<void>
  clearError: () => void
}

export const useProductStore = create<ProductState>((set, _get) => ({
  products: [],
  featuredProducts: [],
  recommendedProducts: [],
  categories: [],
  brands: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    total: 0,
    pages: 0,
    limit: 12
  },

  fetchProducts: async (params = {}) => {
    set({ isLoading: true, error: null })
    
    try {
      // Use local data instead of API call
      let allProducts: Product[] = []
      
      // Get products based on gender parameter (only from products-f.json and products-m.json)
      if (params.gender === 'women') {
        allProducts = [
          ...Object.values(productsDataF).flat()
        ]
      } else if (params.gender === 'men') {
        allProducts = [
          ...Object.values(productsDataM).flat()
        ]
      } else {
        // Combine all products if no gender specified
        allProducts = [
          ...Object.values(productsDataF).flat(),
          ...Object.values(productsDataM).flat()
        ]
      }
      
      // Debug: Log the first product to see its structure
      if (allProducts.length > 0) {
        console.log('First product structure:', allProducts[0])
        console.log('First product price:', allProducts[0].price)
      }
      
      // No deduplication needed since we're only using products-f.json and products-m.json
      
      // Filter by category if specified
      if (params.category) {
        allProducts = allProducts.filter(product => 
          product.category.toLowerCase().includes(params.category!.toLowerCase())
        )
      }
      
      // Filter by search query if specified
      if (params.search) {
        const searchLower = params.search.toLowerCase()
        
        // Search term to product ID mapping
        const searchTermToProductIds: { [key: string]: string[] } = {
          // Lipstick variations
          'lipstick': ['lipstick-001', 'lipstick-002'],
          'lip stick': ['lipstick-001', 'lipstick-002'],
          'lip-stick': ['lipstick-001', 'lipstick-002'],
          'lip': ['lipstick-001', 'lipstick-002'],
          
          // Handbag variations
          'handbag': ['handbag-001', 'handbag-002'],
          'hand bag': ['handbag-001', 'handbag-002'],
          'hand-bag': ['handbag-001', 'handbag-002'],
          'bag': ['handbag-001', 'handbag-002'],
          
          // Wallet variations
          'wallet': ['wallet-001'],
          'purse': ['wallet-001'],
          'card holder': ['wallet-001'],
          
          // Bracelet variations
          'bracelet': ['bracelet-001'],
          'bangle': ['bracelet-001'],
          'wrist band': ['bracelet-001'],
          
          // Perfume variations
          'perfume': ['perfume-001', 'perfume-002'],
          'fragrance': ['perfume-001', 'perfume-002'],
          'cologne': ['perfume-001', 'perfume-002'],
          
          // Watch variations
          'watch': ['watch-001'],
          'timepiece': ['watch-001'],
          'wristwatch': ['watch-001'],
          
          // Compact variations
          'compact': ['compact-001'],
          'powder compact': ['compact-001'],
          'mirror compact': ['compact-001'],
          
          // Blush variations
          'blush': ['blush-001'],
          'rouge': ['blush-001'],
          'cheek color': ['blush-001'],
          
          // Liner variations
          'liner': ['liner-001'],
          'eyeliner': ['liner-001'],
          'eye liner': ['liner-001'],
          
          // Scarf variations
          'scarf': ['scarf-001'],
          'neck scarf': ['scarf-001'],
          'silk scarf': ['scarf-001'],
          
          // Face wash variations
          'facewash': ['facewash-001'],
          'face wash': ['facewash-001'],
          'face-wash': ['facewash-001'],
          
          // Sunscreen variations
          'sunscreen': ['sunscreen-001'],
          'sun screen': ['sunscreen-001'],
          'sun-screen': ['sunscreen-001'],
          
          // Moisturiser variations
          'moisturiser': ['moisturiser-001'],
          'moisturizer': ['moisturiser-001'],
          
          // Shaving kit variations
          'shaving kit': ['shavingkit-001'],
          'shaving': ['shavingkit-001'],
          'razor': ['shavingkit-001'],
          
          // General category mappings
          'makeup': ['lipstick-001', 'lipstick-002', 'blush-001', 'compact-001', 'liner-001'],
          'cosmetics': ['lipstick-001', 'lipstick-002', 'blush-001', 'compact-001', 'liner-001'],
          'beauty': ['lipstick-001', 'lipstick-002', 'blush-001', 'compact-001', 'liner-001'],
          'accessories': ['handbag-001', 'handbag-002', 'wallet-001', 'bracelet-001', 'watch-001', 'scarf-001'],
          'jewelry': ['bracelet-001', 'watch-001'],
          'jewellery': ['bracelet-001', 'watch-001'],
          'skincare': ['facewash-001', 'sunscreen-001', 'moisturiser-001'],
          'grooming': ['facewash-001', 'sunscreen-001', 'moisturiser-001', 'shavingkit-001']
        }
        
        // Get product IDs that match the search query
        const matchingProductIds = new Set<string>()
        
        // Direct term matching
        if (searchTermToProductIds[searchLower]) {
          searchTermToProductIds[searchLower].forEach(id => matchingProductIds.add(id))
        }
        
        // Partial word matching
        const queryWords = searchLower.split(/\s+/).filter(word => word.length > 1)
        for (const word of queryWords) {
          if (searchTermToProductIds[word]) {
            searchTermToProductIds[word].forEach(id => matchingProductIds.add(id))
          }
        }
        
        // Normalized compound word matching
        const normalizedQuery = searchLower.replace(/\s+/g, '').replace(/[^\w]/g, '')
        for (const [term, productIds] of Object.entries(searchTermToProductIds)) {
          const normalizedTerm = term.replace(/\s+/g, '').replace(/[^\w]/g, '')
          if (normalizedTerm.includes(normalizedQuery) || normalizedQuery.includes(normalizedTerm)) {
            productIds.forEach(id => matchingProductIds.add(id))
          }
        }
        
        // Filter products by matching IDs
        allProducts = allProducts.filter(product =>
          matchingProductIds.has(product.id)
        )
      }
      
      // Apply pagination for all searches
      const page = params.page || 1
      const limit = params.limit || 12
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const finalProducts = allProducts.slice(startIndex, endIndex)
      
      set({
        products: finalProducts,
        pagination: {
          page: params.page || 1,
          total: allProducts.length,
          pages: Math.ceil(allProducts.length / (params.limit || 12)),
          limit: params.limit || 12
        },
        isLoading: false
      })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products'
      })
    }
  },

  fetchFeaturedProducts: async () => {
    set({ isLoading: true, error: null })
    
    try {
      // Use local featured products data
      const products: Product[] = productsData.featured || []
      
      set({
        featuredProducts: products,
        isLoading: false
      })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch featured products'
      })
    }
  },

  fetchProduct: async (id: string) => {
    set({ isLoading: true, error: null })
    
    try {
      // Search for product in products-f.json and products-m.json only
      const allProducts = [
        ...Object.values(productsDataF).flat(),
        ...Object.values(productsDataM).flat()
      ]
      
      const product = allProducts.find(p => p.id === id) || null
      
      set({
        currentProduct: product,
        isLoading: false
      })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch product'
      })
    }
  },

  fetchCategories: async () => {
    try {
      // Extract unique categories from products-f.json and products-m.json only
      const allProducts = [
        ...Object.values(productsDataF).flat(),
        ...Object.values(productsDataM).flat()
      ]
      
      const categories = [...new Set(allProducts.map(product => product.category))]
      
      set({ categories })
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  },

  fetchBrands: async () => {
    try {
      // Since local data doesn't have brand property, we'll extract from product names
      const brands = ['Kolzo'] // All products are Kolzo brand based on the data
      
      set({ brands })
    } catch (error) {
      console.error('Failed to fetch brands:', error)
    }
  },

  searchProducts: async (query: string) => {
    set({ isLoading: true, error: null })
    
    try {
      // Validate input
      if (!query || typeof query !== 'string') {
        throw new Error('Invalid search query')
      }
      
      const searchLower = query.toLowerCase().trim()
      
      if (searchLower.length < 1) {
        set({
          products: [],
          pagination: {
            page: 1,
            total: 0,
            pages: 1,
            limit: 0
          },
          isLoading: false
        })
        return
      }
      
      // Search term to product ID mapping
      const searchTermToProductIds: { [key: string]: string[] } = {
        // Lipstick variations (Women's)
        'lipstick': ['lp-001', 'lp-002', 'lp-003', 'lp-004', 'lp-005', 'lp-006', 'lp-007', 'lp-008'],
        'lip stick': ['lp-001', 'lp-002', 'lp-003', 'lp-004', 'lp-005', 'lp-006', 'lp-007', 'lp-008'],
        'lip-stick': ['lp-001', 'lp-002', 'lp-003', 'lp-004', 'lp-005', 'lp-006', 'lp-007', 'lp-008'],
        'lip': ['lp-001', 'lp-002', 'lp-003', 'lp-004', 'lp-005', 'lp-006', 'lp-007', 'lp-008'],
        
        // Handbag variations (Women's)
        'handbag': ['hb-001', 'hb-002', 'hb-003', 'hb-004', 'hb-005', 'hb-006', 'hb-007', 'hb-008'],
        'hand bag': ['hb-001', 'hb-002', 'hb-003', 'hb-004', 'hb-005', 'hb-006', 'hb-007', 'hb-008'],
        'hand-bag': ['hb-001', 'hb-002', 'hb-003', 'hb-004', 'hb-005', 'hb-006', 'hb-007', 'hb-008'],
        'bag': ['hb-001', 'hb-002', 'hb-003', 'hb-004', 'hb-005', 'hb-006', 'hb-007', 'hb-008'],
        
        // Wallet variations (Men's)
        'wallet': ['wl-001', 'wl-002', 'wl-003', 'wl-004', 'wl-005', 'wl-006', 'wl-007', 'wl-008'],
        'purse': ['wl-001', 'wl-002', 'wl-003', 'wl-004', 'wl-005', 'wl-006', 'wl-007', 'wl-008'],
        'card holder': ['wl-001', 'wl-002', 'wl-003', 'wl-004', 'wl-005', 'wl-006', 'wl-007', 'wl-008'],
        
        // Bracelet variations (Men's)
        'bracelet': ['br-001', 'br-002', 'br-003', 'br-004', 'br-005', 'br-006', 'br-007', 'br-008'],
        'bangle': ['br-001', 'br-002', 'br-003', 'br-004', 'br-005', 'br-006', 'br-007', 'br-008'],
        'wrist band': ['br-001', 'br-002', 'br-003', 'br-004', 'br-005', 'br-006', 'br-007', 'br-008'],
        
        // Perfume variations (Women's)
        'perfume': ['pf-001', 'pf-002', 'pf-003', 'pf-004', 'pf-005', 'pf-006', 'pf-007', 'pf-008'],
        'fragrance': ['pf-001', 'pf-002', 'pf-003', 'pf-004', 'pf-005', 'pf-006', 'pf-007', 'pf-008'],
        'cologne': ['pf-001', 'pf-002', 'pf-003', 'pf-004', 'pf-005', 'pf-006', 'pf-007', 'pf-008'],
        
        // Watch variations (Men's)
        'watch': ['wt-001', 'wt-002', 'wt-003', 'wt-004', 'wt-005', 'wt-006', 'wt-007', 'wt-008'],
        'timepiece': ['wt-001', 'wt-002', 'wt-003', 'wt-004', 'wt-005', 'wt-006', 'wt-007', 'wt-008'],
        'wristwatch': ['wt-001', 'wt-002', 'wt-003', 'wt-004', 'wt-005', 'wt-006', 'wt-007', 'wt-008'],
        
        // Compact variations (Women's)
        'compact': ['cp-001', 'cp-002', 'cp-003', 'cp-004', 'cp-005', 'cp-006', 'cp-007', 'cp-008'],
        'powder compact': ['cp-001', 'cp-002', 'cp-003', 'cp-004', 'cp-005', 'cp-006', 'cp-007', 'cp-008'],
        'mirror compact': ['cp-001', 'cp-002', 'cp-003', 'cp-004', 'cp-005', 'cp-006', 'cp-007', 'cp-008'],
        
        // Blush variations (Women's)
        'blush': ['bl-001', 'bl-002', 'bl-003', 'bl-004', 'bl-005', 'bl-006', 'bl-007', 'bl-008'],
        'rouge': ['bl-001', 'bl-002', 'bl-003', 'bl-004', 'bl-005', 'bl-006', 'bl-007', 'bl-008'],
        'cheek color': ['bl-001', 'bl-002', 'bl-003', 'bl-004', 'bl-005', 'bl-006', 'bl-007', 'bl-008'],
        
        // Eye Liner variations (Women's)
        'liner': ['el-001', 'el-002', 'el-003', 'el-004', 'el-005', 'el-006', 'el-007', 'el-008'],
        'eyeliner': ['el-001', 'el-002', 'el-003', 'el-004', 'el-005', 'el-006', 'el-007', 'el-008'],
        'eye liner': ['el-001', 'el-002', 'el-003', 'el-004', 'el-005', 'el-006', 'el-007', 'el-008'],
        
        // Scarf variations (Women's)
        'scarf': ['sc-001', 'sc-002', 'sc-003', 'sc-004', 'sc-005', 'sc-006', 'sc-007', 'sc-008'],
        'neck scarf': ['sc-001', 'sc-002', 'sc-003', 'sc-004', 'sc-005', 'sc-006', 'sc-007', 'sc-008'],
        'silk scarf': ['sc-001', 'sc-002', 'sc-003', 'sc-004', 'sc-005', 'sc-006', 'sc-007', 'sc-008'],
        
        // Face wash variations (Men's)
        'facewash': ['fw-001', 'fw-002', 'fw-003', 'fw-004', 'fw-005', 'fw-006', 'fw-007', 'fw-008'],
        'face wash': ['fw-001', 'fw-002', 'fw-003', 'fw-004', 'fw-005', 'fw-006', 'fw-007', 'fw-008'],
        'face-wash': ['fw-001', 'fw-002', 'fw-003', 'fw-004', 'fw-005', 'fw-006', 'fw-007', 'fw-008'],
        
        // Sunscreen variations (Men's)
        'sunscreen': ['ss-001', 'ss-002', 'ss-003', 'ss-004', 'ss-005', 'ss-006', 'ss-007', 'ss-008'],
        'sun screen': ['ss-001', 'ss-002', 'ss-003', 'ss-004', 'ss-005', 'ss-006', 'ss-007', 'ss-008'],
        'sun-screen': ['ss-001', 'ss-002', 'ss-003', 'ss-004', 'ss-005', 'ss-006', 'ss-007', 'ss-008'],
        
        // Moisturiser variations (Men's)
        'moisturiser': ['ms-001', 'ms-002', 'ms-003', 'ms-004', 'ms-005', 'ms-006', 'ms-007', 'ms-008'],
        'moisturizer': ['ms-001', 'ms-002', 'ms-003', 'ms-004', 'ms-005', 'ms-006', 'ms-007', 'ms-008'],
        
        // Shaving kit variations (Men's)
        'shaving kit': ['sk-001', 'sk-002', 'sk-003', 'sk-004', 'sk-005', 'sk-006', 'sk-007', 'sk-008'],
        'shaving': ['sk-001', 'sk-002', 'sk-003', 'sk-004', 'sk-005', 'sk-006', 'sk-007', 'sk-008'],
        'razor': ['sk-001', 'sk-002', 'sk-003', 'sk-004', 'sk-005', 'sk-006', 'sk-007', 'sk-008'],
        
        // Lip Balm variations (Women's)
        'lip balm': ['lb-001', 'lb-002', 'lb-003', 'lb-004', 'lb-005', 'lb-006', 'lb-007', 'lb-008'],
        'lipbalm': ['lb-001', 'lb-002', 'lb-003', 'lb-004', 'lb-005', 'lb-006', 'lb-007', 'lb-008'],
        'balm': ['lb-001', 'lb-002', 'lb-003', 'lb-004', 'lb-005', 'lb-006', 'lb-007', 'lb-008'],
        
        // Men's Perfumes
        'men perfume': ['pm-001', 'pm-002', 'pm-003', 'pm-004', 'pm-005', 'pm-006', 'pm-007', 'pm-008'],
        'men fragrance': ['pm-001', 'pm-002', 'pm-003', 'pm-004', 'pm-005', 'pm-006', 'pm-007', 'pm-008'],
        'men cologne': ['pm-001', 'pm-002', 'pm-003', 'pm-004', 'pm-005', 'pm-006', 'pm-007', 'pm-008'],
        
        // Men's Handbags
        'men handbag': ['hb-001-m', 'hb-002-m', 'hb-003-m', 'hb-004-m', 'hb-005-m', 'hb-006-m', 'hb-007-m', 'hb-008-m'],
        'men bag': ['hb-001-m', 'hb-002-m', 'hb-003-m', 'hb-004-m', 'hb-005-m', 'hb-006-m', 'hb-007-m', 'hb-008-m'],
        'backpack': ['hb-001-m', 'hb-002-m', 'hb-003-m', 'hb-004-m', 'hb-005-m', 'hb-006-m', 'hb-007-m', 'hb-008-m'],
        'messenger bag': ['hb-001-m', 'hb-002-m', 'hb-003-m', 'hb-004-m', 'hb-005-m', 'hb-006-m', 'hb-007-m', 'hb-008-m'],
        'briefcase': ['hb-001-m', 'hb-002-m', 'hb-003-m', 'hb-004-m', 'hb-005-m', 'hb-006-m', 'hb-007-m', 'hb-008-m'],
        
        // Women's Watches
        'women watch': ['wf-001', 'wf-002', 'wf-003', 'wf-004', 'wf-005', 'wf-006', 'wf-007', 'wf-008'],
        'women timepiece': ['wf-001', 'wf-002', 'wf-003', 'wf-004', 'wf-005', 'wf-006', 'wf-007', 'wf-008'],
        
        // General category mappings
        'makeup': ['lp-001', 'lp-002', 'lp-003', 'lp-004', 'lp-005', 'lp-006', 'lp-007', 'lp-008', 'bl-001', 'bl-002', 'bl-003', 'bl-004', 'bl-005', 'bl-006', 'bl-007', 'bl-008', 'cp-001', 'cp-002', 'cp-003', 'cp-004', 'cp-005', 'cp-006', 'cp-007', 'cp-008', 'el-001', 'el-002', 'el-003', 'el-004', 'el-005', 'el-006', 'el-007', 'el-008'],
        'cosmetics': ['lp-001', 'lp-002', 'lp-003', 'lp-004', 'lp-005', 'lp-006', 'lp-007', 'lp-008', 'bl-001', 'bl-002', 'bl-003', 'bl-004', 'bl-005', 'bl-006', 'bl-007', 'bl-008', 'cp-001', 'cp-002', 'cp-003', 'cp-004', 'cp-005', 'cp-006', 'cp-007', 'cp-008', 'el-001', 'el-002', 'el-003', 'el-004', 'el-005', 'el-006', 'el-007', 'el-008'],
        'beauty': ['lp-001', 'lp-002', 'lp-003', 'lp-004', 'lp-005', 'lp-006', 'lp-007', 'lp-008', 'bl-001', 'bl-002', 'bl-003', 'bl-004', 'bl-005', 'bl-006', 'bl-007', 'bl-008', 'cp-001', 'cp-002', 'cp-003', 'cp-004', 'cp-005', 'cp-006', 'cp-007', 'cp-008', 'el-001', 'el-002', 'el-003', 'el-004', 'el-005', 'el-006', 'el-007', 'el-008'],
        'accessories': ['hb-001', 'hb-002', 'hb-003', 'hb-004', 'hb-005', 'hb-006', 'hb-007', 'hb-008', 'wl-001', 'wl-002', 'wl-003', 'wl-004', 'wl-005', 'wl-006', 'wl-007', 'wl-008', 'br-001', 'br-002', 'br-003', 'br-004', 'br-005', 'br-006', 'br-007', 'br-008', 'wt-001', 'wt-002', 'wt-003', 'wt-004', 'wt-005', 'wt-006', 'wt-007', 'wt-008', 'sc-001', 'sc-002', 'sc-003', 'sc-004', 'sc-005', 'sc-006', 'sc-007', 'sc-008', 'wf-001', 'wf-002', 'wf-003', 'wf-004', 'wf-005', 'wf-006', 'wf-007', 'wf-008'],
        'jewelry': ['br-001', 'br-002', 'br-003', 'br-004', 'br-005', 'br-006', 'br-007', 'br-008', 'wt-001', 'wt-002', 'wt-003', 'wt-004', 'wt-005', 'wt-006', 'wt-007', 'wt-008', 'wf-001', 'wf-002', 'wf-003', 'wf-004', 'wf-005', 'wf-006', 'wf-007', 'wf-008'],
        'jewellery': ['br-001', 'br-002', 'br-003', 'br-004', 'br-005', 'br-006', 'br-007', 'br-008', 'wt-001', 'wt-002', 'wt-003', 'wt-004', 'wt-005', 'wt-006', 'wt-007', 'wt-008', 'wf-001', 'wf-002', 'wf-003', 'wf-004', 'wf-005', 'wf-006', 'wf-007', 'wf-008'],
        'skincare': ['fw-001', 'fw-002', 'fw-003', 'fw-004', 'fw-005', 'fw-006', 'fw-007', 'fw-008', 'ss-001', 'ss-002', 'ss-003', 'ss-004', 'ss-005', 'ss-006', 'ss-007', 'ss-008', 'ms-001', 'ms-002', 'ms-003', 'ms-004', 'ms-005', 'ms-006', 'ms-007', 'ms-008'],
        'grooming': ['fw-001', 'fw-002', 'fw-003', 'fw-004', 'fw-005', 'fw-006', 'fw-007', 'fw-008', 'ss-001', 'ss-002', 'ss-003', 'ss-004', 'ss-005', 'ss-006', 'ss-007', 'ss-008', 'ms-001', 'ms-002', 'ms-003', 'ms-004', 'ms-005', 'ms-006', 'ms-007', 'ms-008', 'sk-001', 'sk-002', 'sk-003', 'sk-004', 'sk-005', 'sk-006', 'sk-007', 'sk-008'],
        'fragrances': ['pf-001', 'pf-002', 'pf-003', 'pf-004', 'pf-005', 'pf-006', 'pf-007', 'pf-008', 'pm-001', 'pm-002', 'pm-003', 'pm-004', 'pm-005', 'pm-006', 'pm-007', 'pm-008'],
        'watches': ['wt-001', 'wt-002', 'wt-003', 'wt-004', 'wt-005', 'wt-006', 'wt-007', 'wt-008', 'wf-001', 'wf-002', 'wf-003', 'wf-004', 'wf-005', 'wf-006', 'wf-007', 'wf-008'],
        'handbags': ['hb-001', 'hb-002', 'hb-003', 'hb-004', 'hb-005', 'hb-006', 'hb-007', 'hb-008', 'hb-001-m', 'hb-002-m', 'hb-003-m', 'hb-004-m', 'hb-005-m', 'hb-006-m', 'hb-007-m', 'hb-008-m']
      }
      
      // Get product IDs that match the search query
      const matchingProductIds = new Set<string>()
      
      // Direct term matching
      if (searchTermToProductIds[searchLower]) {
        searchTermToProductIds[searchLower].forEach(id => matchingProductIds.add(id))
      }
      
      // Partial word matching
      const queryWords = searchLower.split(/\s+/).filter(word => word.length > 1)
      for (const word of queryWords) {
        if (searchTermToProductIds[word]) {
          searchTermToProductIds[word].forEach(id => matchingProductIds.add(id))
        }
      }
      
      // Normalized compound word matching
      const normalizedQuery = searchLower.replace(/\s+/g, '').replace(/[^\w]/g, '')
      for (const [term, productIds] of Object.entries(searchTermToProductIds)) {
        const normalizedTerm = term.replace(/\s+/g, '').replace(/[^\w]/g, '')
        if (normalizedTerm.includes(normalizedQuery) || normalizedQuery.includes(normalizedTerm)) {
          productIds.forEach(id => matchingProductIds.add(id))
        }
      }
      
      // Combine all products from both data sources
      const allProducts = [
        ...Object.values(productsDataF).flat(),
        ...Object.values(productsDataM).flat()
      ]
      
      // Filter products by matching IDs
      const products = allProducts.filter(product => 
        matchingProductIds.has(product.id)
      )
      
      set({
        products,
        pagination: {
          page: 1,
          total: products.length,
          pages: 1,
          limit: products.length
        },
        isLoading: false
      })
      
      // Get recommendations based on search query (only if products found)
      if (products.length > 0) {
      await _get().getRecommendedProducts(undefined, query)
      } else {
        // Clear recommendations when no products found
        set({ recommendedProducts: [] })
      }
      
    } catch (error) {
      console.error('Search error:', error)
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Search failed',
        products: [],
        pagination: {
          page: 1,
          total: 0,
          pages: 1,
          limit: 0
        }
      })
    }
  },

  getRecommendedProducts: async (currentProduct?: Product, searchQuery?: string) => {
    try {
      // Get products only from products-f.json and products-m.json for recommendation
      const allProducts = [
        ...Object.values(productsDataF).flat(),
        ...Object.values(productsDataM).flat()
      ]
      
      const uniqueProducts = allProducts
      
      let recommendations: Product[] = []
      
      if (currentProduct) {
        // Recommendation based on current product
        recommendations = uniqueProducts
          .filter(product => 
            product.id !== currentProduct.id && 
            (product.category === currentProduct.category || 
             product.price >= currentProduct.price * 0.7 && 
             product.price <= currentProduct.price * 1.3)
          )
          .slice(0, 6)
      } else if (searchQuery) {
        // Recommendation based on search query
        const searchLower = searchQuery.toLowerCase()
        recommendations = uniqueProducts
          .filter(product => 
            product.name.toLowerCase().includes(searchLower) ||
            product.category.toLowerCase().includes(searchLower)
          )
          .slice(0, 6)
      } else {
        // Default recommendations (featured products)
        recommendations = uniqueProducts
          .filter(product => (product as any).featured)
          .slice(0, 6)
      }
      
      set({ recommendedProducts: recommendations })
    } catch (error) {
      console.error('Failed to get recommended products:', error)
      set({ recommendedProducts: [] })
    }
  },

  clearError: () => {
    set({ error: null })
  }
})) 