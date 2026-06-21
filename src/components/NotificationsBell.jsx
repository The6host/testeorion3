import { useState, useRef, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { useUserDataContext } from '../context/UserDataContext'
import NotificationsDropdown from './NotificationsDropdown'

const MUTED = '#888888'

export default function NotificationsBell() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef        = useRef(null)
  const { unreadCount }     = useUserDataContext()

  useEffect(() => {
    if (!isOpen) return
    function handleOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [isOpen])

  const badgeText = unreadCount > 99 ? '99+' : String(unreadCount)

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(o => !o)}
        style={{
          position: 'relative',
          background: '#1a1a1a', border: '1px solid #222',
          borderRadius: 8, width: 34, height: 34,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <Bell size={15} color={MUTED} />
        {unreadCount > 0 && (
          <div style={{
            position: 'absolute', top: -4, right: -4,
            minWidth: 16, height: 16, padding: '2px 5px',
            borderRadius: 99,
            background: '#EF4444',
            color: '#fff', fontSize: 10, fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #080808',
            lineHeight: 1,
            pointerEvents: 'none',
          }}>
            {badgeText}
          </div>
        )}
      </button>

      {isOpen && <NotificationsDropdown />}
    </div>
  )
}
