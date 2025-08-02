import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const FAQs = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0)
  }, [])

  const faqs = [
    {
      question: "What is Kolzo's return policy?",
      answer: "We accept returns within 30 days of purchase for items in original condition. Please contact us via Instagram for return authorization."
    },
    {
      question: "How can I track my order?",
      answer: "Order tracking information is sent via email once your order ships. For immediate assistance, please contact us via Instagram."
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we ship to select countries. Please check our Instagram for the most up-to-date shipping information."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and Apple Pay for secure transactions."
    },
    {
      question: "How do I care for my Kolzo products?",
      answer: "Each product comes with care instructions. For specific care questions, please refer to our product pages or contact us via Instagram."
    },
    {
      question: "Are your products cruelty-free?",
      answer: "Yes, all Kolzo products are cruelty-free and we are committed to ethical beauty practices."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
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
              FAQs
            </h1>
            <p className="text-lg font-light tracking-wide max-w-2xl mx-auto">
              Frequently asked questions about Kolzo products and services
            </p>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + (index * 0.1) }}
            >
              <button
                className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-all duration-300"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <h3 className="text-lg font-light tracking-wide">
                  {faq.question}
                </h3>
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${
                    openFaq === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openFaq === index && (
                <motion.div
                  className="px-8 pb-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-600 font-light tracking-wide leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <p className="text-gray-600 font-light tracking-wide mb-6">
            Still have questions? Contact us via Instagram
          </p>
          <a
            href="https://www.instagram.com/kolzocosmetics"
            target="_blank"
            rel="noopener noreferrer"
                            className="inline-block bg-transparent text-black border border-gray-400 px-8 py-4 text-sm font-light tracking-[0.2em] uppercase hover:bg-gray-100 transition-all duration-500"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </div>
  )
}

export default FAQs 