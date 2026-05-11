import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const AUDIO_URL =
  'https://res.cloudinary.com/dctzllsly/video/upload/v1778433638/Audio_sistema_orion_q3hpjf.mp3'

const S  = 380          // SVG canvas (square)
const CX = S / 2        // 190
const CY = S / 2        // 190
const R  = 176          // sphere radius

/* ── Sine-wave path generator ── */
function sinWave(y0, amp, phase = 0, steps = 110) {
  const pts = []
  for (let i = 0; i <= steps; i++) {
    const x  = (i / steps) * (S + 48) - 24
    const y  = y0 + amp * Math.sin((i / steps) * Math.PI * 4 + phase)
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
  }
  return pts.join(' ')
}

/* ── Wave ribbon groups (pre-computed outside component) ── */
const GROUP_A = [   // horizontal
  { d: sinWave(145, 24, 0.0), color: '#6D28D9', w: 1.5, op: 0.50, da: '150 15', spd: 18, rev: false },
  { d: sinWave(161, 30, 0.5), color: '#7C3AED', w: 2.0, op: 0.70, da: '200 10', spd: 14, rev: false },
  { d: sinWave(177, 36, 1.0), color: '#8B5CF6', w: 3.0, op: 0.90, da: '240 6',  spd: 11, rev: false },
  { d: sinWave(193, 37, 1.5), color: '#A855F7', w: 3.0, op: 1.00, da: '250 5',  spd: 10, rev: false },
  { d: sinWave(209, 30, 1.0), color: '#8B5CF6', w: 2.0, op: 0.70, da: '200 10', spd: 13, rev: true  },
  { d: sinWave(225, 22, 0.5), color: '#7C3AED', w: 1.5, op: 0.50, da: '150 15', spd: 17, rev: true  },
]

const GROUP_B = [   // rotated +38°
  { d: sinWave(150, 27, 0.2), color: '#9333EA', w: 1.5, op: 0.45, da: '165 14', spd: 19, rev: true  },
  { d: sinWave(166, 33, 0.7), color: '#A855F7', w: 2.0, op: 0.68, da: '210 9',  spd: 15, rev: true  },
  { d: sinWave(182, 37, 1.2), color: '#C084FC', w: 2.5, op: 0.82, da: '240 7',  spd: 12, rev: true  },
  { d: sinWave(198, 33, 0.7), color: '#A855F7', w: 2.0, op: 0.62, da: '205 11', spd: 14, rev: false },
]

const GROUP_C = [   // rotated -38°
  { d: sinWave(153, 25, 0.3), color: '#5B21B6', w: 1.5, op: 0.40, da: '155 16', spd: 20, rev: false },
  { d: sinWave(169, 31, 0.8), color: '#7C3AED', w: 2.0, op: 0.62, da: '205 11', spd: 15, rev: false },
  { d: sinWave(185, 36, 1.3), color: '#9333EA', w: 2.5, op: 0.78, da: '235 8',  spd: 12, rev: false },
  { d: sinWave(201, 31, 0.8), color: '#8B5CF6', w: 2.0, op: 0.60, da: '200 12', spd: 14, rev: true  },
]

/* ── CSS keyframes (scoped via <style> tag) ── */
const SPHERE_CSS = `
  @keyframes svr-flow    { from { stroke-dashoffset: 0 } to { stroke-dashoffset: -640 } }
  @keyframes svr-flowRev { from { stroke-dashoffset: 0 } to { stroke-dashoffset:  640 } }
  @keyframes svr-glow {
    0%, 100% {
      box-shadow:
        0 0  55px 12px rgba(124, 58,237,0.38),
        0 0 110px 35px rgba(109, 40,217,0.22),
        0 0 200px 65px rgba( 99, 38,197,0.08);
    }
    50% {
      box-shadow:
        0 0  75px 22px rgba(167, 85,247,0.58),
        0 0 145px 55px rgba(139, 92,246,0.32),
        0 0 260px 85px rgba(124, 58,237,0.13);
    }
  }
`

/* ── One ribbon group (optional SVG rotation) ── */
function WaveGroup({ paths, rotate }) {
  const transform = rotate ? `rotate(${rotate} ${CX} ${CY})` : undefined
  return (
    <g transform={transform}>
      {paths.map(({ d, color, w, op, da, spd, rev }, i) => (
        <path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={w}
          fill="none"
          opacity={op}
          strokeDasharray={da}
          style={{
            animation: `${rev ? 'svr-flowRev' : 'svr-flow'} ${spd}s linear infinite`,
          }}
        />
      ))}
    </g>
  )
}

const BG_ORIGINAL_VOL = 0.18
const BG_DUCKED_VOL   = 0.05

