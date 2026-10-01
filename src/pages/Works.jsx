import { useNavigate } from 'react-router-dom'
import Masonry from '../components/Masonry'

const BASE = import.meta.env.BASE_URL

const items = [
  { id: '1', img: `${BASE}works/2026-09-21_20-57.png`, url: 'https://heaven-b1o.vercel.app/', height: 720 },
  { id: '2', img: `${BASE}works/2026-09-26_21-49.png`, url: 'https://b-1-o.github.io/nothing/', height: 560 },
  { id: '3', img: `${BASE}works/2026-09-27_20-46.png`, url: 'https://b-1-o.github.io/music/', height: 680 },
  { id: '4', img: `${BASE}works/2026-09-27_21-59.png`, url: 'https://github.com/b-1-o/barber', height: 520 },
  { id: '5', img: `${BASE}works/2026-09-30_19-10.png`, url: 'https://b-1-o.github.io/my/', height: 640 },
  { id: '6', img: `${BASE}works/2026-09-30_19-11.png`, url: 'https://github.com/b-1-o/build', height: 480 },
  { id: '7', img: `${BASE}works/2026-09-18_18-37_1.png`, url: 'https://github.com/b-1-o/ascii', height: 600 },
  { id: '8', img: `${BASE}works/2026-09-23_21-25.png`, url: 'https://b-1-o.github.io/portfolio/', height: 540 },
]

export default function Works() {
  const navigate = useNavigate()

  return (
    <main className="page page-works">
      <header className="page-header">
        <button type="button" className="back-btn" onClick={() => navigate('/menu')}>\n          ← Menu\n        </button>
        <span className="page-tag">Selected works</span>
      </header>

      <div className="works-intro">
        <h1>Works</h1>
        <p>
          Interfaces, product sites and experiments — React, TypeScript, motion and careful layout.\n          Screenshots render in monochrome.\n        </p>
      </div>

      <div className="works-masonry">
        <Masonry
          items={items}
          ease="power3.out"
          duration={1.2}
          stagger={0.06}
          animateFrom="bottom"
          scaleOnHover
          hoverScale={0.96}
          blurToFocus
          colorShiftOnHover={false}
        />
      </div>

      <p className="works-note">Selected interfaces and experiments — monochrome presentation.</p>
    </main>
  )
}
