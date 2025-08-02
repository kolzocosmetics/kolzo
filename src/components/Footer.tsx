import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Footer = () => {
  const helpLinks = [
    { name: 'Contact Us', href: '#' },
    { name: 'My Order', href: '#' },
    { name: 'FAQs', href: '#' },
    { name: 'Email Unsubscribe', href: '#' },
    { name: 'Sitemap', href: '#' }
  ]

  const brandLinks = [
    { name: 'About Kolzo', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Sustainability', href: '#' }
  ]

  const socialLinks = [
    { name: 'Instagram', href: '#', icon: '📷' },
    { name: 'Facebook', href: '#', icon: '📘' },
    { name: 'Twitter', href: '#', icon: '🐦' },
    { name: 'Pinterest', href: '#', icon: '📌' }
  ]

  const newsletterLinks = [
    { name: 'Newsletter', href: '#' },
    { name: 'Store Locator', href: '#' },
    { name: 'Size Guide', href: '#' },
    { name: 'Care & Repair', href: '#' }
  ]

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-8 py-12">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-sm font-light tracking-[0.3em] uppercase mb-6 text-gray-400">
              MAY WE HELP YOU?
            </h3>
            <ul className="space-y-3">
              {helpLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white text-sm font-light tracking-wide hover:text-gray-200 transition-all duration-500 border-b border-transparent hover:border-white/30"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.1,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-sm font-light tracking-[0.3em] uppercase mb-6 text-gray-400">
              THE COMPANY
            </h3>
            <ul className="space-y-3">
              {brandLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white text-sm font-light tracking-wide hover:text-gray-200 transition-all duration-500 border-b border-transparent hover:border-white/30"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-sm font-light tracking-[0.3em] uppercase mb-6 text-gray-400">
              KOLZO SERVICES
            </h3>
            <ul className="space-y-3">
              {newsletterLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white text-sm font-light tracking-wide hover:text-gray-200 transition-all duration-500 border-b border-transparent hover:border-white/30"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Social Media Section */}
        <motion.div
          className="pt-8 border-t border-gray-800 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-6">
            <h3 className="text-sm font-light tracking-[0.3em] uppercase mb-4 text-gray-400">
              FOLLOW US
            </h3>
            <p className="text-gray-500 text-xs font-light tracking-wide mb-6">
              Stay connected with the House of Kolzo
            </p>
          </div>
          
          <div className="flex justify-center space-x-8">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.href}
                className="group flex flex-col items-center space-y-2 hover:opacity-80 transition-all duration-500"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.4 + (index * 0.1),
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-12 h-12 border border-gray-600 rounded-full flex items-center justify-center group-hover:border-white transition-all duration-500">
                  <span className="text-lg">{social.icon}</span>
                </div>
                <span className="text-xs font-light tracking-wide text-gray-400 group-hover:text-white transition-all duration-500">
                  {social.name}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          className="pt-6 border-t border-gray-800 flex flex-col items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          viewport={{ once: true }}
        >
          <Link to="/" className="text-xl font-light tracking-[0.3em] uppercase mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            KOLZO
          </Link>
          
          <div className="text-gray-400 text-sm font-light tracking-wide text-center">
            © 2024 Kolzo. All rights reserved.
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer