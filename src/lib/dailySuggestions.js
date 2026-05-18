const CATEGORIES = ['Fitness', 'Foco', 'Nutrição', 'Mindfulness', 'Social', 'Produtividade']

function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function getTodayKey() {
  const d   = new Date()
  const y   = d.getFullYear()
  const m   = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function getLocalDateKey(timestamp) {
  const d   = new Date(timestamp)
  const y   = d.getFullYear()
  const m   = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function selectDailySuggestions(suggestions) {
  if (!suggestions || suggestions.length === 0) return []
  const todayKey = getTodayKey()
  const result   = []
  CATEGORIES.forEach(category => {
    const inCategory = suggestions.filter(s => s.category === category)
    if (inCategory.length === 0) return
    const seed        = hashString(todayKey + category)
    const pickedIndex = seed % inCategory.length
    result.push(inCategory[pickedIndex])
  })
  return result
}

export function filterAlreadyAccepted(dailySuggestions, userTasks) {
  const today        = getTodayKey()
  const acceptedToday = userTasks.filter(
    t => getLocalDateKey(t.created_at) === today
  )
  const acceptedNames = new Set(acceptedToday.map(t => t.name))
  return dailySuggestions.filter(s => !acceptedNames.has(s.name))
}
