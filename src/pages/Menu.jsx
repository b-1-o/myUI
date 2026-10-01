import { useCallback, useEffect } from 'react'
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

  useEffect(() => {
    const root = document.querySelector('.option-wheel')
    if (!root) return undefined

    const onClick = (e) => {
      const el = e.target.closest?.('.option-wheel__item')
      if (!el || !root.contains(el)) return
      const items = [...root.querySelectorAll('.option-wheel__item')]
      const index = items.indexOf(el)
      if (index >= 0) {
        window.setTimeout(() => openIndex(index), 40)
      }
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

  return (
    <main className="page page-menu page-menu--wheel">
      <div className="menu-wheel-only">
        <OptionWheel
          items={LABELS}
          defaultSelected={0}
          textColor="#6a6a6a"
          activeColor="#f2f2f2"
          side="left"
          fontSize={2.8}
          spacing={1.4}
          curve={0.95}
          tilt={8}
          blur={2}
          fade={0.22}
          smoothing={180}
          inset={56}
          loop
          draggable
        />
      </div>
    </main>
  )
}
