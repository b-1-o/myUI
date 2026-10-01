import { useNavigate } from 'react-router-dom'
import ScrollStack, { ScrollStackItem } from '../components/ScrollStack'

const BASE = import.meta.env.BASE_URL

/** Order matches current screenshots; last two assets removed */
const works = [
  {
    id: 'b1api',
    img: `${BASE}works/2026-09-21_20-57.png`,
    url: 'https://github.com/b-1-o',
    title: 'b1api',
    tag: 'API · Backend',
  },
  {
    id: 'my',
    img: `${BASE}works/2026-09-26_21-49.png`,
    url: 'https://b-1-o.github.io/my/',
    title: 'my',
    tag: 'React · Design',
  },
  {
    id: 'heaven',
    img: `${BASE}works/2026-09-27_20-46.png`,
    url: 'https://heaven-b1o.vercel.app/',
    title: 'HEAVEN',
    tag: 'Next.js · TypeScript',
  },
  {
    id: 'heaven-light',
    img: `${BASE}works/2026-09-27_21-59.png`,
    url: 'https://heaven-light.vercel.app/',
    title: 'Heaven-light',
    tag: 'React · UI',
  },
  {
    id: 'nothing',
    img: `${BASE}works/2026-09-30_19-10.png`,
    url: 'https://b-1-o.github.io/nothing/',
    title: 'nothing',
    tag: 'React · CSS',
  },
  {
    id: 'portfolio',
    img: `${BASE}works/2026-09-30_19-11.png`,
    url: 'https://b-1-o.github.io/portfolio/',
    title: 'portfolio',
    tag: 'React · Vite',
  },
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
          itemDistance={100}
          itemScale={0.03}
          itemStackDistance={32}
          stackPosition="16%"
          scaleEndPosition="8%"
          baseScale={0.9}
          rotationAmount={0}
          blurAmount={0.6}
        >
          {works.map((w) => (
            <ScrollStackItem key={w.id} itemClassName="work-card">
              <a className="work-card__link" href={w.url} target="_blank" rel="noopener noreferrer">
                <div className="work-card__frame">
                  <img
                    className="work-card__img"
                    src={w.img}
                    alt={`${w.title} screenshot`}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
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
