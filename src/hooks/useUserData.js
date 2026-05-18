import { useState, useEffect } from 'react'
import { fetchAllUserData } from '../lib/userData'
import { supabase } from '../lib/supabase'

export function useUserData() {
  const [data,    setData]    = useState({ profile: null, stats: null, tasks: [] })
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  async function reload() {
    setLoading(true)
    try {
      const userData = await fetchAllUserData()
      setData(userData)
      setError(null)
    } catch (err) {
      console.error('Erro no useUserData:', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        reload()
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return {
    profile: data.profile,
    stats:   data.stats,
    tasks:   data.tasks,
    loading,
    error,
    reload,
  }
}
