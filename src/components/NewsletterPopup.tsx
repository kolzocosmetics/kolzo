import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { addToNewsletter, validateEmailFormat, sendWelcomeEmail } from '../utils/brevo'
import { useNotifications } from './NotificationSystem'

interface NewsletterPopupProps {
  isOpen: boolean
  onClose: () => void
  source?: 'homepage' | 'product' | 'checkout' | 'exit-intent'
}

const NewsletterPopup = ({ isOpen, onClose, source = 'homepage' }: NewsletterPopupProps) => {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { addNotification } = useNotifications()

  // Close popup when Escape key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validate email format
    if (!validateEmailFormat(email)) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    try {
      const response = await addToNewsletter({
        email,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        source,
        consent: true
      })

      if (response.success) {
        // Send welcome email only for new subscriptions
        if (response.isNewSubscription) {
          try {
            await sendWelcomeEmail(email, firstName)
          } catch (welcomeError) {
            console.error('Failed to send welcome email:', welcomeError)
          }
        }
        
        // Mark as recently subscribed to prevent unwanted popups
        localStorage.setItem('kolzo-newsletter-subscribed', Date.now().toString())
        
        // Show appropriate notification
        addNotification({
          type: 'success',
          title: response.isNewSubscription ? 'Successfully Subscribed!' : 'Subscription Updated!',
          message: response.isNewSubscription 
            ? 'Welcome to the House of KOLZO. Check your email for exclusive updates.'
            : 'Your subscription preferences have been updated.',
          duration: 5000
        })
        
        // Close popup
        onClose()
      } else {
        setError(response.message || 'Failed to subscribe')
        addNotification({
          type: 'error',
          title: 'Subscription Failed',
          message: response.message || 'Failed to subscribe to newsletter',
          duration: 5000
        })
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to subscribe to newsletter'
      setError(errorMessage)
      addNotification({
        type: 'error',
        title: 'Subscription Failed',
        message: errorMessage,
        duration: 5000
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getPopupContent = () => {
    switch (source) {
      case 'product':
        return {
          title: 'Stay in the Loop',
          subtitle: 'Get notified when this item is back in stock or goes on sale',
          benefits: ['Back in stock alerts', 'Exclusive product launches', 'Limited time offers']
        }
      case 'checkout':
        return {
          title: 'Complete Your Experience',
          subtitle: 'Join our community for exclusive access and personalized recommendations',
          benefits: ['Personalized recommendations', 'Early access to sales', 'VIP event invitations']
        }
      case 'exit-intent':
        return {
          title: 'Don\'t Miss Out',
          subtitle: 'Join our exclusive community before you go',
          benefits: ['10% off your first order', 'Exclusive member benefits', 'Early access to collections']
        }
      default:
        return {
          title: 'Join the House of KOLZO',
          subtitle: 'Be the first to discover new collections and exclusive events',
          benefits: ['Early access to new collections', 'Exclusive event invitations', 'Personalized style recommendations']
        }
    }
  }

  const content = getPopupContent()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Popup */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="bg-white max-w-md w-full p-8 relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Content */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-light tracking-[0.2em] uppercase mb-4">
                  {content.title}
                </h2>
                <p className="text-gray-600 font-light tracking-wide mb-6">
                  {content.subtitle}
                </p>
                
                {/* Benefits */}
                <div className="space-y-3 mb-8">
                  {content.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-light tracking-wide text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black transition-all duration-300 font-light tracking-wide"
                    disabled={isLoading}
                  />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black transition-all duration-300 font-light tracking-wide"
                    disabled={isLoading}
                  />
                </div>
                
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black transition-all duration-300 font-light tracking-wide"
                  required
                  disabled={isLoading}
                />
                
                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
                
                <motion.button
                  type="submit"
                  className="w-full bg-black text-white py-4 font-light tracking-[0.2em] uppercase transition-all duration-500 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed relative z-10 block"
                  style={{
                    display: 'block',
                    visibility: 'visible',
                    opacity: isLoading ? 0.5 : 1,
                    position: 'relative',
                    zIndex: 10
                  }}
                  whileHover={!isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                  disabled={isLoading}
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </motion.button>
              </form>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 font-light tracking-wide">
                  By subscribing, you agree to our{' '}
                  <a href="#" className="underline hover:no-underline">privacy policy</a>
                  {' '}and{' '}
                  <a href="#" className="underline hover:no-underline">terms of service</a>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NewsletterPopup 