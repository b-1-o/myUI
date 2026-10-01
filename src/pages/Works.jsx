import { lazy, Suspense, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Dither = lazy(() => import('../components/Dither'))

const BASE = import.meta.env.BASE_URL

const works = [
  {
    icon: `${BASE}icons/b1api.svg`,
    title: 'b1api',
    description: 'API · Backend',
    site: 'https://github.com/b-1-o',
    repo: 'https://github.com/b-1-o',
  },
  {
    icon: `${BASE}icons/my.svg`,
    title: 'my',
    description: 'React · Design',
    site: 'https://b-1-o.github.io/my/',
    repo: 'https://github.com/b-1-o/my',
  },
  {
    icon: `${BASE}icons/heaven.svg`,
    title: 'HEAVEN',
    description: 'Next.js · TypeScript',
    site: 'https://heaven-b1o.vercel.app/',
    repo: 'https://github.com/b-1-o/heaven',
  },
  {
    icon: `${BASE}icons/heaven-light.svg`,
    title: 'Heaven-light',
    description: 'React · UI',
    site: 'https://heaven-light.vercel.app/',
    repo: 'https://github.com/b-1-o/heaven',
  },
  {
    icon: `${BASE}icons/nothing.svg`,
    title: 'nothing',
    description: 'React · CSS',
    site: 'https://b-1-o.github.io/nothing/',
    repo: 'https://github.com/b-1-o/nothing',
  },
  {
    icon: `${BASE}icons/portfolio.svg`,
    title: 'portfolio',
    description: 'React · Vite',
    site: 'https://b-1-o.github.io/portfolio/',
    repo: 'https://github.com/b-1-o/portfolio',
  },
]

export default function Works() {
  const navigate = useNavigate()
  const [sheet, setSheet] = useState(null)

  return (
    <main className="page page-works page-works--grid">
      <div className="works-dither" aria-hidden="true">
        <Suspense fallback={<div className="dither-fallback" />}>
          <Dither
            waveColor={[0.45, 0.45, 0.45]}
            backgroundColor={[0, 0, 0]}
            disableAnimation={false}
            enableMouseInteraction
            mouseRadius={0.35}
            colorNum={4}
            waveAmplitude={0.28}
            waveFrequency={3}
            waveSpeed={0.04}
            pixelSize={3}
          />
        </Suspense>
      </div>

      <header className="page-header page-header--over">
        <button type="button" className="back-btn" onClick={() => navigate('/menu')}>
          ← Menu
        </button>
        <span className="page-tag">Selected works</span>
      </header>

      <div className="works-grid-wrap">
        <div className="works-grid">
          {works.map((w) => (
            <button
              key={w.title}
              type="button"
              className="work-tile"
              onClick={() => setSheet(w)}
            >
              <span className="work-tile__icon">
                <img src={w.icon} alt="" width={48} height={48} decoding="async" />
              </span>
              <span className="work-tile__title">{w.title}</span>
              <span className="work-tile__desc">{w.description}</span>
            </button>
          ))}
        </div>
      </div>

      {sheet && (
        <div className="works-sheet" role="dialog" aria-modal="true" aria-label={sheet.title}>
          <button type="button" className="works-sheet__backdrop" onClick={() => setSheet(null)} aria-label="Close" />
          <div className="works-sheet__panel">
            <p className="works-sheet__kicker">Open project</p>
            <h2 className="works-sheet__title">{sheet.title}</h2>
            <p className="works-sheet__desc">{sheet.description}</p>
            <div className="works-sheet__actions">
              {sheet.site && (
                <a
                  className="works-sheet__btn works-sheet__btn--primary"
                  href={sheet.site}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live project →
                </a>
              )}
              {sheet.repo && (
                <a className="works-sheet__btn" href={sheet.repo} target="_blank" rel="noopener noreferrer">
                  Repository →
                </a>
              )}
              <button type="button" className="works-sheet__btn works-sheet__btn--ghost" onClick={() => setSheet(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
