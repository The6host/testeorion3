import { useState, useEffect, useRef } from 'react'
import { fetchAllUserData } from '../lib/userData'
import { supabase } from '../lib/supabase'

export function useUserData() {
  const [data,       setData]       = useState({ profile: null, stats: null, tasks: [] })
  const [loading,    setLoading]    = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error,      setError]      = useState(null)
  const hasLoadedOnce               = useRef(false)

  async function fetchData(isInitial = false) {
    if (isInitial) setLoading(true)
    else           setRefreshing(true)

    try {
      const userData = await fetchAllUserData()
      setData(userData)
      setError(null)
      hasLoadedOnce.current = true
    } catch (err) {
      console.error('Erro no useUserData:', err)
      setError(err)
    } finally {
      if (isInitial) setLoading(false)
      else           setRefreshing(false)
    }
  }

  async function reload() {
    if (!hasLoadedOnce.current) await fetchData(true)
    else                        await fetchData(false)
  }

  useEffect(() => {
    fetchData(true)

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        hasLoadedOnce.current = false
        fetchData(true)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return {
    profile:    data.profile,
    stats:      data.stats,
    tasks:      data.tasks,
    loading,
    refreshing,
    error,
    reload,
  }
}
