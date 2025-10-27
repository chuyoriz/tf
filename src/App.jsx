import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import AnimeDetail from './pages/AnimeDetail'
import Watch from './pages/Watch'
import Search from './pages/Search'
import Browse from './pages/Browse'

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/anime" element={<Browse />} />
          <Route path="/anime/:id" element={<AnimeDetail />} />
          <Route path="/watch/:animeId/:episodeId" element={<Watch />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App