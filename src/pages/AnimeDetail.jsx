import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getAnimeInfo } from '../lib/api'

export default function AnimeDetail() {
  const { id } = useParams()
  const [anime, setAnime] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getAnimeInfo(id)
      .then(data => {
        setAnime(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading anime...</p>
        </div>
      </div>
    )
  }

  if (!anime) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Anime not found</h1>
          <Link to="/search">
            <button className="px-6 py-3 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition-all">
              Go to Search
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Netflix Style */}
      <section className="relative h-[80vh] flex items-end overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('${anime.image}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Realistic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 px-6 md:px-12 lg:px-24 pb-16 w-full">
          <div className="max-w-3xl">
            {anime.genres && anime.genres.length > 0 && (
              <div className="flex gap-2 mb-6 flex-wrap">
                {anime.genres.slice(0, 4).map((g) => (
                  <span key={g} className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded text-sm text-white border border-white/20">
                    {g}
                  </span>
                ))}
              </div>
            )}
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{anime.title}</h1>
            
            <div className="flex items-center gap-4 mb-6 text-sm md:text-base flex-wrap">
              {anime.rating && (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white">★</span>
                    <span className="font-semibold">{anime.rating}</span>
                  </div>
                  <span className="text-gray-500">•</span>
                </>
              )}
              <span className="text-gray-300">{anime.totalEpisodes} Episodes</span>
            </div>

            <p className="text-base md:text-lg text-gray-200 mb-8 leading-relaxed max-w-2xl line-clamp-4">
              {anime.description?.replace(/<[^>]*>/g, '') || 'No description available.'}
            </p>

            <div className="flex gap-4">
              {anime.episodes && anime.episodes.length > 0 && (
                <Link to={`/watch/${anime.id}/${anime.episodes[0].id}`}>
                  <button className="flex items-center gap-2 px-8 py-3.5 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition-all duration-200 hover:scale-105 shadow-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                    Play Episode 1
                  </button>
                </Link>
              )}
              <button className="px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-md hover:bg-white/20 transition-all duration-200 border border-white/20">
                + My List
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Episodes Section */}
      <section className="py-16 md:py-20 px-6 md:px-12 lg:px-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-200">Episodes</h2>
        {anime.episodes && anime.episodes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {anime.episodes.map((episode) => (
              <Link key={episode.id} to={`/watch/${anime.id}/${episode.id}`}>
                <div className="p-5 bg-card-dark rounded-lg hover:bg-white/5 transition-all cursor-pointer group border border-white/10 hover:border-white/30 hover:-translate-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-200 group-hover:text-white transition-colors">
                      Episode {episode.number}
                    </h3>
                  </div>
                  {episode.title && (
                    <p className="text-gray-400 text-sm line-clamp-2 mt-2">{episode.title}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No episodes available.</p>
        )}
      </section>
    </div>
  )
}