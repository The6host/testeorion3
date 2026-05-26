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

  function optimisticCompleteExercise(exercise, planXpPerExercise) {
    fetchGenRef.current += 1
    setData(prev => ({
      ...prev,
      exerciseCompletions: [
        ...prev.exerciseCompletions,
        {
          id: `temp-${Date.now()}-${exercise.id}`,
          exercise_id: exercise.id,
          completed_at: new Date().toISOString(),
          exercise: { id: exercise.id, day: { plan: { xp_per_exercise: planXpPerExercise } } },
        },
      ],
      profile: prev.profile
        ? { ...prev.profile, total_xp: (prev.profile.total_xp || 0) + (planXpPerExercise || 0) }
        : prev.profile,
    }))
  }

  function optimisticUncompleteExercise(exerciseId, planXpPerExercise) {
    fetchGenRef.current += 1
    setData(prev => ({
      ...prev,
      exerciseCompletions: prev.exerciseCompletions.filter(ec => ec.exercise_id !== exerciseId),
      profile: prev.profile
        ? { ...prev.profile, total_xp: Math.max(0, (prev.profile.total_xp || 0) - (planXpPerExercise || 0)) }
        : prev.profile,
    }))
  }

  function revertOptimisticExerciseChange(exercise, planXpPerExercise, wasCompleted) {
    if (wasCompleted) {
      optimisticCompleteExercise(exercise, planXpPerExercise)
    } else {
      optimisticUncompleteExercise(exercise.id, planXpPerExercise)
    }
  }

  function optimisticCompleteRoutine(routine) {
    fetchGenRef.current += 1
    setData(prev => ({
      ...prev,
      routineCompletions: [
        {
          id: `temp-${Date.now()}`,
          completed_at: new Date().toISOString(),
          routine: { id: routine.id, name: routine.name, xp_value: routine.xp_value, module: routine.module },
        },
        ...prev.routineCompletions,
      ],
      profile: prev.profile
        ? { ...prev.profile, total_xp: (prev.profile.total_xp || 0) + (routine.xp_value || 0) }
        : prev.profile,
    }))
  }

  function revertOptimisticRoutineCompletion(routine) {
    setData(prev => ({
      ...prev,
      routineCompletions: prev.routineCompletions.filter(rc => !rc.id.startsWith('temp-')),
      profile: prev.profile
        ? { ...prev.profile, total_xp: Math.max(0, (prev.profile.total_xp || 0) - (routine.xp_value || 0)) }
        : prev.profile,
    }))
  }

  function optimisticCompleteWorkoutDay(dayId, planBonusXp) {
    fetchGenRef.current += 1
    setData(prev => ({
      ...prev,
      dayCompletions: [
        {
          id: `temp-${Date.now()}`,
          completed_at: new Date().toISOString(),
          day: { plan: { xp_bonus_per_day: planBonusXp } },
        },
        ...prev.dayCompletions,
      ],
      profile: prev.profile
        ? { ...prev.profile, total_xp: (prev.profile.total_xp || 0) + (planBonusXp || 0) }
        : prev.profile,
    }))
  }

  function revertOptimisticWorkoutDayCompletion(planBonusXp) {
    setData(prev => ({
      ...prev,
      dayCompletions: prev.dayCompletions.filter(dc => !dc.id.startsWith('temp-')),
      profile: prev.profile
        ? { ...prev.profile, total_xp: Math.max(0, (prev.profile.total_xp || 0) - (planBonusXp || 0)) }
        : prev.profile,
    }))
  }

  function optimisticAcceptSuggestion(suggestion) {
    fetchGenRef.current += 1
    setData(prev => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        {
          id:           `temp-suggestion-${Date.now()}-${suggestion.id}`,
          name:         suggestion.name,
          category:     suggestion.category,
          xp_value:     suggestion.xp_value,
          completed:    false,
          completed_at: null,
          created_at:   new Date().toISOString(),
        },
      ],
    }))
  }

  function revertOptimisticSuggestion() {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => !t.id.startsWith('temp-suggestion-')),
    }))
  }

  function optimisticUpdateDisplayName(newName) {
    fetchGenRef.current += 1
    setData(prev => ({
      ...prev,
      profile: prev.profile ? { ...prev.profile, display_name: newName } : prev.profile,
    }))
  }

  function revertOptimisticDisplayName(oldName) {
    setData(prev => ({
      ...prev,
      profile: prev.profile ? { ...prev.profile, display_name: oldName } : prev.profile,
    }))
  }

  function optimisticUpdateAvatar(newUrl) {
    fetchGenRef.current += 1
    setData(prev => ({
      ...prev,
      profile: prev.profile ? { ...prev.profile, avatar_url: newUrl } : prev.profile,
    }))
  }

  function revertOptimisticAvatar(oldUrl) {
    setData(prev => ({
      ...prev,
      profile: prev.profile ? { ...prev.profile, avatar_url: oldUrl } : prev.profile,
    }))
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
    optimisticAcceptSuggestion,
    revertOptimisticSuggestion,
    optimisticCompleteExercise,
    optimisticUncompleteExercise,
    revertOptimisticExerciseChange,
    optimisticCompleteRoutine,
    revertOptimisticRoutineCompletion,
    optimisticCompleteWorkoutDay,
    revertOptimisticWorkoutDayCompletion,
    optimisticUpdateDisplayName,
    revertOptimisticDisplayName,
    optimisticUpdateAvatar,
    revertOptimisticAvatar,
  }
}
