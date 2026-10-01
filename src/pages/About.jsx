import { useNavigate } from 'react-router-dom'
import PatternWaves from '../components/PatternWaves'

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
        <PatternWaves
          preset="silk"
          color="#ffffff"
          backgroundColor="#000000"
          fade="edges"
          interactive
          cursorSize={50}
          cursorStrength={0.45}
          markSize={0.75}
          depth={0.6}
          shine={0.2}
          contrast={1}
          scale={0.95}
          direction={35}
          fadeSize={0.75}
          speed={0.32}
          opacity={0.9}
        />
      </div>

      <div className="about-content">
        <header className="page-header page-header--over">
          <button type="button" className="back-btn" onClick={() => navigate('/menu')}>
            ← Menu
          </button>
          <span className="page-tag">About</span>
        </header>

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
          <h2>Skills & tools</h2>
          <div className="stack-row">
            {stack.map((s) => (
              <span key={s} className="stack-chip">
                {s}
              </span>
            ))}
          </div>
        </section>

        <section className="about-block">
          <h2>What I’m improving</h2>
          <p>
            Deeper motion systems, design systems at scale, backend fluency for full-stack shipping,
            and tighter performance budgets on complex UI.
          </p>
        </section>

        <section className="about-cta">
          <a className="pill" href="https://www.fiverr.com/users/webbio" target="_blank" rel="noreferrer">
            Hire on Fiverr →
          </a>
          <a className="pill" href="https://github.com/b-1-o" target="_blank" rel="noreferrer">
            GitHub →
          </a>
          <a className="pill" href="mailto:erikghabuzyan6@gmail.com">
            Mail →
          </a>
        </section>
      </div>
    </main>
  )
}
