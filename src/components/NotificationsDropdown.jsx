import { motion } from 'framer-motion'
import { BellOff } from 'lucide-react'
import { useUserDataContext } from '../context/UserDataContext'
import { markNotificationAsRead, markAllNotificationsAsRead } from '../lib/userData'
import { formatRelativeTime } from '../lib/utils'

const PUR   = '#7C3AED'
const MUTED = '#888888'

function NotificationItem({ notif, onMarkRead }) {
  return (
    <div
      onClick={() => onMarkRead(notif)}
      style={{
        padding: '12px 16px',
        borderBottom: '1px solid #1a1a1a',
        display: 'flex', gap: 12,
        cursor: notif.read ? 'default' : 'pointer',
        background: notif.read ? 'transparent' : '#181822',
        transition: 'background 0.2s',
      }}
    >
      <div style={{
        width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
        marginTop: 6,
        background: notif.read ? 'transparent' : PUR,
        transition: 'background 0.2s',
      }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {notif.icon && (
            <span style={{ fontSize: 16, lineHeight: 1, flexShrink: 0 }}>{notif.icon}</span>
          )}
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
            {notif.title}
          </span>
        </div>
        {notif.message && (
          <div style={{ fontSize: 11, color: MUTED, marginTop: 4, lineHeight: 1.4 }}>
            {notif.message}
          </div>
        )}
        <div style={{ marginTop: 6, fontSize: 10, color: MUTED, opacity: 0.7 }}>
          {formatRelativeTime(notif.created_at)}
        </div>
      </div>
    </div>
  )
}

export default function NotificationsDropdown() {
  const {
    notifications,
    unreadCount,
    optimisticMarkAsRead,
    revertOptimisticMarkAsRead,
    optimisticMarkAllAsRead,
    revertOptimisticMarkAllAsRead,
  } = useUserDataContext()

  async function handleMarkRead(notif) {
    if (notif.read) return
    optimisticMarkAsRead(notif.id)
    const ok = await markNotificationAsRead(notif.id)
    if (!ok) revertOptimisticMarkAsRead(notif.id)
  }

  async function handleMarkAll() {
    const previousNotifications = [...notifications]
    const previousUnread        = unreadCount
    optimisticMarkAllAsRead()
    const ok = await markAllNotificationsAsRead()
    if (!ok) revertOptimisticMarkAllAsRead(previousNotifications, previousUnread)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        right: 0,
        width: 340,
        maxHeight: 500,
        background: '#0f0f0f',
        border: '1px solid #222',
        borderRadius: 14,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        zIndex: 100,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid #222',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Notificações</span>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            style={{
              background: 'none', border: 'none',
              color: PUR, fontSize: 11, fontWeight: 700,
              cursor: 'pointer', padding: 0,
            }}
          >
            Marcar todas
          </button>
        )}
      </div>

      {/* Lista */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {notifications.length === 0 ? (
          <div style={{
            padding: '32px 16px',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <BellOff size={32} color={MUTED} />
            <div style={{ fontSize: 12, color: MUTED, marginTop: 8 }}>Sem notificações</div>
            <div style={{
              fontSize: 10, color: MUTED, opacity: 0.6,
              marginTop: 4, textAlign: 'center', lineHeight: 1.5,
            }}>
              Avisos sobre conquistas, level e rank aparecem aqui.
            </div>
          </div>
        ) : (
          notifications.map(notif => (
            <NotificationItem
              key={notif.id}
              notif={notif}
              onMarkRead={handleMarkRead}
            />
          ))
        )}
      </div>
    </motion.div>
  )
}
