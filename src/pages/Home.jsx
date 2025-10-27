import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getRecentAnime } from '../lib/api'

export default function Home() {
  const [recentAnime, setRecentAnime] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)

  useEffect(() => {
    setLoading(true)
    getRecentAnime(currentPage)
      .then(data => {
        setRecentAnime(data.results)
        setHasNextPage(data.hasNextPage)
        setLoading(false)
      })
  }, [currentPage])

  return (
    <div>
      {/* Hero Section - Netflix Style */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Dark gradient overlay - realistic */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>

        {/* Content - Left aligned like Netflix */}
        <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Stream Your World of Anime
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed"
          >
            Watch thousands of anime series and movies. New episodes added weekly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="flex gap-4"
          >
            <Link to="/anime">
              <button className="px-8 py-4 bg-white text-black font-semibold text-lg rounded-md hover:bg-gray-200 transition-all duration-200 hover:scale-105 shadow-lg">
                Start Watching
              </button>
            </Link>
            <button className="px-8 py-4 bg-white/10 text-white font-semibold text-lg rounded-md hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20">
              More Info
            </button>
          </motion.div>
        </div>
      </section>

      {/* Recent Anime Section */}
      <section id="recent" className="py-16 md:py-24 px-6 md:px-12 lg:px-24 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-200">Recent Episodes</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : recentAnime && recentAnime.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {recentAnime.map((anime, index) => (
                  <motion.div
                    key={anime.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Link to={`/anime/${anime.id}`}>
                      <div className="group cursor-pointer">
                        <div className="aspect-[2/3] overflow-hidden rounded-lg bg-card-dark transition-all duration-300 border border-white/10 group-hover:border-white/30 group-hover:scale-105">
                          <img
                            src={anime.image}
                            alt={anime.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="mt-3 px-1">
                          <h3 className="font-semibold text-sm line-clamp-2 text-gray-200 group-hover:text-white transition-colors">
                            {anime.title}
                          </h3>
                          {anime.type && (
                            <p className="text-xs text-gray-500 mt-1">{anime.type}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12 flex justify-center items-center gap-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || loading}
                  className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 font-medium"
                >
                  ← Previous
                </button>
                
                <div className="px-6 py-3 bg-white text-black rounded-lg font-bold">
                  Page {currentPage}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={!hasNextPage || loading}
                  className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 font-medium"
                >
                  Next →
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <p className="text-gray-400 text-lg">No recent episodes found</p>
                <p className="text-gray-500 text-sm mt-2">Please try again later</p>
              </div>
            </div>
          )}
        </motion.div>
      </section>

      {/* Features Section - Clean and Professional */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-16 text-center"
          >
            Why Choose AniFlix?
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-200">Unlimited Streaming</h3>
              <p className="text-gray-400 leading-relaxed">Watch as much as you want, anytime. No commitments, cancel anytime.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-200">HD & 4K Quality</h3>
              <p className="text-gray-400 leading-relaxed">Enjoy your favorite anime in stunning high definition and 4K quality.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-200">Latest Episodes</h3>
              <p className="text-gray-400 leading-relaxed">Get new episodes as soon as they air. Always stay up to date.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}