import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { getAnimeInfo, getStreamingData } from '../lib/api'

const SERVERS = [
  { name: 'VidCloud', value: 'vidcloud' },
  { name: 'StreamSB', value: 'streamsb' },
  { name: 'VidStreaming', value: 'vidstreaming' },
  { name: 'StreamTape', value: 'streamtape' },
]

export default function Watch() {
  const { animeId, episodeId } = useParams()
  const [anime, setAnime] = useState(null)
  const [streamData, setStreamData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [selectedServer, setSelectedServer] = useState('vidcloud')
  const [loadingServer, setLoadingServer] = useState(false)

  useEffect(() => {
    getAnimeInfo(animeId).then(setAnime).catch(console.error)
  }, [animeId])

  useEffect(() => {
    setIframeLoaded(false)
    setLoadingServer(true)
    
    Promise.all([
      anime ? Promise.resolve(anime) : getAnimeInfo(animeId),
      getStreamingData(episodeId, selectedServer)
    ]).then(([animeData, streamingData]) => {
      console.log('✓ Server:', selectedServer)
      setAnime(animeData)
      setStreamData(streamingData)
      setLoading(false)
      setLoadingServer(false)
    }).catch(err => {
      console.error('❌ Error:', err)
      setLoading(false)
      setLoadingServer(false)
    })
  }, [animeId, episodeId, selectedServer])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading video...</p>
        </div>
      </div>
    )
  }

  if (!anime || !streamData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Video not available</h1>
          <Link to="/search">
            <button className="px-6 py-3 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition-all">
              Go to Search
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const currentEpisode = anime.episodes?.find(ep => ep.id === episodeId)
  const currentEpisodeNumber = currentEpisode?.number || 1
  const embedUrl = streamData?.headers?.Referer

  return (
    <div className="min-h-screen py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6">
          <Link to={`/anime/${animeId}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to series
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold mb-1 text-gray-200">{anime.title}</h1>
          <p className="text-base text-gray-400">Episode {currentEpisodeNumber}{currentEpisode?.title ? `: ${currentEpisode.title}` : ''}</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-3">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-200 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                    Select Video Server
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Switch servers if video doesn't load</p>
                </div>
                {embedUrl && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    Online
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {SERVERS.map((server) => (
                  <button 
                    key={server.value} 
                    onClick={() => setSelectedServer(server.value)} 
                    disabled={loadingServer} 
                    className={`relative px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                      selectedServer === server.value 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/50 scale-105' 
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 hover:border-white/20'
                    } ${loadingServer ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                  >
                    {server.name}
                    {selectedServer === server.value && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-white/10 shadow-2xl">
              {loadingServer ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black z-10">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white font-medium text-lg">Switching to {SERVERS.find(s => s.value === selectedServer)?.name}...</p>
                    <p className="text-gray-400 text-sm mt-2">Please wait</p>
                  </div>
                </div>
              ) : embedUrl ? (
                <>
                  {!iframeLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black z-10">
                      <div className="text-center">
                        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-white font-medium text-lg">Loading player...</p>
                        <p className="text-gray-400 text-sm mt-2">Server: {SERVERS.find(s => s.value === selectedServer)?.name}</p>
                      </div>
                    </div>
                  )}
                  <iframe 
                    key={`${episodeId}-${selectedServer}`} 
                    src={embedUrl} 
                    className="w-full h-full" 
                    allowFullScreen 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="no-referrer-when-downgrade" 
                    sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation allow-presentation allow-modals" 
                    title={`${anime?.title} - Episode ${currentEpisodeNumber}`} 
                    onLoad={() => setIframeLoaded(true)}
                    style={{ border: 'none' }}
                  />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                  <div className="text-center max-w-md px-6">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-xl font-semibold text-white mb-3">Video Not Available</p>
                    <p className="text-gray-400 text-sm mb-6">This server doesn't have this episode. Please try another server.</p>
                    <div className="flex gap-2 justify-center flex-wrap">
                      {SERVERS.filter(s => s.value !== selectedServer).slice(0, 2).map((server) => (
                        <button
                          key={server.value}
                          onClick={() => setSelectedServer(server.value)}
                          className="px-4 py-2 bg-white/10 text-white text-sm rounded-md hover:bg-white/20 transition-all border border-white/20"
                        >
                          Try {server.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!embedUrl && (
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-yellow-300 mb-1">Video Not Loading?</h4>
                    <p className="text-xs text-yellow-200/80">Try switching to a different server above. Each server hosts the video independently.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 p-5 bg-card-dark rounded-lg border border-white/10">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-200 mb-1">{currentEpisode?.title || `Episode ${currentEpisodeNumber}`}</h3>
                  <p className="text-sm text-gray-400">Episode {currentEpisodeNumber} • Server: {SERVERS.find(s => s.value === selectedServer)?.name}</p>
                  
                  {(streamData?.intro || streamData?.outro) && (
                    <div className="flex gap-3 mt-2">
                      {streamData.intro && (
                        <span className="inline-flex items-center gap-1 text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          Intro: {streamData.intro.start}s - {streamData.intro.end}s
                        </span>
                      )}
                      {streamData.outro && (
                        <span className="inline-flex items-center gap-1 text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                          Outro: {streamData.outro.start}s - {streamData.outro.end}s
                        </span>
                      )}
                    </div>
                  )}
                  
                  {streamData?.subtitles && streamData.subtitles.length > 0 && (
                    <div className="mt-2">
                      <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        {streamData.subtitles.filter(s => s.lang !== 'thumbnails').length} Subtitles Available
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{anime.description?.replace(/<[^>]*>/g, '') || 'No description available.'}</p>
            </div>

            {anime.episodes && anime.episodes.length > 0 && (
              <div className="mt-4 flex gap-3">
                {currentEpisodeNumber > 1 && anime.episodes[currentEpisodeNumber - 2] && (
                  <Link to={`/watch/${animeId}/${anime.episodes[currentEpisodeNumber - 2].id}`} className="flex-1">
                    <button className="w-full px-5 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all border border-white/10">← Previous Episode</button>
                  </Link>
                )}
                {currentEpisodeNumber < anime.episodes.length && anime.episodes[currentEpisodeNumber] && (
                  <Link to={`/watch/${animeId}/${anime.episodes[currentEpisodeNumber].id}`} className="flex-1">
                    <button className="w-full px-5 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-all">Next Episode →</button>
                  </Link>
                )}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <div className="bg-card-dark rounded-lg p-5 sticky top-24 border border-white/10">
              <h3 className="text-lg font-semibold mb-4 text-gray-200">Episodes</h3>
              <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {anime.episodes?.map((ep) => (
                  <Link key={ep.id} to={`/watch/${animeId}/${ep.id}`}>
                    <div className={`p-3 rounded-md transition-all cursor-pointer ${ep.id === episodeId ? 'bg-white text-black' : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">Episode {ep.number}</span>
                      </div>
                      {ep.title && <p className="text-xs opacity-80 line-clamp-1">{ep.title}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}