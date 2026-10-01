import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Works from './pages/Works'
import About from './pages/About'

export default function App() {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionStage, setTransitionStage] = useState('fade-in')

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage('fade-out')
    }
  }, [location, displayLocation])

  return (
    <div className="app-shell">
      <div
        className={`page-transition ${transitionStage}`}
        onAnimationEnd={() => {
          if (transitionStage === 'fade-out') {
            setDisplayLocation(location)
            setTransitionStage('fade-in')
            window.scrollTo(0, 0)
          }
        }}
      >
        <Routes location={displayLocation}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/works" element={<Works />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </div>
  )
}
