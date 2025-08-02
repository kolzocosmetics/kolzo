import { motion } from 'framer-motion'
import { useState } from 'react'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder for newsletter signup
    console.log('Newsletter signup:', email)
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setEmail('')
    }, 3000)
  }

  return (
    <section className="relative py-32 bg-black text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Luxury fashion background"
          className="w-full h-full object-cover object-center opacity-20"
        />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          viewport={{ once: true }}
        >
          {/* Decorative Elements */}
          <div className="flex items-center justify-center mb-12">
            <div className="w-16 h-px bg-white/30 mr-6"></div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.4em] uppercase" style={{ fontFamily: 'Playfair Display, serif' }}>
              Join the House
            </h2>
            <div className="w-16 h-px bg-white/30 ml-6"></div>
          </div>
          
          <p className="text-white/80 text-lg md:text-xl font-light tracking-wide mb-16 max-w-3xl mx-auto leading-relaxed">
            Be the first to discover new collections, exclusive events, and the latest news from the House of Kolzo. 
            Join our community of discerning individuals who appreciate timeless elegance.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-500 font-light tracking-wide rounded-none"
              required
              disabled={isSubmitted}
            />
            <motion.button
              type="submit"
              className={`px-8 py-4 bg-transparent text-white font-light tracking-[0.2em] uppercase transition-all duration-500 border border-white hover:bg-white/10 hover:text-white ${
                isSubmitted 
                  ? 'bg-green-500 text-white cursor-not-allowed border-green-500' 
                  : ''
              }`}
              whileHover={!isSubmitted ? { scale: 1.02, y: -2 } : {}}
              whileTap={!isSubmitted ? { scale: 0.98 } : {}}
              disabled={isSubmitted}
              style={{ color: isSubmitted ? '#ffffff' : '#ffffff' }}
            >
              {isSubmitted ? 'Subscribed!' : 'Subscribe'}
            </motion.button>
          </div>
        </motion.form>

        <motion.div
          className="text-white text-sm font-light tracking-wide max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          viewport={{ once: true }}
        >
          <p className="mb-4 text-white">
            By subscribing, you agree to our{' '}
            <a href="#" className="text-white underline hover:no-underline transition-all duration-300 hover:text-gray-200">
              privacy policy
            </a>{' '}
            and{' '}
            <a href="#" className="text-white underline hover:no-underline transition-all duration-300 hover:text-gray-200">
              terms of service
            </a>
          </p>
          <p className="text-gray-300 text-xs">
            You can unsubscribe at any time. We respect your privacy and will never share your information.
          </p>
        </motion.div>

        {/* Additional Benefits */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center border border-white/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-light tracking-[0.2em] uppercase mb-2">Early Access</h3>
            <p className="text-white/60 text-xs font-light tracking-wide">Be the first to shop new collections</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center border border-white/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-light tracking-[0.2em] uppercase mb-2">Exclusive Events</h3>
            <p className="text-white/60 text-xs font-light tracking-wide">Invitations to private events and launches</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center border border-white/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-light tracking-[0.2em] uppercase mb-2">Personalized Content</h3>
            <p className="text-white/60 text-xs font-light tracking-wide">Curated recommendations just for you</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Newsletter