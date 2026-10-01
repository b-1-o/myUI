import { useNavigate } from 'react-router-dom'
import CircularCarousel from '../components/CircularCarousel'

const photo = (id) =>
  `https://images.unsplash.com/${id}?w=900&q=80&auto=format&fit=max&sat=-100`

const items = [
  { src: photo('photo-1461749280684-dccba630e2f6'), alt: 'Code on a screen', title: 'Code', subtitle: 'Craft' },
  { src: photo('photo-1516116216624-53e697fedbea'), alt: 'JavaScript code', title: 'JavaScript', subtitle: 'Language' },
  { src: photo('photo-1633356122544-f134324a6cee'), alt: 'React development', title: 'React', subtitle: 'UI' },
  { src: photo('photo-1517694712202-14dd9538aa97'), alt: 'Laptop workspace', title: 'Build', subtitle: 'Workflow' },
  { src: photo('photo-1555066931-4365d14bab8c'), alt: 'Dark code editor', title: 'TypeScript', subtitle: 'Types' },
  { src: photo('photo-1498050108023-c5249f4df085'), alt: 'Developer desk', title: 'Frontend', subtitle: 'Focus' },
  { src: photo('photo-1587620962725-abab7fe55159'), alt: 'Coding hands', title: 'CSS', subtitle: 'Design' },
  { src: photo('photo-1618477388954-7852f32655ec'), alt: 'Terminal window', title: 'Git', subtitle: 'Ship' },
  { src: photo('photo-1555949963-aa79dcee981c'), alt: 'Server racks', title: 'APIs', subtitle: 'Connect' },
  { src: photo('photo-1504639725590-34d0984388bd'), alt: 'Monitor with code', title: 'UI', subtitle: 'Polish' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <main className="page page-home">
      <div className="home-carousel">
        <CircularCarousel
          items={items}
          preset="panorama"
          intro="rise"
          cardWidth={234}
          aspectRatio={0.5625}
          speed={11}
          captions
          gap={0}
          tilt={0}
          perspective={1800}
          momentum={0.57}
          parallax={0}
          stretch={0.38}
          depthFade={0.59}
          innerShade={0.46}
          cornerRadius={0}
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
