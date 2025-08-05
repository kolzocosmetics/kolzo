import BrevoTest from '../components/BrevoTest'
import { NotificationProvider } from '../components/NotificationSystem'

const BrevoTestPage = () => {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light tracking-[0.2em] uppercase mb-4">
              Brevo Integration Test
            </h1>
            <p className="text-gray-600 font-light tracking-wide">
              Test your Brevo newsletter integration
            </p>
          </div>
          
          <BrevoTest />
          
          <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-light tracking-[0.2em] uppercase mb-4">
              Setup Instructions
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>1. Get your API key from Brevo dashboard</p>
              <p>2. Create a contact list and note the List ID</p>
              <p>3. Create a .env file with your credentials</p>
              <p>4. Test the integration using the form above</p>
              <p>5. Check your Brevo dashboard to verify contacts are added</p>
            </div>
          </div>
        </div>
      </div>
    </NotificationProvider>
  )
}

export default BrevoTestPage 