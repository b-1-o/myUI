import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OptionWheel from '../components/OptionWheel'

const LINKS = [
  {
    label: 'Works',
    action: 'route',
    to: '/works',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: 'About',
    action: 'route',
    to: '/about',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c1.5-4 4-6 7-6s5.5 2 7 6" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    action: 'url',
    href: 'https://github.com/b-1-o',
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.09.682-.22.682-.48 0-.24-.01-.87-.015-1.71-2.782.6-3.369-1.34-3.369-1.34-.454-1.16-1.11-1.47-1.11-1.47-.908-.62.069-.61.069-.61 1.003.07 1.531 1.03 1.531 1.03.892 1.53 2.341 1.09 2.91.83.09-.65.35-1.09.636-1.34-2.22-.25-4.555-1.11-4.555-4.94 0-1.09.39-1.98 1.029-2.68-.103-.25-.446-1.27.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.84c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.59 1.028 2.68 0 3.84-2.339 4.68-4.566 4.93.359.31.678.92.678 1.855 0 1.34-.012 2.42-.012 2.75 0 .27.18.58.688.48A10.01 10.01 0 0 0 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    ),
  },
  {
    label: 'Fiverr',
    action: 'url',
    href: 'https://www.fiverr.com/users/webbio',
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.32 7.66c-.68 0-1.27.4-1.54.98l-2.22 4.9-2.2-4.9a1.7 1.7 0 0 0-1.54-.98c-.95 0-1.72.77-1.72 1.72 0 .28.07.55.2.79l2.95 5.52v2.65c0 .95.77 1.72 1.72 1.72s1.72-.77 1.72-1.72v-2.65l2.95-5.52c.13-.24.2-.51.2-.79 0-.95-.77-1.72-1.72-1.72zM7.28 7.66H4.4c-.95 0-1.72.77-1.72 1.72v7.24c0 .95.77 1.72 1.72 1.72h.86c.95 0 1.72-.77 1.72-1.72V11.8h.3c.95 0 1.72-.77 1.72-1.72s-.77-1.72-1.72-1.72zm9.44-3.44a1.72 1.72 0 1 0 0 3.44 1.72 1.72 0 0 0 0-3.44z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    action: 'url',
    href: 'https://www.linkedin.com/in/b1o',
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Portfolio',
    action: 'url',
    href: 'https://b-1-o.github.io/portfolio/',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
  {
    label: 'Mail',
    action: 'url',
    href: 'mailto:eghabuzyan@gmail.com',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 7 9-7" />
      </svg>
    ),
  },
]

const LABELS = LINKS.map((l) => l.label)

function useIsDesktop() {
  const [desktop, setDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 900px)').matches : true
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)')
    const onChange = () => setDesktop(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return desktop
}

export default function Menu() {
  const navigate = useNavigate()
  const desktop = useIsDesktop()
  const [active, setActive] = useState(0)

  const openIndex = useCallback(
    (index) => {
      const item = LINKS[index]
      if (!item) return
      if (item.action === 'route') navigate(item.to)
      else if (item.href) {
        window.open(item.href, item.href.startsWith('mailto:') ? '_self' : '_blank', 'noopener')
      }
    },
    [navigate]
  )

  const onChange = useCallback((index) => {
    setActive(index)
  }, [])

  useEffect(() => {
    const root = document.querySelector('.option-wheel')
    if (!root) return undefined

    const onClick = (e) => {
      const el = e.target.closest?.('.option-wheel__item')
      if (!el || !root.contains(el)) return
      const items = [...root.querySelectorAll('.option-wheel__item')]
      const index = items.indexOf(el)
      if (index >= 0) window.setTimeout(() => openIndex(index), 40)
    }

    const onKey = (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return
      const selected = root.querySelector('.option-wheel__item--selected')
      if (!selected) return
      const items = [...root.querySelectorAll('.option-wheel__item')]
      const index = items.indexOf(selected)
      if (index >= 0) {
        e.preventDefault()
        openIndex(index)
      }
    }

    root.addEventListener('click', onClick)
    root.addEventListener('keydown', onKey)
    return () => {
      root.removeEventListener('click', onClick)
      root.removeEventListener('keydown', onKey)
    }
  }, [openIndex])

  const current = LINKS[active] || LINKS[0]

  return (
    <main className="page page-menu page-menu--wheel">
      <div className="menu-wheel-only">
        <OptionWheel
          items={LABELS}
          defaultSelected={0}
          onChange={onChange}
          textColor="#6a6a6a"
          activeColor="#f2f2f2"
          side="left"
          fontSize={desktop ? 4.2 : 2.1}
          spacing={desktop ? 1.55 : 1.48}
          curve={0.95}
          tilt={desktop ? 7 : 6}
          blur={desktop ? 2 : 1.5}
          fade={desktop ? 0.18 : 0.14}
          smoothing={desktop ? 160 : 220}
          inset={desktop ? 96 : 20}
          loop
          draggable
        />
      </div>

      <div className="menu-logo-stage" aria-hidden="true">
        <div key={current.label} className="menu-logo">
          {current.logo}
          <span className="menu-logo__name">{current.label}</span>
        </div>
      </div>
    </main>
  )
}
