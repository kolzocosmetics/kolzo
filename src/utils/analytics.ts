// Basic analytics system for Kolzo luxury e-commerce
interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  timestamp?: number
}

class Analytics {
  private events: AnalyticsEvent[] = []
  private sessionId: string

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initialize()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private initialize() {
    // Track page views
    this.trackPageView(window.location.pathname)
    
    // Track session start
    this.trackEvent('session_start', {
      session_id: this.sessionId,
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    })
  }

  private trackEvent(event: string, properties?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: Date.now()
    }

    this.events.push(analyticsEvent)
    
    // In a real app, this would send to analytics service
    console.log('Analytics Event:', analyticsEvent)
    
    // Simulate sending to analytics service
    this.sendToAnalyticsService(analyticsEvent)
  }

  private async sendToAnalyticsService(_event: AnalyticsEvent) {
    try {
      // Simulate API call to analytics service
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // In real implementation, this would be:
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // })
    } catch (error) {
      console.error('Analytics error:', error)
    }
  }

  // Page tracking
  trackPageView(page: string) {
    this.trackEvent('page_view', {
      page,
      session_id: this.sessionId,
      referrer: document.referrer
    })
  }

  // E-commerce tracking
  trackProductView(productId: string, productName: string, price: number, category: string) {
    this.trackEvent('product_view', {
      product_id: productId,
      product_name: productName,
      price,
      category,
      session_id: this.sessionId
    })
  }

  trackAddToCart(productId: string, productName: string, price: number, quantity: number) {
    this.trackEvent('add_to_cart', {
      product_id: productId,
      product_name: productName,
      price,
      quantity,
      session_id: this.sessionId
    })
  }

  trackRemoveFromCart(productId: string, productName: string, price: number, quantity: number) {
    this.trackEvent('remove_from_cart', {
      product_id: productId,
      product_name: productName,
      price,
      quantity,
      session_id: this.sessionId
    })
  }

  trackPurchase(orderId: string, total: number, items: Array<{id: string, name: string, price: number, quantity: number}>) {
    this.trackEvent('purchase', {
      order_id: orderId,
      total,
      items,
      session_id: this.sessionId
    })
  }

  // User interaction tracking
  trackSearch(query: string, results: number) {
    this.trackEvent('search', {
      query,
      results_count: results,
      session_id: this.sessionId
    })
  }

  trackWishlistAdd(productId: string, productName: string) {
    this.trackEvent('wishlist_add', {
      product_id: productId,
      product_name: productName,
      session_id: this.sessionId
    })
  }

  trackWishlistRemove(productId: string, productName: string) {
    this.trackEvent('wishlist_remove', {
      product_id: productId,
      product_name: productName,
      session_id: this.sessionId
    })
  }

  // User authentication tracking
  trackLogin(method: string) {
    this.trackEvent('login', {
      method,
      session_id: this.sessionId
    })
  }

  trackSignup(method: string) {
    this.trackEvent('signup', {
      method,
      session_id: this.sessionId
    })
  }

  trackLogout() {
    this.trackEvent('logout', {
      session_id: this.sessionId
    })
  }

  // Form tracking
  trackFormStart(formName: string) {
    this.trackEvent('form_start', {
      form_name: formName,
      session_id: this.sessionId
    })
  }

  trackFormComplete(formName: string) {
    this.trackEvent('form_complete', {
      form_name: formName,
      session_id: this.sessionId
    })
  }

  trackFormError(formName: string, error: string) {
    this.trackEvent('form_error', {
      form_name: formName,
      error,
      session_id: this.sessionId
    })
  }

  // Error tracking
  trackError(error: string, stack?: string) {
    this.trackEvent('error', {
      error,
      stack,
      session_id: this.sessionId
    })
  }

  // Performance tracking
  trackPerformance(metric: string, value: number) {
    this.trackEvent('performance', {
      metric,
      value,
      session_id: this.sessionId
    })
  }

  // Get analytics data (for debugging)
  getEvents(): AnalyticsEvent[] {
    return [...this.events]
  }

  // Clear events (for testing)
  clearEvents() {
    this.events = []
  }
}

// Create singleton instance
const analyticsInstance = new Analytics()

// Export individual tracking functions for easy use
export const trackPageView = (page: string) => analyticsInstance.trackPageView(page)
export const trackProductView = (productId: string, productName: string, price: number, category: string) => 
  analyticsInstance.trackProductView(productId, productName, price, category)
export const trackAddToCart = (productId: string, productName: string, price: number, quantity: number) => 
  analyticsInstance.trackAddToCart(productId, productName, price, quantity)
export const trackRemoveFromCart = (productId: string, productName: string, price: number, quantity: number) => 
  analyticsInstance.trackRemoveFromCart(productId, productName, price, quantity)
export const trackPurchase = (orderId: string, total: number, items: Array<{id: string, name: string, price: number, quantity: number}>) => 
  analyticsInstance.trackPurchase(orderId, total, items)
export const trackSearch = (query: string, results: number) => analyticsInstance.trackSearch(query, results)
export const trackWishlistAdd = (productId: string, productName: string) => 
  analyticsInstance.trackWishlistAdd(productId, productName)
export const trackWishlistRemove = (productId: string, productName: string) => 
  analyticsInstance.trackWishlistRemove(productId, productName)
export const trackLogin = (method: string) => analyticsInstance.trackLogin(method)
export const trackSignup = (method: string) => analyticsInstance.trackSignup(method)
export const trackLogout = () => analyticsInstance.trackLogout()
export const trackFormStart = (formName: string) => analyticsInstance.trackFormStart(formName)
export const trackFormComplete = (formName: string) => analyticsInstance.trackFormComplete(formName)
export const trackFormError = (formName: string, error: string) => analyticsInstance.trackFormError(formName, error)
export const trackError = (error: string, stack?: string) => analyticsInstance.trackError(error, stack)
export const trackPerformance = (metric: string, value: number) => analyticsInstance.trackPerformance(metric, value)

// Export the analytics instance for direct access if needed
export const analytics = analyticsInstance 