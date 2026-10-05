import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import InfiniteMenu from '../components/InfiniteMenu'
import autoWorks from '../works.auto.json'

const BASE = import.meta.env.BASE_URL

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

  const works = useMemo(
    () =>
      (Array.isArray(autoWorks) ? autoWorks : []).map((w) => ({
        ...w,
        image: w.image?.startsWith('http') || w.image?.startsWith('data:')
          ? w.image
          : `${BASE}${w.image.replace(/^\//, '')}`,
      })),
    []
  )

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
        {ready && works.length > 0 && (
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
