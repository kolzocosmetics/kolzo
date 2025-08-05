import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

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
  selectedCategory: string
}

const LuxuryChatbot = () => {
  const [state, setState] = useState<ChatbotState>({
    isOpen: false,
    isMinimized: false,
    currentFlow: null,
    userEmail: '',
    selectedCategory: ''
  })
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Welcome to KOLZO 💎\nYour luxury fashion concierge is here to help!\n\nWhat would you like to know about?',
      timestamp: new Date(),
      buttons: [
        { text: '🛍️ Browse Products', action: 'inventory' },
        { text: '📏 Size Guide', action: 'size_guide' },
        { text: '❓ FAQ & Help', action: 'faq' },
        { text: '💬 WhatsApp Support', action: 'whatsapp' },
        { text: '🏢 About KOLZO', action: 'about' }
      ]
    }
  ])
  
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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

  const handleButtonClick = async (action: string) => {
    switch (action) {
      case 'inventory':
        setState(prev => ({ ...prev, currentFlow: 'inventory' }))
        await simulateTyping(() => {
          addMessage(
            '🛍️ **Browse Our Collections**\n\n' +
            'Discover our luxury fashion collections:\n\n' +
            '• [👩 Women\'s Collection](https://kolzo.in/category/women)\n' +
            '• [👨 Men\'s Collection](https://kolzo.in/category/men)\n' +
            '• [💄 Beauty & Cosmetics](https://kolzo.in/category/women)\n' +
            '• [👜 Bags & Accessories](https://kolzo.in/category/women)\n\n' +
            'Need personalized recommendations? Chat with our stylist!',
            'bot',
            [
              { text: '💬 WhatsApp Stylist', action: 'whatsapp_stylist' },
              { text: '📏 Size Guide', action: 'size_guide' },
              { text: '🔙 Back', action: 'back_to_main' }
            ]
          )
        })
        break

      case 'size_guide':
        await simulateTyping(() => {
          addMessage(
            '📏 **Size Guide**\n\n' +
            'Find your perfect fit with our comprehensive size guides:\n\n' +
            '• [👗 Women\'s Clothing Sizes](https://kolzo.in/size-guide)\n' +
            '• [👔 Men\'s Clothing Sizes](https://kolzo.in/size-guide)\n' +
            '• [👠 Women\'s Shoes](https://kolzo.in/size-guide)\n' +
            '• [👟 Men\'s Shoes](https://kolzo.in/size-guide)\n' +
            '• [💍 Jewelry Sizing](https://kolzo.in/size-guide)\n\n' +
            'Still unsure? Our stylist can help you find the perfect size!',
            'bot',
            [
              { text: '💬 WhatsApp Stylist', action: 'whatsapp_stylist' },
              { text: '🔙 Back', action: 'back_to_main' }
            ]
          )
        })
        break

      case 'faq':
        setState(prev => ({ ...prev, currentFlow: 'faq' }))
        await simulateTyping(() => {
          addMessage(
            '❓ **Frequently Asked Questions**\n\n' +
            'Quick answers to common questions:\n\n' +
            '• [📦 Returns & Exchanges](https://kolzo.in/care-repair)\n' +
            '• [🚚 Shipping & Delivery](https://kolzo.in/care-repair)\n' +
            '• [💳 Payment Methods](https://kolzo.in/care-repair)\n' +
            '• [📏 Size Guide](https://kolzo.in/size-guide)\n' +
            '• [📞 Contact Support](https://kolzo.in/care-repair)\n\n' +
            'Can\'t find what you\'re looking for? Chat with us!',
            'bot',
            [
              { text: '💬 WhatsApp Support', action: 'whatsapp' },
              { text: '🔙 Back', action: 'back_to_main' }
            ]
          )
        })
        break

      case 'about':
        await simulateTyping(() => {
          addMessage(
            '🏢 **About KOLZO**\n\n' +
            'KOLZO is India\'s premier luxury fashion destination, curating the finest collections from around the world.\n\n' +
            '**Our Story:**\n' +
            'Founded with a vision to bring luxury fashion to every Indian home, KOLZO combines global trends with local sensibilities.\n\n' +
            '**What We Offer:**\n' +
            '• Curated luxury collections\n' +
            '• Expert styling advice\n' +
            '• Premium customer service\n' +
            '• Authentic products\n\n' +
            '**Learn More:**\n' +
            '• [📖 Our Story](https://kolzo.in/about)\n' +
            '• [🌱 Sustainability](https://kolzo.in/sustainability)\n' +
            '• [💎 Luxury Promise](https://kolzo.in/about)\n\n' +
            'Ready to experience luxury? Chat with our team!',
            'bot',
            [
              { text: '💬 WhatsApp Team', action: 'whatsapp' },
              { text: '🛍️ Browse Collections', action: 'inventory' },
              { text: '🔙 Back', action: 'back_to_main' }
            ]
          )
        })
        break

      case 'whatsapp':
        window.open('https://wa.me/919097999898?text=Hi! I need help with KOLZO.', '_blank')
        break

      case 'whatsapp_stylist':
        window.open('https://wa.me/919097999898?text=Hi! I\'d like to speak with a KOLZO stylist for personalized recommendations.', '_blank')
        break

      case 'back_to_main':
        setState(prev => ({ 
          ...prev, 
          currentFlow: null, 
          selectedCategory: '',
          userEmail: ''
        }))
        await simulateTyping(() => {
          addMessage(
            'Welcome to KOLZO 💎\nYour luxury fashion concierge is here to help!\n\nWhat would you like to know about?',
            'bot',
            [
              { text: '🛍️ Browse Products', action: 'inventory' },
              { text: '📏 Size Guide', action: 'size_guide' },
              { text: '❓ FAQ & Help', action: 'faq' },
              { text: '💬 WhatsApp Support', action: 'whatsapp' },
              { text: '🏢 About KOLZO', action: 'about' }
            ]
          )
        })
        break
    }
  }

  const handleUserInput = async (input: string) => {
    addMessage(input, 'user')
    
    // Handle general text input
    await simulateTyping(() => {
      addMessage(
        'I understand you\'re asking about "' + input + '". Let me help you better!\n\n' +
        'For personalized assistance, I recommend chatting with our team on WhatsApp. They can provide detailed answers and help you find exactly what you\'re looking for.',
        'bot',
        [
          { text: '💬 WhatsApp Support', action: 'whatsapp' },
          { text: '🛍️ Browse Products', action: 'inventory' },
          { text: '🔙 Back to Main', action: 'back_to_main' }
        ]
      )
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      handleUserInput(e.currentTarget.value.trim())
      e.currentTarget.value = ''
    }
  }

  // Function to render clickable links in message content
  const renderMessageContent = (content: string) => {
    // Convert markdown-style links to clickable links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const parts = content.split(linkRegex)
    
    if (parts.length === 1) {
      // No links found, return as plain text
      return <span>{content}</span>
    }
    
    const elements: React.ReactElement[] = []
    for (let i = 0; i < parts.length; i += 3) {
      if (i + 2 < parts.length) {
        // Add text before link
        if (parts[i]) {
          elements.push(<span key={`text-${i}`}>{parts[i]}</span>)
        }
        // Add clickable link
        const linkText = parts[i + 1]
        const linkUrl = parts[i + 2]
        elements.push(
          <a
            key={`link-${i}`}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
            style={{
              color: '#2563eb',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            {linkText}
          </a>
        )
      } else {
        // Add remaining text
        if (parts[i]) {
          elements.push(<span key={`text-${i}`}>{parts[i]}</span>)
        }
      }
    }
    
    return <>{elements}</>
  }

  return (
    <>
      {/* Chatbot Toggle Button - Minimal Design */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setState(prev => ({ ...prev, isOpen: !prev.isOpen, isMinimized: false }))}
        style={{
          backgroundColor: '#000000',
          color: '#ffffff',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: '300',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '48px',
          height: '48px',
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
            className="fixed bottom-20 right-6 z-40 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col"
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
              bottom: '80px',
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
                  <h3 className="font-light tracking-wide">KOLZO Concierge</h3>
                  <p className="text-xs text-gray-300">Luxury Fashion Assistant</p>
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
                        <p className="text-sm whitespace-pre-wrap">{renderMessageContent(message.content)}</p>
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
                          onClick={() => handleButtonClick(button.action)}
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

                {/* Input Area for General Questions */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Ask me anything..."
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
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default LuxuryChatbot 