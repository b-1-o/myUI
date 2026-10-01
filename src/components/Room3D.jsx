import { useEffect, useRef } from 'react'
import './Room3D.css'

/**
 * Lightweight CSS 3D room — fills the viewport and eases with pointer.
 * Much cheaper than heavy canvas carousels.
 */
export default function Room3D() {
  const roomRef = useRef(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const rafRef = useRef(0)

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (reduced) return undefined

    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      target.current.x = nx
      target.current.y = ny
    }

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.06
      current.current.y += (target.current.y - current.current.y) * 0.06
      const el = roomRef.current
      if (el) {
        const rx = current.current.y * -8
        const ry = current.current.x * 10
        el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className="room3d" aria-hidden="true">
      <div className="room3d__scene">
        <div className="room3d__room" ref={roomRef}>
          <div className="room3d__face room3d__floor" />
          <div className="room3d__face room3d__ceiling" />
          <div className="room3d__face room3d__back" />
          <div className="room3d__face room3d__left" />
          <div className="room3d__face room3d__right" />
          <div className="room3d__grid room3d__grid--floor" />
          <div className="room3d__grid room3d__grid--back" />
          <div className="room3d__orb room3d__orb--a" />
          <div className="room3d__orb room3d__orb--b" />
          <div className="room3d__orb room3d__orb--c" />
        </div>
      </div>
      <div className="room3d__vignette" />
    </div>
  )
}
