import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import SearchBar from './SearchBar'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center font-bold text-black">
              A
            </div>
            <span className="text-xl md:text-2xl font-bold">AniFlix</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors font-medium">
              Home
            </Link>
            <Link to="/anime" className="text-gray-300 hover:text-white transition-colors font-medium">
              Browse
            </Link>
            <Link to="/#recent" className="text-gray-300 hover:text-white transition-colors font-medium">
              Recent
            </Link>
            <div className="flex items-center gap-4 ml-4">
              <SearchBar />
              <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors border border-white/20">
                <span className="text-sm font-medium">👤</span>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden py-6 space-y-4 border-t border-zinc-800"
          >
            <Link to="/" className="block text-gray-300 hover:text-white transition-colors font-medium" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link to="/anime" className="block text-gray-300 hover:text-white transition-colors font-medium" onClick={() => setIsOpen(false)}>
              Browse
            </Link>
            <Link to="/#recent" className="block text-gray-300 hover:text-white transition-colors font-medium" onClick={() => setIsOpen(false)}>
              Recent
            </Link>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}