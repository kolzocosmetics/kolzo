import { useState } from 'react'
import { addToNewsletter, getNewsletterStats, validateEmailFormat, checkIfRegistered } from '../utils/brevo'
import { useNotifications } from './NotificationSystem'

const BrevoTest = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const { addNotification } = useNotifications()

  const handleTestSubscription = async () => {
    if (!validateEmailFormat(email)) {
      addNotification({
        type: 'error',
        title: 'Invalid Email',
        message: 'Please enter a valid email address',
        duration: 3000
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await addToNewsletter({
        email,
        firstName: 'Test',
        lastName: 'User',
        source: 'test',
        consent: true
      })

      if (result.success) {
        addNotification({
          type: 'success',
          title: result.isNewSubscription ? 'Test Successful!' : 'Test Updated!',
          message: result.isNewSubscription 
            ? 'Contact added to Brevo successfully'
            : 'Contact updated in Brevo successfully',
          duration: 5000
        })
        setEmail('')
      } else if (result.isAlreadyRegistered) {
        addNotification({
          type: 'info',
          title: 'Already Registered',
          message: result.message || 'This email is already registered',
          duration: 5000
        })
      } else {
        addNotification({
          type: 'error',
          title: 'Test Failed',
          message: result.message || 'Failed to add contact',
          duration: 5000
        })
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Test Error',
        message: error.message || 'An error occurred',
        duration: 5000
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckRegistration = async () => {
    if (!validateEmailFormat(email)) {
      addNotification({
        type: 'error',
        title: 'Invalid Email',
        message: 'Please enter a valid email address',
        duration: 3000
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await checkIfRegistered(email)
      
      if (result.success) {
        if (result.exists) {
          addNotification({
            type: 'info',
            title: 'Already Registered',
            message: 'This email is already registered in our newsletter',
            duration: 5000
          })
        } else {
          addNotification({
            type: 'success',
            title: 'Not Registered',
            message: 'This email is not yet registered. You can subscribe!',
            duration: 5000
          })
        }
      } else {
        addNotification({
          type: 'error',
          title: 'Check Failed',
          message: result.message || 'Failed to check registration status',
          duration: 5000
        })
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Check Error',
        message: error.message || 'An error occurred',
        duration: 5000
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetStats = async () => {
    setIsLoading(true)
    try {
      const result = await getNewsletterStats()
      if (result.success) {
        setStats(result.data)
        addNotification({
          type: 'success',
          title: 'Stats Retrieved',
          message: 'Newsletter statistics loaded successfully',
          duration: 3000
        })
      } else {
        addNotification({
          type: 'error',
          title: 'Stats Error',
          message: result.message || 'Failed to get statistics',
          duration: 5000
        })
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Stats Error',
        message: error.message || 'An error occurred',
        duration: 5000
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-light tracking-[0.2em] uppercase mb-4">
        Brevo Integration Test
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-light tracking-wide text-gray-700 mb-2">
            Test Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter test email"
            className="w-full px-4 py-3 border border-gray-300 focus:border-black transition-all duration-300 font-light tracking-wide"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleTestSubscription}
            disabled={isLoading || !email}
            className="bg-black text-white py-3 font-light tracking-[0.2em] uppercase transition-all duration-500 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Testing...' : 'Test Subscription'}
          </button>

          <button
            onClick={handleCheckRegistration}
            disabled={isLoading || !email}
            className="bg-gray-200 text-black py-3 font-light tracking-[0.2em] uppercase transition-all duration-500 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Checking...' : 'Check Status'}
          </button>
        </div>

        <button
          onClick={handleGetStats}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 font-light tracking-[0.2em] uppercase transition-all duration-500 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : 'Get Stats'}
        </button>

        {stats && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Newsletter Statistics:</h4>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(stats, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default BrevoTest 