import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OptionWheel from '../components/OptionWheel'

const LINKS = [
  { label: 'Works', action: 'route', to: '/works' },
  { label: 'About', action: 'route', to: '/about' },
  { label: 'GitHub', action: 'url', href: 'https://github.com/b-1-o' },
  { label: 'Fiverr', action: 'url', href: 'https://www.fiverr.com/users/webbio' },
  { label: 'LinkedIn', action: 'url', href: 'https://www.linkedin.com/in/b1o' },
  { label: 'Portfolio', action: 'url', href: 'https://b-1-o.github.io/portfolio/' },
  { label: 'Mail', action: 'url', href: 'mailto:erikghabuzyan6@gmail.com' },
  { label: 'Heaven', action: 'url', href: 'https://heaven-b1o.vercel.app/' },
  { label: 'Music', action: 'url', href: 'https://b-1-o.github.io/music/' },
  { label: 'Home', action: 'route', to: '/' },
]

const LABELS = LINKS.map((l) => l.label)

export default function Menu() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(0)

  const onChange = useCallback((index) => {
    setSelected(index)
  }, [])

  const go = useCallback(() => {
    const item = LINKS[selected]
    if (!item) return
    if (item.action === 'route') navigate(item.to)
    else if (item.href) window.open(item.href, item.href.startsWith('mailto:') ? '_self' : '_blank', 'noopener')
  }, [navigate, selected])

  return (
    <main className="page page-menu">
      <header className="page-header">
        <button type="button" className="back-btn" onClick={() => navigate('/')}>
          ← Home
        </button>
        <span className="page-tag">Navigate</span>
      </header>

      <div className="menu-layout">
        <div className="menu-wheel">
          <OptionWheel
            items={LABELS}
            defaultSelected={0}
            textColor="#6a6a6a"
            activeColor="#f2f2f2"
            side="left"
            fontSize={2.6}
            spacing={1.35}
            curve={0.95}
            tilt={8}
            blur={2}
            fade={0.22}
            smoothing={180}
            inset={48}
            loop
            draggable
            onChange={onChange}
          />
        </div>

        <div className="menu-panel">
          <p className="menu-index">{String(selected + 1).padStart(2, '0')} / {String(LABELS.length).padStart(2, '0')}</p>
          <h2 className="menu-selected">{LINKS[selected]?.label}</h2>
          <p className="menu-desc">
            {LINKS[selected]?.action === 'route'
              ? 'Open this section of the site.'
              : 'Opens in a new tab or mail client.'}
          </p>
          <button type="button" className="menu-go" onClick={go}>
            Open →
          </button>
          <ul className="menu-quick">
            {LINKS.slice(0, 6).map((l, i) => (
              <li key={l.label}>
                <button
                  type="button"
                  className={i === selected ? 'is-active' : ''}
                  onClick={() => {
                    setSelected(i)
                    if (l.action === 'route') navigate(l.to)
                    else if (l.href) window.open(l.href, l.href.startsWith('mailto:') ? '_self' : '_blank', 'noopener')
                  }}
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}
