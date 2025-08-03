import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface CheckoutStep {
  id: string
  title: string
  description: string
}

const Checkout = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  
  // Form data
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  })

  const steps: CheckoutStep[] = [
    {
      id: 'shipping',
      title: 'Shipping Information',
      description: 'Enter your delivery details'
    },
    {
      id: 'payment',
      title: 'Payment Method',
      description: 'Secure payment processing'
    },
    {
      id: 'review',
      title: 'Order Review',
      description: 'Review your order details'
    }
  ]

  // Mock cart data
  const cartItems = [
    {
      id: 'handbag-001',
      name: 'Kolzo Signature Shoulder Bag',
      price: 3200,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    },
    {
      id: 'lipstick-001',
      name: 'Kolzo Rouge Velvet Lipstick',
      price: 65,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2915&q=80'
    }
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 200 ? 0 : 25
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Navigate to success page
      navigate('/order-success')
    } catch (error) {
      console.error('Payment failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderShippingForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-light tracking-[0.2em] uppercase mb-2">
            First Name
          </label>
          <input
            type="text"
            value={shippingData.firstName}
            onChange={(e) => setShippingData({...shippingData, firstName: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black transition-all duration-300 font-light tracking-wide"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-light tracking-[0.2em] uppercase mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={shippingData.lastName}
            onChange={(e) => setShippingData({...shippingData, lastName: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black transition-all duration-300 font-light tracking-wide"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-light tracking-[0.2em] uppercase mb-2">
            Email
          </label>
          <input
            type="email"
            value={shippingData.email}
            onChange={(e) => setShippingData({...shippingData, email: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black transition-all duration-300 font-light tracking-wide"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-light tracking-[0.2em] uppercase mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={shippingData.phone}
            onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black transition-all duration-300 font-light tracking-wide"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-light tracking-[0.2em] uppercase mb-2">
          Address
        </label>
        <input
          type="text"
          value={shippingData.address}
          onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
          className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black transition-all duration-300 font-light tracking-wide"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-light tracking-[0.2em] uppercase mb-2">
            City
          </label>
          <input
            type="text"
            value={shippingData.city}
            onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black transition-all duration-300 font-light tracking-wide"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-light tracking-[0.2em] uppercase mb-2">
            State
          </label>
          <input
            type="text"
            value={shippingData.state}
            onChange={(e) => setShippingData({...shippingData, state: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black transition-all duration-300 font-light tracking-wide"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-light tracking-[0.2em] uppercase mb-2">
            ZIP Code
          </label>
          <input
            type="text"
            value={shippingData.zipCode}
            onChange={(e) => setShippingData({...shippingData, zipCode: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black transition-all duration-300 font-light tracking-wide"
            required
          />
        </div>
      </div>
    </div>
  )

  const renderPaymentForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-light tracking-[0.2em] uppercase mb-2">
          Card Number
        </label>
        <input
          type="text"
          value={paymentData.cardNumber}
          onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
          className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black transition-all duration-300 font-light tracking-wide"
          placeholder="1234 5678 9012 3456"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-light tracking-[0.2em] uppercase mb-2">
          Cardholder Name
        </label>
        <input
          type="text"
          value={paymentData.cardName}
          onChange={(e) => setPaymentData({...paymentData, cardName: e.target.value})}
          className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black transition-all duration-300 font-light tracking-wide"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-light tracking-[0.2em] uppercase mb-2">
            Expiry Date
          </label>
          <input
            type="text"
            value={paymentData.expiryDate}
            onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black transition-all duration-300 font-light tracking-wide"
            placeholder="MM/YY"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-light tracking-[0.2em] uppercase mb-2">
            CVV
          </label>
          <input
            type="text"
            value={paymentData.cvv}
            onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black transition-all duration-300 font-light tracking-wide"
            placeholder="123"
            required
          />
        </div>
      </div>
    </div>
  )

  const renderOrderReview = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-light tracking-[0.2em] uppercase mb-4">Order Summary</h3>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <img 
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-light tracking-wide">{item.name}</h4>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">${(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-light tracking-wide">Subtotal</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-light tracking-wide">Shipping</span>
            <span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-light tracking-wide">Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-medium pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderShippingForm()
      case 1:
        return renderPaymentForm()
      case 2:
        return renderOrderReview()
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <motion.section
        className="relative h-[40vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gray-100"></div>
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div
            className="text-center px-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl font-light tracking-[0.2em] uppercase mb-6">
              Checkout
            </h1>
            <p className="text-lg font-light tracking-wide max-w-2xl mx-auto">
              Complete your purchase securely
            </p>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Progress Steps */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-light ${
                  index <= currentStep ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-light tracking-[0.2em] uppercase">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-600 font-light tracking-wide">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-px mx-6 ${
                    index < currentStep ? 'bg-black' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step Content */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {renderCurrentStep()}
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          className="flex justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-8 py-4 border-2 border-gray-300 text-gray-600 font-light tracking-[0.2em] uppercase hover:border-black hover:text-black transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: currentStep === 0 ? 1 : 1.02 }}
            whileTap={{ scale: currentStep === 0 ? 1 : 0.98 }}
          >
            Previous
          </motion.button>
          
          {currentStep < steps.length - 1 ? (
            <motion.button
              onClick={handleNext}
              className="px-8 py-4 bg-black text-white font-light tracking-[0.2em] uppercase hover:bg-gray-800 transition-all duration-500"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Next
            </motion.button>
          ) : (
            <motion.button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8 py-4 bg-black text-white font-light tracking-[0.2em] uppercase hover:bg-gray-800 transition-all duration-500 disabled:opacity-50"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Complete Order'
              )}
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Checkout 