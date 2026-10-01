import { useNavigate } from 'react-router-dom'
import CircularCarousel from '../components/CircularCarousel'

const photo = (id) =>
  `https://images.unsplash.com/${id}?w=900&q=80&auto=format&fit=max&sat=-100`

const items = [
  { src: photo('photo-1461749280684-dccba630e2f6'), alt: 'Code on a screen', title: 'Code', subtitle: 'Craft' },
  { src: photo('photo-1516116216624-53e697fedbea'), alt: 'JavaScript', title: 'JavaScript', subtitle: 'Language' },
  { src: photo('photo-1633356122544-f134324a6cee'), alt: 'React', title: 'React', subtitle: 'UI' },
  { src: photo('photo-1517694712202-14dd9538aa97'), alt: 'Laptop', title: 'Build', subtitle: 'Workflow' },
  { src: photo('photo-1555066931-4365d14bab8c'), alt: 'Editor', title: 'TypeScript', subtitle: 'Types' },
  { src: photo('photo-1498050108023-c5249f4df085'), alt: 'Desk', title: 'Frontend', subtitle: 'Focus' },
  { src: photo('photo-1587620962725-abab7fe55159'), alt: 'Hands', title: 'CSS', subtitle: 'Design' },
  { src: photo('photo-1618477388954-7852f32655ec'), alt: 'Terminal', title: 'Git', subtitle: 'Ship' },
  { src: photo('photo-1555949963-aa79dcee981c'), alt: 'Servers', title: 'APIs', subtitle: 'Connect' },
  { src: photo('photo-1504639725590-34d0984388bd'), alt: 'Monitor', title: 'UI', subtitle: 'Polish' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <main className="page page-home">
      <div className="home-carousel">
        <CircularCarousel
          items={items}
          preset="cylinder"
          intro="rise"
          cardWidth={260}
          aspectRatio={0.72}
          speed={10}
          captions
          gap={18}
          tilt={-12}
          perspective={1600}
          momentum={0.55}
          parallax={0.25}
          stretch={0.35}
          depthFade={0.5}
          innerShade={0.5}
          cornerRadius={14}
          fadeColor="#0a0a0a"
        />
      </div>

      <div className="home-center">
        <p className="home-kicker">Frontend · UI · Web</p>
        <h1 className="home-title">b-1-o</h1>
        <button
          type="button"
          className="enter-btn"
          onClick={() => navigate('/menu')}
          aria-label="Enter site"
        >
          <span className="enter-btn__ring" />
          <span className="enter-btn__label">Enter</span>
        </button>
        <p className="home-hint">skills · services · works</p>
      </div>
    </main>
  )
}
