import { useState } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

const PUR = '#7C3AED'

const SIZES = {
  sm: { px: 38, radius: 10, borderWidth: 2, borderOpacity: '55', font: 13, gradient: false },
  md: { px: 56, radius: 14, borderWidth: 2, borderOpacity: '55', font: 17, gradient: true  },
  lg: { px: 74, radius: 18, borderWidth: 3, borderOpacity: '44', font: 24, gradient: true  },
}

function initials(name) {
  if (!name) return '??'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function Avatar({
  src,
  name = '',
  size = 'md',
  onClick,
  loading = false,
  showCameraIcon = false,
}) {
  const [failed, setFailed] = useState(false)
  const cfg       = SIZES[size] || SIZES.md
  const showImage = src && !failed
  const bg        = cfg.gradient ? 'linear-gradient(135deg, #7C3AED, #6D28D9)' : '#7C3AED'
  const border    = `${cfg.borderWidth}px solid ${PUR}${cfg.borderOpacity}`

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        width: cfg.px, height: cfg.px,
        borderRadius: cfg.radius,
        border,
        background: showImage ? '#111111' : bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {showImage && (
        <img
          src={src}
          alt={name || 'avatar'}
          onError={() => setFailed(true)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            borderRadius: cfg.radius,
          }}
        />
      )}

      {!showImage && (
        <span style={{ fontSize: cfg.font, fontWeight: 900, color: '#fff', lineHeight: 1 }}>
          {initials(name)}
        </span>
      )}

      {loading && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          borderRadius: cfg.radius,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2,
        }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{ display: 'flex' }}
          >
            <Loader2 size={Math.round(cfg.px * 0.38)} color="#fff" />
          </motion.div>
        </div>
      )}

      {showCameraIcon && !loading && (
        <div style={{
          position: 'absolute', bottom: -4, right: -4,
          width: 24, height: 24, borderRadius: '50%',
          background: PUR, border: '2px solid #080808',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 3,
          pointerEvents: 'none',
        }}>
          <Camera size={11} color="#fff" />
        </div>
      )}
    </div>
  )
}
