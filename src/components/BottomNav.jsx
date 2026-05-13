import { motion } from 'framer-motion'
import { Home, CheckSquare, Shield, Trophy, User } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const PUR = '#7C3AED'

const NAV_ITEMS = [
  { label: 'Home',    Icon: Home,        path: '/dashboard' },
  { label: 'Tasks',   Icon: CheckSquare, path: '/tasks'     },
  { label: 'Arena',   Icon: Shield,      path: '/arena'     },
  { label: 'Ranking', Icon: Trophy,      path: '/ranking'   },
  { label: 'Perfil',  Icon: User,        path: '/perfil'    },
]

function getActive(pathname) {
  if (pathname === '/dashboard') return 'Home'
  if (pathname === '/tasks')     return 'Tasks'
  if (pathname === '/arena')     return 'Arena'
  if (pathname === '/ranking')   return 'Ranking'
  if (pathname === '/perfil')    return 'Perfil'
  return ''
}

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const active = getActive(pathname)

  return (
    <div style={{
      position: 'fixed', bottom: 0, zIndex: 50,
      left: 'max(0px, calc(50% - 195px))',
      right: 'max(0px, calc(50% - 195px))',
      background: 'rgba(8,8,8,0.97)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid #1a1a1a',
      display: 'flex', height: 64,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {NAV_ITEMS.map(({ label, Icon, path }) => {
        const isActive = active === label
        return (
          <button
            key={label}
            onClick={() => path && navigate(path)}
            style={{
              flex: 1,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 3, background: 'none', border: 'none',
              cursor: path ? 'pointer' : 'default',
              padding: '8px 0',
              color: isActive ? PUR : '#444444',
              transition: 'color 0.2s',
            }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  style={{
                    position: 'absolute', inset: -8, borderRadius: 10,
                    background: `${PUR}18`,
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon size={20} style={{ position: 'relative', zIndex: 1 }} />
            </div>
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, lineHeight: 1 }}>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
