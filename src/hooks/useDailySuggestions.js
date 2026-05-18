import { useState, useEffect } from 'react'
import { fetchAllSuggestions } from '../lib/userData'
import { selectDailySuggestions, filterAlreadyAccepted } from '../lib/dailySuggestions'

export function useDailySuggestions(userTasks) {
  const [pool,    setPool]    = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllSuggestions().then(data => {
      setPool(data)
      setLoading(false)
    })
  }, [])

  const daily   = selectDailySuggestions(pool)
  const visible = filterAlreadyAccepted(daily, userTasks || [])

  return { suggestions: visible, loading }
}
