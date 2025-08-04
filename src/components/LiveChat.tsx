import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  type: 'text' | 'quick-reply' | 'faq'
}

interface QuickReply {
  text: string
  action: string
}

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll-based styling for chat button
  const [isScrolled, setIsScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const quickReplies: QuickReply[] = [
    { text: 'Order Status', action: 'order_status' },
    { text: 'Returns & Refunds', action: 'returns' },
    { text: 'Shipping Info', action: 'shipping' },
    { text: 'Product Questions', action: 'products' },
    { text: 'Contact Support', action: 'contact' }
  ]

  const faqResponses = {
    order_status: 'You can track your order by visiting your account page or contacting us via Instagram @kolzocosmetics with your order number.',
    returns: 'We accept returns within 30 days of purchase for items in original condition. Please contact us via Instagram for return authorization.',
    shipping: 'We offer free shipping on orders over ₹5,000. Standard delivery takes 3-5 business days. Express shipping is available for an additional fee.',
    products: 'All our products are crafted with premium materials and undergo strict quality control. Each product comes with detailed care instructions.',
    contact: 'You can reach our customer support team via Instagram @kolzocosmetics or email us at support@kolzo.in. We typically respond within 2 hours during business hours.'
  }

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      setTimeout(() => {
        addBotMessage('Hello! Welcome to Kolzo customer support. How can I help you today?', 'text')
      }, 500)
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const addUserMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    }
    setMessages(prev => [...prev, message])
  }

  const addBotMessage = (text: string, type: 'text' | 'quick-reply' | 'faq' = 'text') => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date(),
      type
    }
    setMessages(prev => [...prev, message])
  }

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    addUserMessage(text)
    setInputText('')
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false)
      const response = generateBotResponse(text.toLowerCase())
      addBotMessage(response)
    }, 1000 + Math.random() * 2000)
  }

  const handleQuickReply = (action: string) => {
    const quickReply = quickReplies.find(qr => qr.action === action)
    if (quickReply) {
      addUserMessage(quickReply.text)
      setIsTyping(true)

      setTimeout(() => {
        setIsTyping(false)
        const response = faqResponses[action as keyof typeof faqResponses] || 'I apologize, but I need more information to help you with that.'
        addBotMessage(response)
      }, 1000)
    }
  }

  const generateBotResponse = (text: string): string => {
    if (text.includes('order') || text.includes('track')) {
      return 'You can track your order by visiting your account page or contacting us via Instagram @kolzocosmetics with your order number.'
    } else if (text.includes('return') || text.includes('refund')) {
      return 'We accept returns within 30 days of purchase for items in original condition. Please contact us via Instagram for return authorization.'
    } else if (text.includes('ship') || text.includes('delivery')) {
      return 'We offer free shipping on orders over ₹5,000. Standard delivery takes 3-5 business days. Express shipping is available for an additional fee.'
    } else if (text.includes('price') || text.includes('cost')) {
      return 'Our pricing reflects the premium quality of our products. We offer competitive prices for luxury items and occasionally run special promotions.'
    } else if (text.includes('quality') || text.includes('material')) {
      return 'All our products are crafted with premium materials and undergo strict quality control. Each product comes with detailed care instructions.'
    } else if (text.includes('contact') || text.includes('help')) {
      return 'You can reach our customer support team via Instagram @kolzocosmetics or email us at support@kolzo.in. We typically respond within 2 hours during business hours.'
    } else {
      return 'Thank you for your message. For immediate assistance, please contact us via Instagram @kolzocosmetics or email support@kolzo.in. Our team will get back to you within 2 hours.'
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen)
          setHasInteracted(true)
        }}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center justify-center border-2 backdrop-blur-sm ${
          isScrolled 
            ? 'bg-white text-black border-black/20 hover:bg-gray-100 shadow-xl' 
            : 'bg-black text-white border-white/20 hover:bg-gray-800 shadow-2xl'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isScrolled ? { 
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)" 
        } : hasInteracted ? {} : {
          scale: [1, 1.05, 1],
          transition: {
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }
        }}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 z-40 flex flex-col"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="bg-black text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-light tracking-[0.2em] uppercase">Customer Support</h3>
                  <p className="text-xs text-gray-300">We're here to help</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs">Online</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</p>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Replies */}
              {messages.length === 1 && (
                <motion.div
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {quickReplies.map((reply) => (
                    <button
                      key={reply.action}
                      onClick={() => handleQuickReply(reply.action)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-full text-xs font-light transition-colors"
                    >
                      {reply.text}
                    </button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage(inputText)
                }}
                className="flex space-x-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className="bg-black text-white px-4 py-2 rounded-lg text-sm font-light tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default LiveChat 