/* Gradual volume fade — returns the interval id so it can be cancelled */
function fadeVolume(audio, targetVol, durationMs = 1000, onDone) {
  if (!audio) { onDone?.(); return null }
  const STEPS    = 40
  const stepMs   = durationMs / STEPS
  const delta    = (targetVol - audio.volume) / STEPS

  const id = setInterval(() => {
    const next = audio.volume + delta
    audio.volume = Math.min(1, Math.max(0, next))
    const reached = delta >= 0 ? audio.volume >= targetVol : audio.volume <= targetVol
    if (reached) {
      audio.volume = targetVol
      clearInterval(id)
      onDone?.()
    }
  }, stepMs)

  return id
}

/* ── Main component ── */
export default function SystemVoiceReveal({ onComplete, bgAudioRef }) {
  const audioRef   = useRef(null)
  const fadeIdRef  = useRef(null)
  const [exiting, setExiting] = useState(false)

  /* Fade visual out, restaura música, navega */
  function finish() {
    if (exiting) return
    setExiting(true)
    audioRef.current?.pause()
    clearInterval(fadeIdRef.current)
    // restaura música junto com o fade visual (800ms)
    fadeIdRef.current = fadeVolume(bgAudioRef?.current, BG_ORIGINAL_VOL, 800)
    setTimeout(() => onComplete?.(), 850)
  }

  useEffect(() => {
    if (audioRef.current) return           // guard against double-mount (StrictMode)

    /* Duck imediatamente — fade de 1s enquanto o suspense acontece */
    fadeIdRef.current = fadeVolume(bgAudioRef?.current, BG_DUCKED_VOL, 1000)

    /* Voz entra após 1s de silêncio dramático */
    const delayId = setTimeout(() => {
      const audio = new Audio(AUDIO_URL)
      audio.volume = 1.0
      audio.addEventListener('ended', finish)
      audio.play().catch(() => {})
      audioRef.current = audio
    }, 1000)

    return () => {
      clearTimeout(delayId)
      clearInterval(fadeIdRef.current)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current = null
      }
      /* Garante restauração do volume ao desmontar */
      if (bgAudioRef?.current) bgAudioRef.current.volume = BG_ORIGINAL_VOL
    }
  }, [])

  const skip = finish

  return (
    <>
      <style>{SPHERE_CSS}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: exiting ? 0.85 : 0.7, ease: 'easeInOut' }}
        style={{
          position: 'fixed', inset: 0, zIndex: 60,
          background: '#010208',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {/* ── Skip button ── */}
        <button
          onClick={skip}
          style={{
            position: 'absolute', top: 24, right: 24,
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.38)',
            fontSize: 13, fontWeight: 500,
            padding: '8px 20px',
            borderRadius: 8,
            cursor: 'pointer',
            letterSpacing: '0.05em',
            transition: 'color .2s, border-color .2s',
            zIndex: 10,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.38)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
          }}
        >
          Pular Fala
        </button>

        {/* ── Sphere entrance animation ── */}
        <motion.div
          initial={{ scale: 0.55, opacity: 0 }}
          animate={{ scale: 1,    opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Pulsing glow ring (CSS) + floating (framer-motion) on separate layers */}
          <div style={{ position: 'relative', width: S, height: S }}>

            {/* Glow layer — CSS box-shadow animation only */}
            <div
              style={{
                position: 'absolute', inset: 0,
                borderRadius: '50%',
                animation: 'svr-glow 4.5s ease-in-out infinite',
                pointerEvents: 'none',
              }}
            />

            {/* Float + pulse layer — framer-motion transform only */}
            <motion.div
              animate={{ scale: [0.97, 1.03, 0.97], y: [0, -9, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
              style={{ width: '100%', height: '100%' }}
            >
              <svg
                width={S}
                height={S}
                viewBox={`0 0 ${S} ${S}`}
                style={{ display: 'block', overflow: 'visible' }}
              >
                <defs>
                  {/* Clip path — confines ribbons to circle */}
                  <clipPath id="svr-clip">
                    <circle cx={CX} cy={CY} r={R} />
                  </clipPath>

                  {/* Sphere base gradient */}
                  <radialGradient id="svr-grad" cx="38%" cy="33%" r="68%">
                    <stop offset="0%"   stopColor="#3B1F8C" stopOpacity="0.88" />
                    <stop offset="52%"  stopColor="#0E0720" stopOpacity="0.96" />
                    <stop offset="100%" stopColor="#010208" stopOpacity="1"    />
                  </radialGradient>

                  {/* Bloom filter for ribbon glow */}
                  <filter id="svr-bloom" x="-25%" y="-25%" width="150%" height="150%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Base sphere */}
                <circle cx={CX} cy={CY} r={R} fill="url(#svr-grad)" />

                {/* Flowing wave ribbons */}
                <g clipPath="url(#svr-clip)" filter="url(#svr-bloom)">
                  <WaveGroup paths={GROUP_A} rotate={null} />
                  <WaveGroup paths={GROUP_B} rotate={38}   />
                  <WaveGroup paths={GROUP_C} rotate={-38}  />
                </g>

                {/* Subtle outer ring shimmer */}
                <circle cx={CX} cy={CY} r={R} fill="none" stroke="#8B5CF6" strokeWidth="1.2" opacity="0.18" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}
