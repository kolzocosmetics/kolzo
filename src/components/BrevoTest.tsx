import { useState } from 'react'
import { addToNewsletter, checkIfRegistered } from '../utils/brevo'
import { useNotifications } from './NotificationSystem'

const BrevoTest = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState<string>('')
  const { addNotification } = useNotifications()

  const testApiConnection = async () => {
    setIsLoading(true)
    setApiStatus('Testing API connection...')
    
    try {
      // Test with a dummy email to check if API key is working
      const response = await checkIfRegistered('test@example.com')
      console.log('API Test Response:', response)
      
      if (response.success !== undefined) {
        setApiStatus('✅ API connection successful!')
        addNotification({
          type: 'success',
          title: 'API Test',
          message: 'Brevo API connection is working',
          duration: 5000
        })
      } else {
        setApiStatus('❌ API connection failed')
        addNotification({
          type: 'error',
          title: 'API Test',
          message: 'Brevo API connection failed',
          duration: 5000
        })
      }
    } catch (error: any) {
      console.error('API Test Error:', error)
      setApiStatus(`❌ API Error: ${error.message}`)
      addNotification({
        type: 'error',
        title: 'API Test Error',
        message: error.message || 'Unknown error',
        duration: 5000
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testNewsletterSubscription = async () => {
    if (!email) {
      addNotification({
        type: 'error',
        title: 'Test Error',
        message: 'Please enter an email address',
        duration: 3000
      })
      return
    }

    setIsLoading(true)
    
    try {
      console.log('Testing newsletter subscription for:', email)
      const response = await addToNewsletter({
        email,
        source: 'test',
        consent: true
      })
      
      console.log('Newsletter Test Response:', response)
      
      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Newsletter Test',
          message: 'Successfully subscribed to newsletter!',
          duration: 5000
        })
      } else {
        addNotification({
          type: response.isAlreadyRegistered ? 'info' : 'error',
          title: 'Newsletter Test',
          message: response.message,
          duration: 5000
        })
      }
    } catch (error: any) {
      console.error('Newsletter Test Error:', error)
      addNotification({
        type: 'error',
        title: 'Newsletter Test Error',
        message: error.message || 'Unknown error',
        duration: 5000
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-light mb-6 text-center">Brevo API Test</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">API Connection Test</h3>
          <button
            onClick={testApiConnection}
            disabled={isLoading}
            className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Testing...' : 'Test API Connection'}
          </button>
          {apiStatus && (
            <p className="mt-2 text-sm text-gray-600">{apiStatus}</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Newsletter Subscription Test</h3>
          <input
            type="email"
            placeholder="Enter test email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black mb-3"
          />
          <button
            onClick={testNewsletterSubscription}
            disabled={isLoading || !email}
            className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Testing...' : 'Test Newsletter Subscription'}
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Environment Variables:</h4>
          <div className="text-sm space-y-1">
            <p>API Key: {import.meta.env.VITE_BREVO_API_KEY ? '✅ Set' : '❌ Not Set'}</p>
            <p>List ID: {import.meta.env.VITE_BREVO_LIST_ID || 'Not Set'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrevoTest 