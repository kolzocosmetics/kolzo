import { useEffect } from 'react'

const FAQs = () => {
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
      <section className="relative h-[40vh] overflow-hidden">
        <div className="absolute inset-0 bg-gray-100"></div>
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center px-6">
            <h1 className="text-4xl md:text-6xl font-light tracking-[0.2em] uppercase mb-6">
              FAQs
            </h1>
            <p className="text-lg font-light tracking-wide max-w-2xl mx-auto">
              Frequently asked questions about Kolzo products and services
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 p-8">
              <h3 className="text-lg font-light tracking-wide mb-4">
                {faq.question}
              </h3>
              <p className="text-gray-600 font-light tracking-wide leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
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
        </div>
      </div>
    </div>
  )
}

export default FAQs 