import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { searchAnime } from '../lib/api'

export default function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(query)

  useEffect(() => {
    if (query) {
      setLoading(true)
      searchAnime(query)
        .then(data => {
          setResults(data.results || [])
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        })
    }
  }, [query])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <div className="min-h-screen py-20 px-6 md:px-12 lg:px-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Search Anime</h1>
        
        <form onSubmit={handleSearch} className="mb-12">
          <div className="flex gap-4 max-w-3xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for anime..."
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all"
            >
              Search
            </button>
          </div>
        </form>

        {query && (
          <div className="mb-6">
            <p className="text-gray-400">Search results for: <span className="text-white font-semibold">{query}</span></p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {results.map((anime, index) => (
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
                      {anime.releaseDate && (
                        <p className="text-xs text-gray-500 mt-1">{anime.releaseDate}</p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : query ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <p className="text-gray-400 text-lg">No results found for "{query}"</p>
              <p className="text-gray-500 text-sm mt-2">Try searching with different keywords</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-400 text-lg">Start searching for your favorite anime</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}