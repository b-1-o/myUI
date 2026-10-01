import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import InfiniteMenu from '../components/InfiniteMenu'

const BASE = import.meta.env.BASE_URL

const works = [
  {
    image: `${BASE}icons/b1api.svg`,
    title: 'b1api',
    description: 'API · Backend',
    site: 'https://github.com/b-1-o',
    repo: 'https://github.com/b-1-o',
    link: 'https://github.com/b-1-o',
  },
  {
    image: `${BASE}icons/my.svg`,
    title: 'my',
    description: 'React · Design',
    site: 'https://b-1-o.github.io/my/',
    repo: 'https://github.com/b-1-o/my',
    link: 'https://b-1-o.github.io/my/',
  },
  {
    image: `${BASE}icons/heaven.svg`,
    title: 'HEAVEN',
    description: 'Next.js · TypeScript',
    site: 'https://heaven-b1o.vercel.app/',
    repo: 'https://github.com/b-1-o/heaven',
    link: 'https://heaven-b1o.vercel.app/',
  },
  {
    image: `${BASE}icons/ascii.svg`,
    title: 'ascii',
    description: 'Art · Terminal',
    site: 'https://b-1-o.github.io/ascii/',
    repo: 'https://github.com/b-1-o/ascii',
    link: 'https://b-1-o.github.io/ascii/',
  },
  {
    image: `${BASE}icons/nothing.svg`,
    title: 'nothing',
    description: 'React · CSS',
    site: 'https://b-1-o.github.io/nothing/',
    repo: 'https://github.com/b-1-o/nothing',
    link: 'https://b-1-o.github.io/nothing/',
  },
  {
    image: `${BASE}icons/portfolio.svg`,
    title: 'portfolio',
    description: 'React · Vite',
    site: 'https://b-1-o.github.io/portfolio/',
    repo: 'https://github.com/b-1-o/portfolio',
    link: 'https://b-1-o.github.io/portfolio/',
  },
]

function useIsMobile() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 640px)').matches : false
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const on = () => setMobile(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return mobile
}

export default function Works() {
  const navigate = useNavigate()
  const mobile = useIsMobile()
  const [sheet, setSheet] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), mobile ? 80 : 0)
    return () => window.clearTimeout(id)
  }, [mobile])

  const onAction = useCallback((item) => {
    setSheet(item)
  }, [])

  const scale = mobile ? 1.6 : 1.3

  return (
    <main className="page page-works page-works--infinite">
      <div
        className="works-photo-bg"
        style={{ backgroundImage: `url(${BASE}back.png)` }}
        aria-hidden="true"
      />

      <header className="page-header page-header--over">
        <button type="button" className="back-btn" onClick={() => navigate('/menu')}>
          ← Menu
        </button>
        <span className="page-tag">Selected works</span>
      </header>

      <div className="works-infinite">
        {ready && (
          <InfiniteMenu items={works} scale={scale} backgroundColor="transparent" onAction={onAction} />
        )}
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
