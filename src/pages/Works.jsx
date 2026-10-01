import { useNavigate } from 'react-router-dom'
import ScrollStack, { ScrollStackItem } from '../components/ScrollStack'

const BASE = import.meta.env.BASE_URL

const works = [
  { id: '1', img: `${BASE}works/2026-09-21_20-57.png`, url: 'https://heaven-b1o.vercel.app/', title: 'Heaven', tag: 'Next.js · TypeScript' },
  { id: '2', img: `${BASE}works/2026-09-26_21-49.png`, url: 'https://b-1-o.github.io/nothing/', title: 'Nothing', tag: 'React · UI' },
  { id: '3', img: `${BASE}works/2026-09-27_20-46.png`, url: 'https://b-1-o.github.io/music/', title: 'Music', tag: 'React · API' },
  { id: '4', img: `${BASE}works/2026-09-27_21-59.png`, url: 'https://github.com/b-1-o/barber', title: 'Barber', tag: 'TypeScript' },
  { id: '5', img: `${BASE}works/2026-09-30_19-10.png`, url: 'https://b-1-o.github.io/my/', title: 'My', tag: 'React · Design' },
  { id: '6', img: `${BASE}works/2026-09-30_19-11.png`, url: 'https://github.com/b-1-o/build', title: 'Build', tag: 'TypeScript' },
  { id: '7', img: `${BASE}works/2026-09-18_18-37_1.png`, url: 'https://github.com/b-1-o/ascii', title: 'ASCII', tag: 'Experiment' },
  { id: '8', img: `${BASE}works/2026-09-23_21-25.png`, url: 'https://b-1-o.github.io/portfolio/', title: 'Portfolio', tag: 'React · Vite' },
]

export default function Works() {
  const navigate = useNavigate()

  return (
    <main className="page page-works page-works--stack">
      <header className="page-header page-header--over">
        <button type="button" className="back-btn" onClick={() => navigate('/menu')}>
          ← Menu
        </button>
        <span className="page-tag">Selected works</span>
      </header>

      <div className="works-stack">
        <ScrollStack
          itemDistance={120}
          itemScale={0.04}
          itemStackDistance={36}
          stackPosition="22%"
          scaleEndPosition="12%"
          baseScale={0.86}
          rotationAmount={0}
          blurAmount={1.2}
        >
          {works.map((w) => (
            <ScrollStackItem key={w.id} itemClassName="work-card">
              <a
                className="work-card__link"
                href={w.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div
                  className="work-card__img"
                  style={{ backgroundImage: `url(${w.img})` }}
                />
                <div className="work-card__meta">
                  <h2>{w.title}</h2>
                  <span>{w.tag}</span>
                </div>
              </a>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </main>
  )
}
