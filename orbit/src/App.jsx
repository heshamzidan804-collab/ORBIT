import { useEffect, useRef, useState } from 'react'

const Glyph = () => (
  <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <circle cx="16" cy="16" r="9" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="23.4" cy="9.8" r="3" fill="var(--accent)" />
  </svg>
)

const Svg = ({ children, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)

const EyeIcon = ({ off }) => (
  <Svg>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
    <path className={`slash${off ? ' on' : ''}`} d="M4 4l16 16" />
  </Svg>
)
const ArrowIcon = () => (
  <Svg>
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </Svg>
)
const CheckIcon = () => (
  <svg className="check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
)

const Rings = () => (
  <>
    <div className="ring r1"><div className="arm a1"><i /></div></div>
    <div className="ring r2"><div className="arm a2"><i /></div></div>
    <div className="ring r3"><div className="arm a3"><i /></div></div>
  </>
)

export default function App() {
  const timers = useRef([])
  const artRef = useRef(null)
  const [values, setValues] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPw, setShowPw] = useState(false)
  const [shake, setShake] = useState(false)
  const [status, setStatus] = useState('idle') // idle | loading | success

  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms))

  // Smooth pointer parallax for the orbit artwork (desktop, motion allowed)
  useEffect(() => {
    const art = artRef.current
    if (!art) return
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0
    const tick = () => {
      cx += (tx - cx) * 0.07
      cy += (ty - cy) * 0.07
      art.style.setProperty('--tx', cx.toFixed(4))
      art.style.setProperty('--ty', cy.toFixed(4))
      if (Math.abs(tx - cx) > 0.0005 || Math.abs(ty - cy) > 0.0005) raf = requestAnimationFrame(tick)
      else raf = 0
    }
    const onMove = (e) => {
      tx = e.clientX / window.innerWidth - 0.5
      ty = e.clientY / window.innerHeight - 0.5
      if (!raf) raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  const onChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }))
  }

  // UI-only: no authentication. Validation + simulated visual states.
  const onSubmit = (e) => {
    e.preventDefault()
    if (status !== 'idle') return

    const next = {}
    if (!values.username.trim()) next.username = 'Please enter your username.'
    if (!values.password) next.password = 'Please enter your password.'

    if (Object.keys(next).length) {
      setErrors(next)
      setShake(true)
      later(() => setShake(false), 480)
      document.getElementById(next.username ? 'username' : 'password')?.focus()
      return
    }

    setStatus('loading')
    later(() => setStatus('success'), 1500)
    later(() => setStatus('idle'), 3400)
  }

  return (
    <main className="page">
      <section className="left">
        <div className="bg-rings" aria-hidden="true">
          <Rings />
        </div>

        <header className="top rise" style={{ '--d': '0ms' }}>
          <span className="wordmark">
            <Glyph />
            <span>ORBIT</span>
          </span>
        </header>

        <div className="center">
          <div className={`panel${shake ? ' shake' : ''}`}>
            <p className="eyebrow rise" style={{ '--d': '80ms' }}>Sign in</p>

            <h1 aria-label="Welcome back.">
              <span className="w" aria-hidden="true"><span className="wi" style={{ '--i': 0 }}>Welcome</span></span>{' '}
              <span className="w" aria-hidden="true"><span className="wi" style={{ '--i': 1 }}><em>back.</em></span></span>
            </h1>

            <p className="sub rise" style={{ '--d': '300ms' }}>
              Pick up right where you left off. Your work is exactly as you left it.
            </p>

            <form onSubmit={onSubmit} noValidate>
              <div className="field rise" style={{ '--d': '380ms' }}>
                <label htmlFor="username">Username</label>
                <div className={`control${errors.username ? ' invalid' : ''}`}>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    placeholder="yourname"
                    spellCheck="false"
                    autoCapitalize="none"
                    value={values.username}
                    onChange={onChange}
                    aria-invalid={!!errors.username}
                    aria-describedby="username-error"
                  />
                </div>
                <div className={`msg${errors.username ? ' show' : ''}`}>
                  <div><p id="username-error" role="alert">{errors.username}</p></div>
                </div>
              </div>

              <div className="field rise" style={{ '--d': '450ms' }}>
                <div className="label-row">
                  <label htmlFor="password">Password</label>
                  <button type="button" className="link">Forgot password?</button>
                </div>
                <div className={`control${errors.password ? ' invalid' : ''}`}>
                  <input
                    id="password"
                    name="password"
                    type={showPw ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={values.password}
                    onChange={onChange}
                    aria-invalid={!!errors.password}
                    aria-describedby="password-error"
                  />
                  <button
                    type="button"
                    className="toggle"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                    aria-pressed={showPw}
                  >
                    <EyeIcon off={showPw} />
                  </button>
                </div>
                <div className={`msg${errors.password ? ' show' : ''}`}>
                  <div><p id="password-error" role="alert">{errors.password}</p></div>
                </div>
              </div>

              <button
                type="submit"
                className="btn rise"
                style={{ '--d': '540ms' }}
                data-state={status}
                disabled={status === 'loading'}
                aria-busy={status === 'loading'}
              >
                <span className="lbl l-idle" aria-hidden={status !== 'idle'}>
                  <span>Continue</span>
                  <span className="arrow"><ArrowIcon /></span>
                </span>
                <span className="lbl l-loading" aria-hidden={status !== 'loading'}>
                  <span className="spinner" />
                  <span>Signing in…</span>
                </span>
                <span className="lbl l-success" aria-hidden={status !== 'success'}>
                  {status === 'success' && <CheckIcon />}
                  <span>Signed in</span>
                </span>
                <span className="bar" aria-hidden="true" />
              </button>
              <span className="sr-only" aria-live="polite">
                {status === 'loading' ? 'Signing in' : status === 'success' ? 'Signed in' : ''}
              </span>
            </form>
          </div>
        </div>

        <footer className="foot rise" style={{ '--d': '640ms' }}>
          <span>© 2026 Orbit, Inc.</span>
          <span className="dotsep" aria-hidden="true" />
          <span>Designed with care</span>
        </footer>
      </section>

      <aside className="right" aria-hidden="true">
        <div className="meta">
          <span>Orbit Workspace</span>
          <span>2026</span>
        </div>
        <div className="art" ref={artRef}>
          <Rings />
          <div className="core" />
        </div>
        <p className="quote">
          Calm tools for <em>focused</em> teams.
        </p>
      </aside>
    </main>
  )
}
