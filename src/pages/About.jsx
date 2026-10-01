import { lazy, Suspense, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Dither = lazy(() => import('../components/Dither'))

const services = [
  ['01', 'Custom websites', 'Modern sites for small businesses, freelancers and startups.'],
  ['02', 'Landing pages', 'Focused pages built to look credible and convert.'],
  ['03', 'Website redesign', 'Modernize an old site without losing what works.'],
  ['04', 'Responsive UI', 'Layouts that feel right on desktop, tablet and phone.'],
  ['05', 'UI / visual design', 'Clean interfaces and visual systems with a premium feel.'],
  ['06', 'Performance + basics', 'Fast frontend, forms, analytics and basic SEO setup.'],
]

const stack = ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'TypeScript', 'Vite', 'Git', 'GSAP', 'Linux']

const links = [
  { label: 'Fiverr', href: 'https://www.fiverr.com/users/webbio' },
  { label: 'GitHub', href: 'https://github.com/b-1-o' },
  { label: 'Email', href: 'mailto:eghabuzyan@gmail.com' },
]

function useIsMobile() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 900px)').matches : false
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    const on = () => setMobile(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return mobile
}

export default function About() {
  const navigate = useNavigate()
  const mobile = useIsMobile()
  const [showFx, setShowFx] = useState(false)

  // Defer WebGL until after first paint so text is usable immediately
  useEffect(() => {
    let cancelled = false
    const mountFx = () => {
      if (!cancelled) setShowFx(true)
    }

    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(mountFx, { timeout: mobile ? 700 : 500 })
      return () => {
        cancelled = true
        window.cancelIdleCallback(id)
      }
    }

    const id = window.setTimeout(mountFx, mobile ? 260 : 160)
    return () => {
      cancelled = true
      window.clearTimeout(id)
    }
  }, [mobile])

  return (
    <main className="page page-about">
      <div className="about-bg" aria-hidden="true">
        {showFx && (
          <Suspense fallback={<div className="dither-fallback" />}>
            <Dither
              waveColor={[0.5, 0.5, 0.5]}
              backgroundColor={[0, 0, 0]}
              disableAnimation={false}
              enableMouseInteraction={!mobile}
              mouseRadius={0.3}
              colorNum={4}
              waveAmplitude={mobile ? 0.22 : 0.3}
              waveFrequency={mobile ? 2 : 3}
              waveSpeed={mobile ? 0.035 : 0.05}
              pixelSize={mobile ? 4 : 3}
            />
          </Suspense>
        )}
      </div>

      <div className="about-content">
        <header className="page-header page-header--over">
          <button type="button" className="back-btn" onClick={() => navigate('/menu')}>
            ← Menu
          </button>
          <span className="page-tag">About</span>
        </header>

        <div className="glass-panel about-animate">
          <section className="about-hero about-anim" style={{ '--i': 0 }}>
            <p className="about-kicker">Frontend Developer · UI Engineer</p>
            <h1>I build clean, modern web experiences.</h1>
            <p className="about-lead">
              I’m <strong>b1o</strong> — focused on React, TypeScript and careful UI. I ship responsive
              products, polished interactions and conversion-minded sites for people who care about
              detail.
            </p>
          </section>

          <section className="about-block about-anim" style={{ '--i': 1 }}>
            <h2>What I do</h2>
            <ul className="service-list">
              {services.map(([n, title, desc], idx) => (
                <li key={n} className="service-anim" style={{ '--j': idx }}>
                  <span className="service-n">{n}</span>
                  <div>
                    <strong>{title}</strong>
                    <p>{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="about-block about-anim" style={{ '--i': 2 }}>
            <h2>Stack</h2>
            <div className="stack-row">
              {stack.map((s, idx) => (
                <span key={s} className="stack-chip stack-anim" style={{ '--k': idx }}>
                  {s}
                </span>
              ))}
            </div>
          </section>

          <section className="about-block about-cta about-anim" style={{ '--i': 3 }}>
            {links.map((l) => (
              <a
                key={l.label}
                className="pill"
                href={l.href}
                target={l.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={l.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              >
                {l.label}
              </a>
            ))}
          </section>
        </div>
      </div>
    </main>
  )
}
