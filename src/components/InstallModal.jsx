import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download } from 'lucide-react'
import { isStandalone, isIOS } from '../lib/pwa'
import { useInstallPrompt } from '../context/InstallPromptContext'
import IOSInstallInstructions from './IOSInstallInstructions'

const STORAGE_KEY = 'orion_install_dismissed'

export default function InstallModal() {
  if (isStandalone()) return null
  if (localStorage.getItem(STORAGE_KEY)) return null

  return <InstallModalInner />
}

function InstallModalInner() {
  const [visible, setVisible] = useState(false)
  const { canInstall, triggerInstall } = useInstallPrompt()
  const ios = isIOS()

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(t)
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  async function handleInstall() {
    await triggerInstall()
    setVisible(false)
  }

  if (!ios && !canInstall) return null

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={dismiss}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: 1000,
            }}
          />
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0,
              background: '#111111',
              borderTop: '1px solid #222222',
              borderRadius: '20px 20px 0 0',
              padding: '24px 20px 40px',
              zIndex: 1001,
              maxWidth: 520,
              margin: '0 auto',
            }}
          >
            {/* drag handle */}
            <div style={{
              width: 36, height: 4, borderRadius: 99,
              background: '#333', margin: '0 auto 20px',
            }} />

            {/* header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 13,
                  background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Download size={22} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>Instalar Orion</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Acesso rápido, funciona offline</div>
                </div>
              </div>
              <button
                onClick={dismiss}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: 4, color: '#555',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* content */}
            {ios ? (
              <IOSInstallInstructions />
            ) : (
              <button
                onClick={handleInstall}
                style={{
                  width: '100%', padding: '14px 0',
                  background: '#7C3AED', border: 'none', borderRadius: 12,
                  color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                }}
              >
                Instalar agora
              </button>
            )}

            {/* dismiss link */}
            <button
              onClick={dismiss}
              style={{
                display: 'block', width: '100%', marginTop: 14,
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, color: '#555', textAlign: 'center',
              }}
            >
              Agora não
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
