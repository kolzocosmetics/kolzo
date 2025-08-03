import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'product' | 'category'
  productData?: {
    name: string
    price: number
    currency: string
    availability: string
    brand: string
    category: string
    images: string[]
  }
}

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  productData 
}: SEOHeadProps) => {
  const location = useLocation()
  
  const defaultTitle = "KOLZO - Luxury Fashion & Lifestyle | Premium Designer Clothing & Accessories"
  const defaultDescription = "Discover KOLZO's exclusive luxury fashion collection. Shop designer handbags, premium accessories, luxury makeup, and sophisticated lifestyle products. Free shipping on orders over $200."
  const defaultKeywords = "luxury fashion, designer handbags, premium accessories, luxury makeup, kolzo, designer clothing, luxury lifestyle, premium fashion, designer accessories, luxury brands"
  const defaultImage = "https://kolzo.in/assets/kolzo_logo.png"
  const baseUrl = "https://kolzo.in"

  const currentTitle = title || defaultTitle
  const currentDescription = description || defaultDescription
  const currentKeywords = keywords || defaultKeywords
  const currentImage = image || defaultImage
  const currentUrl = url || `${baseUrl}${location.pathname}`

  useEffect(() => {
    // Update document title
    document.title = currentTitle

    // Update meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', name)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('property', property)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    // Update primary meta tags
    updateMetaTag('description', currentDescription)
    updateMetaTag('keywords', currentKeywords)
    updateMetaTag('title', currentTitle)

    // Update Open Graph tags
    updatePropertyTag('og:title', currentTitle)
    updatePropertyTag('og:description', currentDescription)
    updatePropertyTag('og:image', currentImage)
    updatePropertyTag('og:url', currentUrl)
    updatePropertyTag('og:type', type)

    // Update Twitter tags
    updatePropertyTag('twitter:title', currentTitle)
    updatePropertyTag('twitter:description', currentDescription)
    updatePropertyTag('twitter:image', currentImage)
    updatePropertyTag('twitter:url', currentUrl)

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', currentUrl)

    // Add structured data for products
    if (type === 'product' && productData) {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": productData.name,
        "brand": {
          "@type": "Brand",
          "name": productData.brand
        },
        "category": productData.category,
        "description": currentDescription,
        "image": productData.images,
        "offers": {
          "@type": "Offer",
          "price": productData.price,
          "priceCurrency": productData.currency,
          "availability": productData.availability,
          "url": currentUrl
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "127"
        }
      }

      // Remove existing product structured data
      const existingScript = document.querySelector('script[data-seo="product"]')
      if (existingScript) {
        existingScript.remove()
      }

      // Add new structured data
      const script = document.createElement('script')
      script.setAttribute('type', 'application/ld+json')
      script.setAttribute('data-seo', 'product')
      script.textContent = JSON.stringify(structuredData)
      document.head.appendChild(script)
    }

    // Add structured data for categories
    if (type === 'category') {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": currentTitle,
        "description": currentDescription,
        "url": currentUrl,
        "mainEntity": {
          "@type": "ItemList",
          "name": currentTitle,
          "description": currentDescription
        }
      }

      // Remove existing category structured data
      const existingScript = document.querySelector('script[data-seo="category"]')
      if (existingScript) {
        existingScript.remove()
      }

      // Add new structured data
      const script = document.createElement('script')
      script.setAttribute('type', 'application/ld+json')
      script.setAttribute('data-seo', 'category')
      script.textContent = JSON.stringify(structuredData)
      document.head.appendChild(script)
    }

    // Track page view for analytics
    if ((window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: currentTitle,
        page_location: currentUrl
      })
    }

  }, [currentTitle, currentDescription, currentKeywords, currentImage, currentUrl, type, productData])

  return null
}

export default SEOHead 