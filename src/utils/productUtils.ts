// Product utility functions for enhanced search and filtering

export interface Product {
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

export interface FilterOptions {
  category?: string;
  gender?: string;
  priceRange?: { min: number; max: number };
  rating?: number;
  brand?: string;
  status?: string;
  featured?: boolean;
}

export interface SortOptions {
  field: 'name' | 'price' | 'rating' | 'createdAt' | 'salesCount';
  direction: 'asc' | 'desc';
}

// Enhanced search with fuzzy matching
export const searchProducts = (products: Product[], query: string): Product[] => {
  if (!query.trim()) return products;
  
  const searchTerm = query.toLowerCase().trim();
  const searchWords = searchTerm.split(' ').filter(word => word.length > 0);
  
  return products.filter(product => {
    const searchableText = [
      product.name,
      product.description,
      product.category,
      product.brand,
      ...(product.tags || [])
    ].join(' ').toLowerCase();
    
    // Exact match gets highest priority
    if (searchableText.includes(searchTerm)) {
      return true;
    }
    
    // Partial word matching
    return searchWords.every(word => 
      searchableText.includes(word) ||
      product.name.toLowerCase().includes(word) ||
      product.description.toLowerCase().includes(word)
    );
  });
};

// Advanced filtering
export const filterProducts = (products: Product[], filters: FilterOptions): Product[] => {
  return products.filter(product => {
    // Category filter
    if (filters.category && product.category.toLowerCase() !== filters.category.toLowerCase()) {
      return false;
    }
    
    // Gender filter
    if (filters.gender && product.gender && product.gender !== filters.gender && product.gender !== 'unisex') {
      return false;
    }
    
    // Price range filter
    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      if (product.price < min || product.price > max) {
        return false;
      }
    }
    
    // Rating filter
    if (filters.rating && product.averageRating && product.averageRating < filters.rating) {
      return false;
    }
    
    // Brand filter
    if (filters.brand && product.brand && product.brand.toLowerCase() !== filters.brand.toLowerCase()) {
      return false;
    }
    
    // Status filter
    if (filters.status && product.status !== filters.status) {
      return false;
    }
    
    // Featured filter
    if (filters.featured !== undefined && product.featured !== filters.featured) {
      return false;
    }
    
    return true;
  });
};

// Advanced sorting
export const sortProducts = (products: Product[], sortOptions: SortOptions): Product[] => {
  const { field, direction } = sortOptions;
  
  return [...products].sort((a, b) => {
    let aValue: any;
    let bValue: any;
    
    switch (field) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'rating':
        aValue = a.averageRating || 0;
        bValue = b.averageRating || 0;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt || 0).getTime();
        bValue = new Date(b.createdAt || 0).getTime();
        break;
      case 'salesCount':
        aValue = a.salesCount || 0;
        bValue = b.salesCount || 0;
        break;
      default:
        return 0;
    }
    
    if (direction === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });
};

// Get unique categories
export const getUniqueCategories = (products: Product[]): string[] => {
  const categories = products.map(product => product.category);
  return [...new Set(categories)].sort();
};

// Get unique brands
export const getUniqueBrands = (products: Product[]): string[] => {
  const brands = products
    .map(product => product.brand)
    .filter((brand): brand is string => Boolean(brand) && brand!.trim() !== '');
  return [...new Set(brands)].sort();
};

// Get price range
export const getPriceRange = (products: Product[]): { min: number; max: number } => {
  if (products.length === 0) return { min: 0, max: 0 };
  
  const prices = products.map(product => product.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
};

// Get related products
export const getRelatedProducts = (product: Product, allProducts: Product[], limit: number = 4): Product[] => {
  const related = allProducts.filter(p => 
    p.id !== product.id && 
    (p.category === product.category || p.brand === product.brand)
  );
  
  // Sort by relevance (same category + brand gets highest priority)
  const scored = related.map(p => ({
    product: p,
    score: (p.category === product.category ? 2 : 0) + 
           (p.brand === product.brand ? 1 : 0) +
           (Math.abs(p.price - product.price) < 50 ? 1 : 0)
  }));
  
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.product);
};

// Validate product data
export const validateProduct = (product: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!product.id) errors.push('Product ID is required');
  if (!product.name) errors.push('Product name is required');
  if (typeof product.price !== 'number' || product.price < 0) {
    errors.push('Valid price is required');
  }
  if (!product.category) errors.push('Product category is required');
  if (!product.description) errors.push('Product description is required');
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Get product statistics
export const getProductStats = (products: Product[]) => {
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const featuredProducts = products.filter(p => p.featured).length;
  const totalValue = products.reduce((sum, p) => sum + p.price, 0);
  const avgPrice = totalProducts > 0 ? totalValue / totalProducts : 0;
  
  return {
    totalProducts,
    activeProducts,
    featuredProducts,
    totalValue,
    avgPrice
  };
}; 