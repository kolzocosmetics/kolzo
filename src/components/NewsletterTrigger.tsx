import { useEffect, useState } from 'react'
import NewsletterPopup from './NewsletterPopup'

interface NewsletterTriggerProps {
  triggerType: 'exit-intent' | 'scroll' | 'time-delay' | 'manual'
  delay?: number // in milliseconds
  scrollPercentage?: number // percentage of page scrolled
  showOnce?: boolean
  source?: 'homepage' | 'product' | 'checkout' | 'exit-intent'
}

const NewsletterTrigger = ({ 
  triggerType, 
  delay = 30000, // 30 seconds default
  scrollPercentage = 70, // 70% scroll default
  showOnce = true,
  source = 'homepage'
}: NewsletterTriggerProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  // Check if popup has been shown before (localStorage)
  const getPopupShownKey = () => `newsletter-popup-shown-${triggerType}-${source}`

  const hasShownBefore = () => {
    if (!showOnce) return false
    return localStorage.getItem(getPopupShownKey()) === 'true'
  }

  const markAsShown = () => {
    if (showOnce) {
      localStorage.setItem(getPopupShownKey(), 'true')
    }
    setHasShown(true)
  }

  const showPopup = () => {
    if (hasShown || hasShownBefore()) return
    
    // Check if user has already subscribed (check localStorage for recent subscription)
    const recentSubscription = localStorage.getItem('kolzo-newsletter-subscribed')
    if (recentSubscription) {
      const subscriptionTime = parseInt(recentSubscription)
      const now = Date.now()
      // If subscribed within last 24 hours, don't show popup
      if (now - subscriptionTime < 24 * 60 * 60 * 1000) {
        return
      }
    }
    
    setIsPopupOpen(true)
    markAsShown()
  }

  // Exit intent detection
  useEffect(() => {
    if (triggerType !== 'exit-intent') return

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        showPopup()
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [triggerType])

  // Scroll detection
  useEffect(() => {
    if (triggerType !== 'scroll') return

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100

      if (scrollPercent >= scrollPercentage) {
        showPopup()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [triggerType, scrollPercentage])

  // Time delay
  useEffect(() => {
    if (triggerType !== 'time-delay') return

    const timer = setTimeout(() => {
      showPopup()
    }, delay)

    return () => clearTimeout(timer)
  }, [triggerType, delay])

  // Manual trigger (for testing)
  useEffect(() => {
    if (triggerType === 'manual') {
      // This can be triggered by a button or other event
      const handleManualTrigger = () => {
        showPopup()
      }

      // Example: trigger on button click with data attribute
      const triggerButton = document.querySelector('[data-newsletter-trigger]')
      if (triggerButton) {
        triggerButton.addEventListener('click', handleManualTrigger)
        return () => triggerButton.removeEventListener('click', handleManualTrigger)
      }
    }
  }, [triggerType])

  return (
    <NewsletterPopup
      isOpen={isPopupOpen}
      onClose={() => setIsPopupOpen(false)}
      source={source}
    />
  )
}

export default NewsletterTrigger 