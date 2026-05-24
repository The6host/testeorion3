import { useState, useEffect, useRef } from 'react'
import { fetchAllUserData } from '../lib/userData'
import { supabase } from '../lib/supabase'

export function useUserData() {
  const [data,       setData]       = useState({ profile: null, stats: null, tasks: [], routineCompletions: [], exerciseCompletions: [], dayCompletions: [] })
  const [loading,    setLoading]    = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error,      setError]      = useState(null)
  const hasLoadedOnce               = useRef(false)
  const fetchGenRef                 = useRef(0)
  const reloadTimeoutRef            = useRef(null)
  const DEBOUNCE_MS                 = 300

  async function fetchData(isInitial = false) {
    const myGen = ++fetchGenRef.current

    if (isInitial) setLoading(true)
    else           setRefreshing(true)

    try {
      const userData = await fetchAllUserData()
      if (myGen !== fetchGenRef.current) return
      setData(userData)
      setError(null)
      hasLoadedOnce.current = true
    } catch (err) {
      if (myGen !== fetchGenRef.current) return
      console.error('Erro no useUserData:', err)
      setError(err)
    } finally {
      if (myGen === fetchGenRef.current) {
        if (isInitial) setLoading(false)
        else           setRefreshing(false)
      }
    }
  }

  async function reload() {
    if (!hasLoadedOnce.current) await fetchData(true)
    else                        await fetchData(false)
  }

  function debouncedReload() {
    if (reloadTimeoutRef.current) clearTimeout(reloadTimeoutRef.current)
    reloadTimeoutRef.current = setTimeout(() => {
      reloadTimeoutRef.current = null
      reload()
    }, DEBOUNCE_MS)
  }

  useEffect(() => {
    fetchData(true)

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        hasLoadedOnce.current = false
        fetchData(true)
      } else if (event === 'SIGNED_IN' && !hasLoadedOnce.current) {
        fetchData(true)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current)
        reloadTimeoutRef.current = null
      }
    }
  }, [])

  function optimisticCompleteTask(taskId) {
    fetchGenRef.current += 1
    setData(prev => {
      const idx = prev.tasks.findIndex(t => t.id === taskId)
      if (idx === -1) return prev
      const task = prev.tasks[idx]
      if (task.completed) return prev
      const updated = [...prev.tasks]
      updated[idx] = { ...task, completed: true, completed_at: new Date().toISOString() }
      return { ...prev, tasks: updated }
    })
  }

  function optimisticUncompleteTask(taskId) {
    fetchGenRef.current += 1
    setData(prev => {
      const idx = prev.tasks.findIndex(t => t.id === taskId)
      if (idx === -1) return prev
      const task = prev.tasks[idx]
      if (!task.completed) return prev
      const updated = [...prev.tasks]
      updated[idx] = { ...task, completed: false, completed_at: null }
      return { ...prev, tasks: updated }
    })
  }

  function revertOptimisticTaskChange(taskId, previousState) {
    setData(prev => {
      const idx = prev.tasks.findIndex(t => t.id === taskId)
      if (idx === -1) return prev
      const updated = [...prev.tasks]
      updated[idx] = { ...updated[idx], completed: previousState.completed, completed_at: previousState.completed_at }
      return { ...prev, tasks: updated }
    })
  }

  return {
    profile:                    data.profile,
    stats:                      data.stats,
    tasks:                      data.tasks,
    routineCompletions:         data.routineCompletions,
    exerciseCompletions:        data.exerciseCompletions,
    dayCompletions:             data.dayCompletions,
    loading,
    refreshing,
    error,
    reload,
    debouncedReload,
    optimisticCompleteTask,
    optimisticUncompleteTask,
    revertOptimisticTaskChange,
  }
}
