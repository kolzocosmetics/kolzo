import productsData from '../data/products.json'
import productsFData from '../data/products-f.json'
import productsMData from '../data/products-m.json'

interface SitemapUrl {
  url: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

const baseUrl = 'https://kolzo.in'

// Static pages
const staticPages: SitemapUrl[] = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/collections/women', priority: 0.9, changefreq: 'weekly' },
  { url: '/collections/men', priority: 0.9, changefreq: 'weekly' },
  { url: '/search', priority: 0.8, changefreq: 'weekly' },
  { url: '/cart', priority: 0.7, changefreq: 'weekly' },
  { url: '/wishlist', priority: 0.7, changefreq: 'weekly' },
  { url: '/my-order', priority: 0.6, changefreq: 'monthly' },
  { url: '/faqs', priority: 0.6, changefreq: 'monthly' },
  { url: '/about-kolzo', priority: 0.6, changefreq: 'monthly' },
  { url: '/sustainability', priority: 0.6, changefreq: 'monthly' },
  { url: '/size-guide', priority: 0.5, changefreq: 'monthly' },
  { url: '/care-repair', priority: 0.5, changefreq: 'monthly' },
  { url: '/checkout', priority: 0.4, changefreq: 'weekly' },
  { url: '/order-success', priority: 0.3, changefreq: 'monthly' }
]

// Category pages
const categoryPages: SitemapUrl[] = [
  // Women's categories
  { url: '/collections/women?category=Handbags', priority: 0.8, changefreq: 'weekly' },
  { url: '/collections/women?category=Lipstick', priority: 0.8, changefreq: 'weekly' },
  { url: '/collections/women?category=Scarf', priority: 0.8, changefreq: 'weekly' },
  { url: '/collections/women?category=Blush', priority: 0.8, changefreq: 'weekly' },
  { url: '/collections/women?category=Lip Balm', priority: 0.8, changefreq: 'weekly' },
  { url: '/collections/women?category=Perfumes', priority: 0.8, changefreq: 'weekly' },
  { url: '/collections/women?category=Eye Liner', priority: 0.8, changefreq: 'weekly' },
  { url: '/collections/women?category=Compact', priority: 0.8, changefreq: 'weekly' },
  { url: '/collections/women?category=Watches', priority: 0.8, changefreq: 'weekly' },
  
  // Men's categories
  { url: '/collections/men?category=Wallet', priority: 0.8, changefreq: 'weekly' },
  { url: '/collections/men?category=Bracelets', priority: 0.8, changefreq: 'weekly' },
  { url: '/collections/men?category=Perfumes', priority: 0.8, changefreq: 'weekly' },
  { url: '/collections/men?category=Handbags', priority: 0.8, changefreq: 'weekly' },
  { url: '/collections/men?category=Watches', priority: 0.8, changefreq: 'weekly' },
  { url: '/collections/men?category=Moisturiser', priority: 0.8, changefreq: 'weekly' },
  { url: '/collections/men?category=Face Wash', priority: 0.8, changefreq: 'weekly' },
  { url: '/collections/men?category=Sunscreen', priority: 0.8, changefreq: 'weekly' },
  { url: '/collections/men?category=Shaving Kit', priority: 0.8, changefreq: 'weekly' }
]

// Generate product URLs
const generateProductUrls = (): SitemapUrl[] => {
  const productUrls: SitemapUrl[] = []
  
  // Add products from main products.json
  if (productsData.featured) {
    productsData.featured.forEach(product => {
      productUrls.push({
        url: `/product/${product.id}`,
        priority: 0.7,
        changefreq: 'weekly'
      })
    })
  }
  
  if (productsData.women) {
    productsData.women.forEach(product => {
      productUrls.push({
        url: `/product/${product.id}`,
        priority: 0.7,
        changefreq: 'weekly'
      })
    })
  }
  
  if (productsData.men) {
    productsData.men.forEach(product => {
      productUrls.push({
        url: `/product/${product.id}`,
        priority: 0.7,
        changefreq: 'weekly'
      })
    })
  }
  
  // Add products from products-f.json
  Object.values(productsFData).forEach(category => {
    if (Array.isArray(category)) {
      category.forEach(product => {
        productUrls.push({
          url: `/product/${product.id}`,
          priority: 0.7,
          changefreq: 'weekly'
        })
      })
    }
  })
  
  // Add products from products-m.json
  Object.values(productsMData).forEach(category => {
    if (Array.isArray(category)) {
      category.forEach(product => {
        productUrls.push({
          url: `/product/${product.id}`,
          priority: 0.7,
          changefreq: 'weekly'
        })
      })
    }
  })
  
  return productUrls
}

// Generate sitemap XML
export const generateSitemap = (): string => {
  const allUrls = [...staticPages, ...categoryPages, ...generateProductUrls()]
  const currentDate = new Date().toISOString().split('T')[0]
  
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  
  allUrls.forEach(urlData => {
    sitemap += '  <url>\n'
    sitemap += `    <loc>${baseUrl}${urlData.url}</loc>\n`
    sitemap += `    <lastmod>${urlData.lastmod || currentDate}</lastmod>\n`
    sitemap += `    <changefreq>${urlData.changefreq || 'weekly'}</changefreq>\n`
    sitemap += `    <priority>${urlData.priority || 0.5}</priority>\n`
    sitemap += '  </url>\n'
  })
  
  sitemap += '</urlset>'
  
  return sitemap
}

// Generate robots.txt content
export const generateRobotsTxt = (): string => {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /private/
Disallow: /api/

# Allow important pages
Allow: /collections/
Allow: /product/
Allow: /search
Allow: /cart
Allow: /wishlist

# Crawl delay (optional)
Crawl-delay: 1`
} 