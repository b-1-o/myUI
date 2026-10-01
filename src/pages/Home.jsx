import { useNavigate } from 'react-router-dom'
import CircularCarousel from '../components/CircularCarousel'
import HoldButton from '../components/HoldButton'

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
          preset="panorama"
          intro="rise"
          cardWidth={320}
          aspectRatio={0.5625}
          speed={20}
          captions
          gap={6}
          tilt={0}
          perspective={1800}
          momentum={0.57}
          pauseOnHover={false}
          draggable={false}
          parallax={0}
          stretch={0.38}
          depthFade={0.59}
          innerShade={0.46}
          cornerRadius={13}
          fadeColor="#0a0a0a"
        />
      </div>

      <div className="home-center">
        <p className="home-kicker">Frontend · UI · Web</p>
        <h1 className="home-title">b-1-o</h1>
        <div className="home-hold" style={{ pointerEvents: 'auto' }}>
          <HoldButton
            doneLabel="Welcome"
            backgroundColor="#1a1a1a"
            fillColor="#e8e8e8"
            textColor="#f5f5f5"
            fillTextColor="#0a0a0a"
            size="lg"
            radius={999}
            fillDirection="right"
            holdTime={1200}
            releaseTime={200}
            pressScale={0.97}
            wave
            waveAmplitude={5}
            glow
            resetAfter={600}
            onHold={() => navigate('/menu')}
          >
            Enter
          </HoldButton>
        </div>
        <p className="home-hint">hold to enter · skills · works</p>
      </div>
    </main>
  )
}
