const API_BASE = 'https://consumet-api-37qu.onrender.com/anime/zoro'

// Helper to log API responses
function logApiResponse(endpoint, data) {
  console.log(`✓ API [${endpoint}]:`, {
    results: data?.results?.length || 0,
    hasNextPage: data?.hasNextPage,
    currentPage: data?.currentPage
  })
}

export async function getAnimeInfo(id) {
  try {
    const response = await fetch(`${API_BASE}/info/${id}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching anime info:', error)
    return null
  }
}

export async function getRecentAnime(page = 1) {
  try {
    const response = await fetch(`${API_BASE}/recent-episodes?page=${page}`)
    const data = await response.json()
    logApiResponse('recent-episodes', data)
    return data
  } catch (error) {
    console.error('Error fetching recent anime:', error)
    return { results: [], hasNextPage: false, currentPage: 1 }
  }
}

export async function getStreamingData(episodeId, server = 'vidcloud') {
  try {
    const response = await fetch(`${API_BASE}/watch/${episodeId}?server=${server}`)
    const data = await response.json()
    console.log('✓ Streaming data:', { server, hasEmbed: !!data?.headers?.Referer })
    return data
  } catch (error) {
    console.error('Error fetching streaming data:', error)
    return null
  }
}

export async function searchAnime(query) {
  try {
    const response = await fetch(`${API_BASE}/${encodeURIComponent(query)}`)
    const data = await response.json()
    logApiResponse('search', data)
    return data
  } catch (error) {
    console.error('Error searching anime:', error)
    return { results: [] }
  }
}