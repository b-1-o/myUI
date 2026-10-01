import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CircularCarousel from '../components/CircularCarousel'
import HoldButton from '../components/HoldButton'
import ParticleText from '../components/ParticleText'
import '../home-mobile.css'

const photo = (id) =>
  `https://images.unsplash.com/${id}?w=700&q=70&auto=format&fit=max&sat=-100`

const ALL_ITEMS = [
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

function useViewport() {
  const [vp, setVp] = useState(() => {
    if (typeof window === 'undefined') return { mobile: false, narrow: false }
    return {
      mobile: window.matchMedia('(max-width: 640px)').matches,
      narrow: window.matchMedia('(max-width: 900px)').matches,
    }
  })
  useEffect(() => {
    const mqM = window.matchMedia('(max-width: 640px)')
    const mqN = window.matchMedia('(max-width: 900px)')
    const update = () => setVp({ mobile: mqM.matches, narrow: mqN.matches })
    update()
    mqM.addEventListener('change', update)
    mqN.addEventListener('change', update)
    return () => {
      mqM.removeEventListener('change', update)
      mqN.removeEventListener('change', update)
    }
  }, [])
  return vp
}

export default function Home() {
  const navigate = useNavigate()
  const { mobile, narrow } = useViewport()

  const items = useMemo(
    () => (mobile ? ALL_ITEMS.slice(0, 6) : ALL_ITEMS),
    [mobile]
  )

  const cardWidth = mobile ? 180 : narrow ? 240 : 320
  const speed = mobile ? 12 : 18

  return (
    <main className="page page-home">
      <div className="home-carousel">
        <CircularCarousel
          items={items}
          preset="panorama"
          intro="rise"
          cardWidth={cardWidth}
          aspectRatio={0.5625}
          speed={speed}
          captions={!mobile}
          gap={mobile ? 4 : 6}
          tilt={0}
          perspective={1800}
          momentum={0.5}
          pauseOnHover={false}
          draggable={false}
          parallax={0}
          stretch={mobile ? 0.2 : 0.38}
          depthFade={0.59}
          innerShade={0.46}
          cornerRadius={mobile ? 10 : 13}
          fadeColor="#0a0a0a"
        />
      </div>

      <div className="home-center">
        <p className="home-kicker">Frontend · UI · Web</p>
        <div className="home-particle">
          <ParticleText
            text="b-1-o"
            particleSize={mobile ? 2 : 2}
            density={mobile ? 5 : 4}
            color="#ffffff"
            highlightColor="#f5f5f5"
            scatter={mobile ? 120 : 180}
            gatherDuration={mobile ? 1200 : 1600}
            stagger={mobile ? 280 : 420}
            pointerRepel={mobile ? 28 : 40}
            repelRadius={mobile ? 90 : 120}
            idleDrift={mobile ? 0.45 : 0.7}
            trigger="hover"
            fontSize="clamp(3rem, 12vw, 8rem)"
            fontWeight={500}
            fontFamily="inherit"
            glow={!mobile}
          />
        </div>
        <div className="home-hold" style={{ pointerEvents: 'auto' }}>
          <HoldButton
            doneLabel="Welcome"
            backgroundColor="#1a1a1a"
            fillColor="#e8e8e8"
            textColor="#f5f5f5"
            fillTextColor="#0a0a0a"
            size={mobile ? 'md' : 'lg'}
            radius={999}
            fillDirection="right"
            holdTime={mobile ? 900 : 1200}
            releaseTime={200}
            pressScale={0.97}
            wave
            waveAmplitude={mobile ? 3 : 5}
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
