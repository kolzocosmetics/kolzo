// Scroll position cache utility

interface ScrollCache {
  [pathname: string]: number
}

class ScrollPositionCache {
  private cache: ScrollCache = {}
  private currentPath: string = ''

  // Store scroll position for current page
  storeScrollPosition = () => {
    if (this.currentPath) {
      this.cache[this.currentPath] = window.scrollY
    }
  }

  // Restore scroll position for a specific page
  restoreScrollPosition = (pathname: string) => {
    const savedPosition = this.cache[pathname]
    if (savedPosition !== undefined) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        window.scrollTo(0, savedPosition)
      }, 0)
    } else {
      // If no saved position, scroll to top
      window.scrollTo(0, 0)
    }
  }

  // Set current path and store current scroll position
  setCurrentPath = (pathname: string) => {
    // Store scroll position of previous page
    if (this.currentPath && this.currentPath !== pathname) {
      this.storeScrollPosition()
    }
    
    this.currentPath = pathname
  }

  // Clear cache for a specific page
  clearPageCache = (pathname: string) => {
    delete this.cache[pathname]
  }

  // Clear all cache
  clearAllCache = () => {
    this.cache = {}
  }

  // Get current cache
  getCache = () => {
    return { ...this.cache }
  }
}

// Create singleton instance
const scrollCache = new ScrollPositionCache()

export default scrollCache 