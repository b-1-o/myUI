import { useNavigate } from 'react-router-dom'
import Room3D from '../components/Room3D'

export default function Home() {
  const navigate = useNavigate()

  return (
    <main className="page page-home">
      <Room3D />
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
