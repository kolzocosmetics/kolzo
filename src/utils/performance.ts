// Performance monitoring utilities

export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now()
  fn()
  const end = performance.now()
  console.log(`${name} took ${end - start}ms`)
  return end - start
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Memory usage monitoring
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576 * 100) / 100,
      total: Math.round(memory.totalJSHeapSize / 1048576 * 100) / 100,
      limit: Math.round(memory.jsHeapSizeLimit / 1048576 * 100) / 100
    }
  }
  return null
}

// Component render tracking
export const trackRender = (componentName: string) => {
  const start = performance.now()
  return () => {
    const duration = performance.now() - start
    if (duration > 16) { // Longer than one frame (16.67ms)
      console.warn(`${componentName} took ${duration.toFixed(2)}ms to render`)
    }
  }
}

// Image loading optimization
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

// Bundle size monitoring
export const logBundleInfo = () => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log('Bundle size monitoring enabled')
    // Add bundle analysis in development
  }
} 