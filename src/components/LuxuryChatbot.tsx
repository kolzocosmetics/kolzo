import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { addToNewsletter, validateEmailFormat } from '../utils/brevo'
import { useNotifications } from './NotificationSystem'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  buttons?: Array<{
    text: string
    action: string
    value?: string
  }>
}

interface ChatbotState {
  isOpen: boolean
  isMinimized: boolean
  currentFlow: string | null
  userEmail: string
  orderId: string
  selectedGender: string
  selectedCategory: string
}

const LuxuryChatbot = () => {
  const [state, setState] = useState<ChatbotState>({
    isOpen: false,
    isMinimized: false,
    currentFlow: null,
    userEmail: '',
    orderId: '',
    selectedGender: '',
    selectedCategory: ''
  })
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Welcome to KOLZO 💫\nYour luxury fashion assistant is here. What can I help you with today?',
      timestamp: new Date(),
      buttons: [
        { text: '🛍️ Product Guidance', action: 'product_guidance' },
        { text: '❓ FAQ & Help', action: 'faq' },
        { text: '📧 Newsletter', action: 'newsletter' },
        { text: '📦 Order Tracking', action: 'order_tracking' },
        { text: '💬 WhatsApp Support', action: 'whatsapp' }
      ]
    }
  ])
  
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { addNotification } = useNotifications()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (content: string, type: 'user' | 'bot', buttons?: Array<{ text: string; action: string; value?: string }>) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      buttons
    }
    setMessages(prev => [...prev, newMessage])
  }

  const simulateTyping = async (callback: () => void) => {
    setIsTyping(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsTyping(false)
    callback()
  }

  const handleButtonClick = async (action: string, value?: string) => {
    switch (action) {
      case 'product_guidance':
        setState(prev => ({ ...prev, currentFlow: 'product_guidance' }))
        await simulateTyping(() => {
          addMessage(
            'Great! Are you shopping for 👩 Women or 👨 Men?',
            'bot',
            [
              { text: '👩 Women', action: 'select_gender', value: 'women' },
              { text: '👨 Men', action: 'select_gender', value: 'men' },
              { text: '🔙 Back', action: 'back_to_main' }
            ]
          )
        })
        break

      case 'select_gender':
        setState(prev => ({ ...prev, selectedGender: value || '' }))
        await simulateTyping(() => {
          const categories = value === 'women' 
            ? ['💄 Lipstick', '👜 Handbag', '👗 Dress', '👠 Shoes', '💍 Jewelry']
            : ['👔 Shirt', '👖 Pants', '👟 Shoes', '💼 Wallet', '⌚ Watch']
          
          addMessage(
            `Perfect! What type of item are you interested in?`,
            'bot',
            [
              ...categories.map(cat => ({ text: cat, action: 'select_category', value: cat })),
              { text: '🔙 Back', action: 'back_to_gender' }
            ]
          )
        })
        break

      case 'select_category':
        setState(prev => ({ ...prev, selectedCategory: value || '' }))
        await simulateTyping(() => {
          addMessage(
            `I've found some amazing ${value} for you! Would you like to view our bestsellers?`,
            'bot',
            [
              { text: '✅ Yes, show me!', action: 'redirect_to_collection' },
              { text: '💬 Chat with stylist', action: 'whatsapp' },
              { text: '🔙 Back', action: 'back_to_category' }
            ]
          )
        })
        break

      case 'redirect_to_collection':
        window.location.href = `/${state.selectedGender}/${state.selectedCategory.toLowerCase().replace(/[^\w]/g, '')}`
        break

      case 'faq':
        setState(prev => ({ ...prev, currentFlow: 'faq' }))
        await simulateTyping(() => {
          addMessage(
            'I can help with common questions! What would you like to know?\n\n' +
            '• Returns & Exchanges\n' +
            '• Shipping & Delivery\n' +
            '• Size Guide\n' +
            '• Payment Methods\n' +
            '• Contact Information',
            'bot',
            [
              { text: '📦 Returns Policy', action: 'faq_returns' },
              { text: '🚚 Shipping Info', action: 'faq_shipping' },
              { text: '📏 Size Guide', action: 'faq_size' },
              { text: '💳 Payment', action: 'faq_payment' },
              { text: '📞 Contact', action: 'faq_contact' },
              { text: '🔙 Back', action: 'back_to_main' }
            ]
          )
        })
        break

      case 'faq_returns':
        await simulateTyping(() => {
          addMessage(
            '🔄 **KOLZO Returns Policy**\n\n' +
            '• Returns accepted within 7 days of delivery\n' +
            '• Items must be unworn, unwashed, and in original packaging\n' +
            '• Free return shipping for orders above ₹5000\n' +
            '• Refunds processed within 3-5 business days\n\n' +
            '[📋 Read Full Policy](https://kolzo.in/returns)',
            'bot',
            [
              { text: '🔙 Back to FAQ', action: 'faq' },
              { text: '🏠 Main Menu', action: 'back_to_main' }
            ]
          )
        })
        break

      case 'faq_shipping':
        await simulateTyping(() => {
          addMessage(
            '🚚 **Shipping Information**\n\n' +
            '• Free shipping on orders above ₹3000\n' +
            '• Standard delivery: 3-5 business days\n' +
            '• Express delivery: 1-2 business days (+₹200)\n' +
            '• International shipping available\n' +
            '• Real-time tracking provided',
            'bot',
            [
              { text: '🔙 Back to FAQ', action: 'faq' },
              { text: '🏠 Main Menu', action: 'back_to_main' }
            ]
          )
        })
        break

      case 'faq_size':
        window.location.href = '/size-guide'
        break

      case 'faq_payment':
        await simulateTyping(() => {
          addMessage(
            '💳 **Payment Methods**\n\n' +
            '• Credit/Debit Cards (Visa, MasterCard, Amex)\n' +
            '• UPI (Google Pay, PhonePe, Paytm)\n' +
            '• Net Banking\n' +
            '• EMI available on orders above ₹3000\n' +
            '• Cash on Delivery (limited areas)',
            'bot',
            [
              { text: '🔙 Back to FAQ', action: 'faq' },
              { text: '🏠 Main Menu', action: 'back_to_main' }
            ]
          )
        })
        break

      case 'faq_contact':
        await simulateTyping(() => {
          addMessage(
            '📞 **Contact Information**\n\n' +
            '• WhatsApp: +91 9097999898\n' +
            '• Email: hello@kolzo.in\n' +
            '• Customer Service: Mon-Sat, 9 AM - 8 PM\n' +
            '• Live Chat: Available on website\n\n' +
            'Need immediate help? Click WhatsApp below!',
            'bot',
            [
              { text: '💬 WhatsApp Support', action: 'whatsapp' },
              { text: '🔙 Back to FAQ', action: 'faq' },
              { text: '🏠 Main Menu', action: 'back_to_main' }
            ]
          )
        })
        break

      case 'newsletter':
        setState(prev => ({ ...prev, currentFlow: 'newsletter' }))
        await simulateTyping(() => {
          addMessage(
            'Want exclusive early access to new drops and VIP events? 💎\n\n' +
            'Join our luxury community for:\n' +
            '• Early access to new collections\n' +
            '• Exclusive member-only sales\n' +
            '• VIP event invitations\n' +
            '• Personalized style recommendations',
            'bot',
            [
              { text: '✅ Yes, I want access!', action: 'newsletter_email' },
              { text: '🔙 Back', action: 'back_to_main' }
            ]
          )
        })
        break

      case 'newsletter_email':
        await simulateTyping(() => {
          addMessage(
            'Perfect! Please enter your email address to join our exclusive community:',
            'bot',
            [
              { text: '🔙 Back', action: 'newsletter' }
            ]
          )
        })
        break

      case 'order_tracking':
        setState(prev => ({ ...prev, currentFlow: 'order_tracking' }))
        await simulateTyping(() => {
          addMessage(
            'I can help you track your order! Please enter your order ID or email address:',
            'bot',
            [
              { text: '🔙 Back', action: 'back_to_main' }
            ]
          )
        })
        break

      case 'whatsapp':
        window.open('https://wa.me/919097999898?text=Hi! I need help with KOLZO.', '_blank')
        break

      case 'back_to_main':
        setState(prev => ({ 
          ...prev, 
          currentFlow: null, 
          selectedGender: '', 
          selectedCategory: '',
          userEmail: '',
          orderId: ''
        }))
        await simulateTyping(() => {
          addMessage(
            'Welcome to KOLZO 💫\nYour luxury fashion assistant is here. What can I help you with today?',
            'bot',
            [
              { text: '🛍️ Product Guidance', action: 'product_guidance' },
              { text: '❓ FAQ & Help', action: 'faq' },
              { text: '📧 Newsletter', action: 'newsletter' },
              { text: '📦 Order Tracking', action: 'order_tracking' },
              { text: '💬 WhatsApp Support', action: 'whatsapp' }
            ]
          )
        })
        break

      case 'back_to_gender':
        setState(prev => ({ ...prev, selectedCategory: '' }))
        await simulateTyping(() => {
          addMessage(
            'Great! Are you shopping for 👩 Women or 👨 Men?',
            'bot',
            [
              { text: '👩 Women', action: 'select_gender', value: 'women' },
              { text: '👨 Men', action: 'select_gender', value: 'men' },
              { text: '🔙 Back', action: 'back_to_main' }
            ]
          )
        })
        break

      case 'back_to_category':
        setState(prev => ({ ...prev, selectedCategory: '' }))
        await simulateTyping(() => {
          const categories = state.selectedGender === 'women' 
            ? ['💄 Lipstick', '👜 Handbag', '👗 Dress', '👠 Shoes', '💍 Jewelry']
            : ['👔 Shirt', '👖 Pants', '👟 Shoes', '💼 Wallet', '⌚ Watch']
          
          addMessage(
            `Perfect! What type of item are you interested in?`,
            'bot',
            [
              ...categories.map(cat => ({ text: cat, action: 'select_category', value: cat })),
              { text: '🔙 Back', action: 'back_to_gender' }
            ]
          )
        })
        break
    }
  }

  const handleUserInput = async (input: string) => {
    addMessage(input, 'user')
    
    // Handle different flows based on current state
    if (state.currentFlow === 'newsletter') {
      if (validateEmailFormat(input)) {
        setState(prev => ({ ...prev, userEmail: input }))
        await simulateTyping(async () => {
          try {
            const response = await addToNewsletter({
              email: input,
              source: 'chatbot',
              consent: true
            })
            
            if (response.success) {
              addMessage(
                '🎉 Welcome to the KOLZO family! You\'re now part of our exclusive community.\n\n' +
                'Check your email for a special welcome gift and stay tuned for luxury updates!',
                'bot',
                [
                  { text: '🏠 Main Menu', action: 'back_to_main' }
                ]
              )
              addNotification({
                type: 'success',
                title: 'Newsletter Subscription',
                message: 'Successfully subscribed to KOLZO newsletter!',
                duration: 5000
              })
            } else {
              addMessage(
                response.message || 'Something went wrong. Please try again.',
                'bot',
                [
                  { text: '🔙 Back', action: 'newsletter' }
                ]
              )
            }
          } catch (error) {
            addMessage(
              'Sorry, there was an error. Please try again or contact our support team.',
              'bot',
              [
                { text: '🔙 Back', action: 'newsletter' }
              ]
            )
          }
        })
      } else {
        await simulateTyping(() => {
          addMessage(
            'Please enter a valid email address:',
            'bot',
            [
              { text: '🔙 Back', action: 'newsletter' }
            ]
          )
        })
      }
    } else if (state.currentFlow === 'order_tracking') {
      setState(prev => ({ ...prev, orderId: input }))
      await simulateTyping(() => {
        addMessage(
          `I'm looking up your order "${input}"...\n\n` +
          'For detailed tracking, please visit our order tracking page or contact our support team.',
          'bot',
          [
            { text: '📦 Track Order', action: 'redirect_tracking' },
            { text: '💬 WhatsApp Support', action: 'whatsapp' },
            { text: '🔙 Back', action: 'back_to_main' }
          ]
        )
      })
    } else {
      // Handle general text input
      await simulateTyping(() => {
        addMessage(
          'I understand you\'re asking about "' + input + '". Let me help you better!\n\n' +
          'Please use the buttons below or type "help" for assistance.',
          'bot',
          [
            { text: '🛍️ Product Guidance', action: 'product_guidance' },
            { text: '❓ FAQ & Help', action: 'faq' },
            { text: '💬 WhatsApp Support', action: 'whatsapp' },
            { text: '🔙 Back to Main', action: 'back_to_main' }
          ]
        )
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      handleUserInput(e.currentTarget.value.trim())
      e.currentTarget.value = ''
    }
  }

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-black text-white rounded-full shadow-2xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setState(prev => ({ ...prev, isOpen: !prev.isOpen, isMinimized: false }))}
        style={{
          backgroundColor: '#000000',
          color: '#ffffff',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '24px',
          fontWeight: '300',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '64px',
          height: '64px',
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 50
        }}
      >
        {state.isOpen ? '✕' : '💬'}
      </motion.button>

      {/* Chatbot Interface */}
      <AnimatePresence>
        {state.isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              width: '384px',
              height: '500px',
              position: 'fixed',
              bottom: '96px',
              right: '24px',
              zIndex: 40
            }}
          >
            {/* Header */}
            <div className="bg-black text-white p-4 rounded-t-2xl flex items-center justify-between"
                 style={{
                   backgroundColor: '#000000',
                   color: '#ffffff',
                   padding: '16px',
                   borderTopLeftRadius: '16px',
                   borderTopRightRadius: '16px',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'space-between'
                 }}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-black text-lg">💎</span>
                </div>
                <div>
                  <h3 className="font-light tracking-wide">KOLZO Assistant</h3>
                  <p className="text-xs text-gray-300">Luxury Fashion Concierge</p>
                </div>
              </div>
              <button
                onClick={() => setState(prev => ({ ...prev, isMinimized: !prev.isMinimized }))}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {state.isMinimized ? '⬆️' : '⬇️'}
              </button>
            </div>

            {/* Chat Messages */}
            {!state.isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ padding: '16px' }}>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                        style={{
                          maxWidth: '80%',
                          padding: '12px',
                          borderRadius: '16px',
                          backgroundColor: message.type === 'user' ? '#000000' : '#f3f4f6',
                          color: message.type === 'user' ? '#ffffff' : '#1f2937'
                        }}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      className="flex justify-start"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Buttons */}
                {messages.length > 0 && messages[messages.length - 1].buttons && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-2">
                      {messages[messages.length - 1].buttons?.map((button, index) => (
                        <motion.button
                          key={index}
                          className="p-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleButtonClick(button.action, button.value)}
                          style={{
                            padding: '8px',
                            fontSize: '12px',
                            backgroundColor: '#f3f4f6',
                            color: '#1f2937',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {button.text}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                {(state.currentFlow === 'newsletter' || state.currentFlow === 'order_tracking') && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder={
                          state.currentFlow === 'newsletter' 
                            ? 'Enter your email...' 
                            : 'Enter order ID or email...'
                        }
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        onKeyPress={handleKeyPress}
                        style={{
                          flex: 1,
                          padding: '8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          outline: 'none',
                          fontSize: '14px'
                        }}
                      />
                      <motion.button
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          const input = document.querySelector('input') as HTMLInputElement
                          if (input?.value.trim()) {
                            handleUserInput(input.value.trim())
                            input.value = ''
                          }
                        }}
                        style={{
                          backgroundColor: '#000000',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          padding: '8px 16px',
                          fontSize: '14px',
                          fontWeight: '300'
                        }}
                      >
                        Send
                      </motion.button>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default LuxuryChatbot 