import { lazy, Suspense } from 'react'
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

export default function About() {
  const navigate = useNavigate()

  return (
    <main className="page page-about">
      <div className="about-bg" aria-hidden="true">
        <Suspense fallback={<div className="dither-fallback" />}>
          <Dither
            waveColor={[0.5, 0.5, 0.5]}
            backgroundColor={[0, 0, 0]}
            disableAnimation={false}
            enableMouseInteraction
            mouseRadius={0.3}
            colorNum={4}
            waveAmplitude={0.3}
            waveFrequency={3}
            waveSpeed={0.05}
            pixelSize={2}
          />
        </Suspense>
      </div>

      <div className="about-content">
        <header className="page-header page-header--over">
          <button type="button" className="back-btn" onClick={() => navigate('/menu')}>
            ← Menu
          </button>
          <span className="page-tag">About</span>
        </header>

        <div className="glass-panel">
          <section className="about-hero">
            <p className="about-kicker">Frontend Developer · UI Engineer</p>
            <h1>I build clean, modern web experiences.</h1>
            <p className="about-lead">
              I’m <strong>b1o</strong> — focused on React, TypeScript and careful UI. I ship responsive
              products, polished interactions and conversion-minded sites for people who care about
              detail.
            </p>
          </section>

          <section className="about-block">
            <h2>What I do</h2>
            <ul className="service-list">
              {services.map(([n, title, desc]) => (
                <li key={n}>
                  <span className="service-n">{n}</span>
                  <div>
                    <strong>{title}</strong>
                    <p>{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="about-block">
            <h2>Stack</h2>
            <div className="stack-row">
              {stack.map((s) => (
                <span key={s} className="stack-chip">
                  {s}
                </span>
              ))}
            </div>
          </section>

          <section className="about-block about-cta">
            <a className="pill" href="https://www.fiverr.com/users/webbio" target="_blank" rel="noopener noreferrer">
              Fiverr
            </a>
            <a className="pill" href="https://github.com/b-1-o" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a className="pill" href="mailto:erikghabuzyan6@gmail.com">
              Email
            </a>
          </section>
        </div>
      </div>
    </main>
  )
}
