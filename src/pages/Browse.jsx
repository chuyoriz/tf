import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getRecentAnime } from '../lib/api'

export default function Browse() {
  const [animeList, setAnimeList] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)

  useEffect(() => {
    setLoading(true)
    getRecentAnime(currentPage)
      .then(data => {
        setAnimeList(data.results)
        setHasNextPage(data.hasNextPage)
        setLoading(false)
      })
  }, [currentPage])

  return (
    <div className="min-h-screen py-20 px-6 md:px-12 lg:px-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Browse Anime</h1>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        ) : animeList.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {animeList.map((anime, index) => (
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
              <p className="text-gray-400 text-lg">No anime found</p>
              <p className="text-gray-500 text-sm mt-2">Please try again later</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}