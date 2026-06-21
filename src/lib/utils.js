export function getInitials(name) {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function formatRelativeTime(isoString) {
  const now     = new Date()
  const then    = new Date(isoString)
  const diffMs  = now - then
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay  = Math.floor(diffHour / 24)

  if (diffSec < 60)   return 'agora'
  if (diffMin < 60)   return `${diffMin}min`
  if (diffHour < 24)  return `${diffHour}h`
  if (diffDay === 1)  return 'ontem'
  if (diffDay < 7)    return `${diffDay}d`

  const day   = String(then.getDate()).padStart(2, '0')
  const month = String(then.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}`
}
