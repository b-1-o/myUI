import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Works from './pages/Works'
import About from './pages/About'

export default function App() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/works" element={<Works />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  )
}
