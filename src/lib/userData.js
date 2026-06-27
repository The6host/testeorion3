import { supabase } from './supabase'
import { getTodayKey, getLocalDateKey } from './dailySuggestions'
import { CATEGORY_ATTRIBUTES, MAX_ATTRIBUTE_VALUE, MIN_ATTRIBUTE_VALUE } from './categories'
import { getAchievementById, formatAchievementTitle } from './achievements'
import { checkAchievements, checkLevelAndRankUp } from './achievementChecker'

// ───────── LEITURA ─────────

export async function fetchProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Erro ao buscar profile:', error)
    return null
  }
  return data
}

export async function fetchUserStats() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Erro ao buscar user_stats:', error)
    return null
  }
  return data
}

export async function fetchRoutineCompletions() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('routine_completions')
    .select(`
      id,
      completed_at,
      routine:routines (
        id,
        name,
        xp_value,
        module
      )
    `)
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar routine_completions:', error)
    return []
  }
  return data || []
}

export async function fetchTasks() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar tasks:', error)
    return []
  }
  return data || []
}

export async function expireOverdueTasks() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const today                  = getTodayKey()
  const startOfTodayLocalAsUtc = new Date(`${today}T00:00:00`).toISOString()

  const { data, error } = await supabase
    .from('tasks')
    .delete()
    .eq('user_id', user.id)
    .eq('completed', false)
    .lt('created_at', startOfTodayLocalAsUtc)
    .select('id')

  if (error) {
    console.error('Erro ao expirar tasks vencidas:', error)
    return 0
  }

  return data ? data.length : 0
}

export async function checkAndDecayStreak(profile) {
  if (!profile) return profile
  if (!profile.last_active_date) return profile
  if (profile.streak_count === 0) return profile

  const today     = getTodayKey()
  const lastDate  = new Date(`${profile.last_active_date}T00:00:00`)
  const todayDate = new Date(`${today}T00:00:00`)
  const diffDays  = Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24))

  if (diffDays <= 1) return profile

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return profile

  const { error } = await supabase
    .from('profiles')
    .update({ streak_count: 0, updated_at: new Date().toISOString() })
    .eq('id', user.id)

  if (error) { console.error('Erro ao decair streak:', error); return profile }

  return { ...profile, streak_count: 0 }
}

export async function fetchAllUserData() {
  await expireOverdueTasks()
  await expireOverdueExerciseCompletions()

  const [
    profileRaw, stats, tasks, routineCompletions,
    exerciseCompletions, dayCompletions, favorites,
    monthlyTraining, monthlyAppearance,
    notifications, unreadCount, userAchievements,
    lifetimeCounts, runs, monthlyRunning,
  ] = await Promise.all([
    fetchProfile(),
    fetchUserStats(),
    fetchTasks(),
    fetchRoutineCompletions(),
    fetchTodayExerciseCompletionsWithXP(),
    fetchTodayDayCompletionsWithXP(),
    fetchFavorites(),
    fetchMonthlyTrainingStats(),
    fetchMonthlyAppearanceStats(),
    fetchNotifications(),
    fetchUnreadCount(),
    fetchUserAchievements(),
    fetchLifetimeCounts(),
    fetchUserRuns(),
    fetchMonthlyRunStats(),
  ])

  const profile = await checkAndDecayStreak(profileRaw)
  const monthlyStats = { training: monthlyTraining, appearance: monthlyAppearance, running: monthlyRunning }
  return { profile, stats, tasks, routineCompletions, exerciseCompletions, dayCompletions, favorites, monthlyStats, notifications, unreadCount, userAchievements, lifetimeCounts, runs }
}

// ───────── SUGESTÕES ─────────

export async function fetchAllSuggestions() {
  const { data, error } = await supabase
    .from('task_suggestions')
    .select('*')

  if (error) {
    console.error('Erro ao buscar task_suggestions:', error)
    return []
  }
  return data || []
}

export async function acceptSuggestion(suggestion) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const today        = getTodayKey()
  const startOfDay   = new Date(`${today}T00:00:00`).toISOString()
  const endOfDay     = new Date(`${today}T23:59:59`).toISOString()
  const { data: existing } = await supabase
    .from('tasks')
    .select('id')
    .eq('user_id', user.id)
    .eq('name', suggestion.name)
    .gte('created_at', startOfDay)
    .lte('created_at', endOfDay)

  if (existing && existing.length > 0) return existing[0]

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id:   user.id,
      name:      suggestion.name,
      category:  suggestion.category,
      xp_value:  suggestion.xp_value,
      completed: false,
    })
    .select()
    .single()

  if (error) {
    console.error('Erro ao aceitar sugestão:', error)
    return null
  }
  return data
}

// ───────── XP / COMPLETAR ─────────

async function addXP(amount) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { xpAntes: 0, xpDepois: 0 }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('total_xp')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) return { xpAntes: 0, xpDepois: 0 }

  const xpAntes  = profile.total_xp
  const xpDepois = Math.max(0, xpAntes + amount)
  const newLevel = Math.floor(xpDepois / 500) + 1

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ total_xp: xpDepois, level: newLevel, updated_at: new Date().toISOString() })
    .eq('id', user.id)

  if (updateError) {
    console.error('Erro ao atualizar XP:', updateError)
    return { xpAntes: 0, xpDepois: 0 }
  }

  return { xpAntes, xpDepois }
}

async function adjustAttributesByCategory(category, amount) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const attrsToUpdate = CATEGORY_ATTRIBUTES[category]
  if (!attrsToUpdate || attrsToUpdate.length === 0) {
    console.warn('Categoria sem mapeamento de atributos:', category)
    return
  }

  const { data: currentStats, error: fetchError } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (fetchError || !currentStats) {
    console.error('Erro ao buscar user_stats:', fetchError)
    return
  }

  const updates = {}
  attrsToUpdate.forEach(attr => {
    const current = currentStats[attr] || 0
    updates[attr] = Math.max(MIN_ATTRIBUTE_VALUE, Math.min(MAX_ATTRIBUTE_VALUE, current + amount))
  })
  updates.updated_at = new Date().toISOString()

  const { error: updateError } = await supabase
    .from('user_stats')
    .update(updates)
    .eq('user_id', user.id)

  if (updateError) console.error('Erro ao atualizar atributos:', updateError)
}

async function updateStreakAfterCompletion() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('streak_count, last_active_date')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    console.error('Erro ao buscar profile pro streak:', profileError)
    return
  }

  const today      = getTodayKey()
  const startOfDay = new Date(`${today}T00:00:00`).toISOString()
  const endOfDay   = new Date(`${today}T23:59:59.999`).toISOString()

  const { count: tasksCount, error: tasksError } = await supabase
    .from('tasks')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('completed', true)
    .gte('completed_at', startOfDay)
    .lte('completed_at', endOfDay)

  if (tasksError) {
    console.error('Erro ao contar tasks de hoje:', tasksError)
    return
  }

  const { count: routinesCount, error: routinesError } = await supabase
    .from('routine_completions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('completed_at', startOfDay)
    .lte('completed_at', endOfDay)

  if (routinesError) {
    console.error('Erro ao contar rotinas de hoje:', routinesError)
    return
  }

  const totalActivitiesToday = (tasksCount || 0) + (routinesCount || 0)

  if (totalActivitiesToday > 1) {
    await supabase
      .from('profiles')
      .update({ last_active_date: today, updated_at: new Date().toISOString() })
      .eq('id', user.id)
    return
  }

  let newStreakCount
  const lastActive = profile.last_active_date

  if (!lastActive) {
    newStreakCount = 1
  } else {
    const lastDate  = new Date(`${lastActive}T00:00:00`)
    const todayDate = new Date(`${today}T00:00:00`)
    const diffDays  = Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24))

    if (diffDays === 0)      newStreakCount = profile.streak_count
    else if (diffDays === 1) newStreakCount = profile.streak_count + 1
    else                     newStreakCount = 1
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      streak_count:     newStreakCount,
      last_active_date: today,
      updated_at:       new Date().toISOString(),
    })
    .eq('id', user.id)

  if (updateError) console.error('Erro ao atualizar streak:', updateError)
}

export async function completeTask(taskId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .eq('user_id', user.id)
    .single()

  if (taskError || !task) { console.error('Erro ao buscar task:', taskError); return null }

  const { data: updatedTask, error: updateError } = await supabase
    .from('tasks')
    .update({ completed: true, completed_at: new Date().toISOString() })
    .eq('id', taskId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (updateError) { console.error('Erro ao completar task:', updateError); return null }

  const { xpAntes, xpDepois } = await addXP(task.xp_value) || { xpAntes: 0, xpDepois: 0 }
  await adjustAttributesByCategory(task.category, +1)
  await updateStreakAfterCompletion()

  checkAchievements({
    triggeredBy:      'task',
    completedAtLocal: new Date(updatedTask.completed_at),
    taskCategory:     task.category,
  }).catch(err => console.error('[checker] task:', err))
  checkLevelAndRankUp(xpAntes, xpDepois).catch(err => console.error('[level/rank] task:', err))

  return updatedTask
}

export async function uncompleteTask(taskId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .eq('user_id', user.id)
    .single()

  if (taskError || !task) { console.error('Erro ao buscar task:', taskError); return null }
  if (!task.completed || !task.completed_at) return null

  const completedDate = getLocalDateKey(task.completed_at)
  const today         = getTodayKey()
  if (completedDate !== today) {
    console.warn('Task completada em dia anterior — não pode ser desmarcada')
    return { locked: true }
  }

  const { data: updatedTask, error: updateError } = await supabase
    .from('tasks')
    .update({ completed: false, completed_at: null })
    .eq('id', taskId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (updateError) { console.error('Erro ao desmarcar task:', updateError); return null }

  await addXP(-task.xp_value)
  await adjustAttributesByCategory(task.category, -1)
  return updatedTask
}

export async function deleteTask(taskId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', user.id)

  if (error) { console.error('Erro ao deletar task:', error); return false }
  return true
}

// ───────── ROTINAS ─────────

export async function fetchRoutinesByModule(module) {
  const { data, error } = await supabase
    .from('routines')
    .select('*')
    .eq('module', module)
    .order('display_order', { ascending: true })

  if (error) { console.error('Erro ao buscar rotinas:', error); return [] }
  return data || []
}

export async function fetchRoutineSteps(routineId) {
  const { data, error } = await supabase
    .from('routine_steps')
    .select('*')
    .eq('routine_id', routineId)
    .order('step_order', { ascending: true })

  if (error) { console.error('Erro ao buscar passos da rotina:', error); return [] }
  return data || []
}

export async function fetchRoutineStepsCount(routineId) {
  const { count, error } = await supabase
    .from('routine_steps')
    .select('id', { count: 'exact', head: true })
    .eq('routine_id', routineId)

  if (error) { console.error('Erro ao contar passos da rotina:', error); return 0 }
  return count || 0
}

async function adjustAttributesByRoutine(attributesObj) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  if (!attributesObj || Object.keys(attributesObj).length === 0) return

  const { data: currentStats, error: fetchError } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (fetchError || !currentStats) { console.error('Erro ao buscar user_stats:', fetchError); return }

  const updates = {}
  for (const [attr, amount] of Object.entries(attributesObj)) {
    const current = currentStats[attr] || 0
    updates[attr] = Math.max(MIN_ATTRIBUTE_VALUE, Math.min(MAX_ATTRIBUTE_VALUE, current + amount))
  }
  updates.updated_at = new Date().toISOString()

  const { error: updateError } = await supabase
    .from('user_stats')
    .update(updates)
    .eq('user_id', user.id)

  if (updateError) console.error('Erro ao atualizar atributos da rotina:', updateError)
}

export async function completeRoutine(routine) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: completion, error: completionError } = await supabase
    .from('routine_completions')
    .insert({ user_id: user.id, routine_id: routine.id })
    .select()
    .single()

  if (completionError) { console.error('Erro ao registrar completion:', completionError); return null }

  const { xpAntes, xpDepois } = await addXP(routine.xp_value) || { xpAntes: 0, xpDepois: 0 }
  await adjustAttributesByRoutine(routine.attributes)
  await updateStreakAfterCompletion()

  checkAchievements({
    triggeredBy:      'routine',
    completedAtLocal: new Date(),
  }).catch(err => console.error('[checker] routine:', err))
  checkLevelAndRankUp(xpAntes, xpDepois).catch(err => console.error('[level/rank] routine:', err))

  return completion
}

// ───────── ACADEMIA ─────────

export async function fetchWorkoutPlans(module = null) {
  let query = supabase
    .from('workout_plans')
    .select('*')
    .order('display_order', { ascending: true })
  if (module) query = query.eq('module', module)
  const { data, error } = await query
  if (error) { console.error('Erro ao buscar workout_plans:', error); return [] }
  return data || []
}

export async function fetchWorkoutPlanFull(planId) {
  const { data, error } = await supabase
    .from('workout_plans')
    .select(`*, workout_days (*, workout_exercises (*))`)
    .eq('id', planId)
    .single()
  if (error) { console.error('Erro ao buscar plano completo:', error); return null }
  if (data?.workout_days) {
    data.workout_days.sort((a, b) => a.display_order - b.display_order)
    data.workout_days.forEach(d => {
      if (d.workout_exercises) {
        d.workout_exercises.sort((a, b) => a.display_order - b.display_order)
      }
    })
  }
  return data
}

export async function fetchTodayExerciseCompletions() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const today      = getTodayKey()
  const startOfDay = new Date(`${today}T00:00:00`).toISOString()
  const endOfDay   = new Date(`${today}T23:59:59.999`).toISOString()

  const { data, error } = await supabase
    .from('exercise_completions')
    .select('*')
    .eq('user_id', user.id)
    .gte('completed_at', startOfDay)
    .lte('completed_at', endOfDay)

  if (error) { console.error('Erro ao buscar exercise_completions:', error); return [] }
  return data || []
}

export async function selectWorkoutPlan(planId, module = 'academia') {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const column = module === 'calistenia' ? 'current_calisthenics_plan_id' : 'current_workout_plan_id'
  const { error } = await supabase
    .from('profiles')
    .update({ [column]: planId, updated_at: new Date().toISOString() })
    .eq('id', user.id)
  if (error) { console.error('Erro ao selecionar planilha:', error); return false }
  return true
}

export async function completeExercise(exercise, planXpPerExercise) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('exercise_completions')
    .insert({ user_id: user.id, exercise_id: exercise.id })
    .select()
    .single()

  if (error) { console.error('Erro ao registrar exercise_completion:', error); return null }

  const { xpAntes, xpDepois } = await addXP(planXpPerExercise) || { xpAntes: 0, xpDepois: 0 }

  checkAchievements({
    triggeredBy:      'exercise',
    completedAtLocal: new Date(),
  }).catch(err => console.error('[checker] exercise:', err))
  checkLevelAndRankUp(xpAntes, xpDepois).catch(err => console.error('[level/rank] exercise:', err))

  return data
}

export async function uncompleteExercise(exerciseId, planXpPerExercise) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const today      = getTodayKey()
  const startOfDay = new Date(`${today}T00:00:00`).toISOString()
  const endOfDay   = new Date(`${today}T23:59:59.999`).toISOString()

  const { data: completion, error: fetchError } = await supabase
    .from('exercise_completions')
    .select('id')
    .eq('user_id', user.id)
    .eq('exercise_id', exerciseId)
    .gte('completed_at', startOfDay)
    .lte('completed_at', endOfDay)
    .order('completed_at', { ascending: false })
    .limit(1)
    .single()

  if (fetchError || !completion) return null

  const { error: deleteError } = await supabase
    .from('exercise_completions')
    .delete()
    .eq('id', completion.id)

  if (deleteError) { console.error('Erro ao desmarcar exercício:', deleteError); return null }

  await addXP(-planXpPerExercise)
  return { ok: true }
}

async function adjustCalisthenicsAttributes(amount) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: currentStats, error: fetchError } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (fetchError || !currentStats) return

  const newAgilidade  = Math.max(MIN_ATTRIBUTE_VALUE, Math.min(MAX_ATTRIBUTE_VALUE, (currentStats.agilidade  || 0) + amount))
  const newVitalidade = Math.max(MIN_ATTRIBUTE_VALUE, Math.min(MAX_ATTRIBUTE_VALUE, (currentStats.vitalidade || 0) + amount))

  const { error } = await supabase
    .from('user_stats')
    .update({ agilidade: newAgilidade, vitalidade: newVitalidade, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)

  if (error) console.error('Erro ao ajustar atributos calistenia:', error)
}

async function adjustFitnessAttributes(amount) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: currentStats, error: fetchError } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (fetchError || !currentStats) return

  const newForca     = Math.max(MIN_ATTRIBUTE_VALUE, Math.min(MAX_ATTRIBUTE_VALUE, (currentStats.forca || 0) + amount))
  const newAgilidade = Math.max(MIN_ATTRIBUTE_VALUE, Math.min(MAX_ATTRIBUTE_VALUE, (currentStats.agilidade || 0) + amount))

  const { error } = await supabase
    .from('user_stats')
    .update({ forca: newForca, agilidade: newAgilidade, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)

  if (error) console.error('Erro ao ajustar atributos fitness:', error)
}

export async function completeWorkoutDay(dayId, planBonusXp, planModule = 'academia') {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('workout_day_completions')
    .insert({ user_id: user.id, day_id: dayId })
    .select()
    .single()

  if (error) { console.error('Erro ao registrar workout_day_completion:', error); return null }

  const { xpAntes, xpDepois } = await addXP(planBonusXp) || { xpAntes: 0, xpDepois: 0 }
  if (planModule === 'calistenia') {
    await adjustCalisthenicsAttributes(+1)
  } else {
    await adjustFitnessAttributes(+1)
  }
  await updateStreakAfterCompletion()

  checkAchievements({
    triggeredBy:      'workoutDay',
    completedAtLocal: new Date(),
  }).catch(err => console.error('[checker] workoutDay:', err))
  checkLevelAndRankUp(xpAntes, xpDepois).catch(err => console.error('[level/rank] workoutDay:', err))

  return data
}

export async function fetchTodayCompletedDayIds(dayIds) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !dayIds.length) return []

  const today      = getTodayKey()
  const startOfDay = new Date(`${today}T00:00:00`).toISOString()
  const endOfDay   = new Date(`${today}T23:59:59.999`).toISOString()

  const { data, error } = await supabase
    .from('workout_day_completions')
    .select('day_id')
    .eq('user_id', user.id)
    .in('day_id', dayIds)
    .gte('completed_at', startOfDay)
    .lte('completed_at', endOfDay)

  if (error) { console.error('Erro ao buscar dias completos:', error); return [] }
  return (data || []).map(r => r.day_id)
}

export async function isDayAlreadyCompletedToday(dayId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const today      = getTodayKey()
  const startOfDay = new Date(`${today}T00:00:00`).toISOString()
  const endOfDay   = new Date(`${today}T23:59:59.999`).toISOString()

  const { data, error } = await supabase
    .from('workout_day_completions')
    .select('id')
    .eq('user_id', user.id)
    .eq('day_id', dayId)
    .gte('completed_at', startOfDay)
    .lte('completed_at', endOfDay)

  if (error) return false
  return (data || []).length > 0
}

export async function expireOverdueExerciseCompletions() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const today                  = getTodayKey()
  const startOfTodayLocalAsUtc = new Date(`${today}T00:00:00`).toISOString()

  const { data, error } = await supabase
    .from('exercise_completions')
    .delete()
    .eq('user_id', user.id)
    .lt('completed_at', startOfTodayLocalAsUtc)
    .select('id')

  if (error) { console.error('Erro ao expirar exercise_completions:', error); return 0 }
  return data ? data.length : 0
}

export async function fetchTodayExerciseCompletionsWithXP() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const today      = getTodayKey()
  const startOfDay = new Date(`${today}T00:00:00`).toISOString()
  const endOfDay   = new Date(`${today}T23:59:59.999`).toISOString()

  const { data, error } = await supabase
    .from('exercise_completions')
    .select(`
      id,
      completed_at,
      exercise:workout_exercises (
        id,
        day:workout_days (
          plan:workout_plans (
            xp_per_exercise
          )
        )
      )
    `)
    .eq('user_id', user.id)
    .gte('completed_at', startOfDay)
    .lte('completed_at', endOfDay)

  if (error) { console.error('Erro ao buscar exercise_completions com XP:', error); return [] }
  return data || []
}

export async function fetchTodayDayCompletionsWithXP() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const today      = getTodayKey()
  const startOfDay = new Date(`${today}T00:00:00`).toISOString()
  const endOfDay   = new Date(`${today}T23:59:59.999`).toISOString()

  const { data, error } = await supabase
    .from('workout_day_completions')
    .select(`
      id,
      completed_at,
      day:workout_days (
        plan:workout_plans (
          xp_bonus_per_day
        )
      )
    `)
    .eq('user_id', user.id)
    .gte('completed_at', startOfDay)
    .lte('completed_at', endOfDay)

  if (error) { console.error('Erro ao buscar workout_day_completions com XP:', error); return [] }
  return data || []
}

// ───────── PERFIL ─────────

export async function updateDisplayName(newName) {
  const trimmed = newName.trim()
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(trimmed)) return null

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .update({ display_name: trimmed, updated_at: new Date().toISOString() })
    .eq('id', user.id)
    .select()
    .single()

  if (error) { console.error('Erro ao atualizar display_name:', error); return null }
  return data
}

async function resizeToWebP(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const SIZE = 400
      const canvas = document.createElement('canvas')
      canvas.width  = SIZE
      canvas.height = SIZE
      const ctx = canvas.getContext('2d')
      const min = Math.min(img.width, img.height)
      const sx  = (img.width  - min) / 2
      const sy  = (img.height - min) / 2
      ctx.drawImage(img, sx, sy, min, min, 0, 0, SIZE, SIZE)
      canvas.toBlob(
        blob => blob ? resolve(blob) : reject(new Error('Falha ao converter imagem')),
        'image/webp',
        0.85
      )
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Falha ao carregar imagem')) }
    img.src = url
  })
}

export async function uploadAvatar(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return { error: 'Formato inválido. Use JPG, PNG ou WebP' }
  }
  if (file.size > 2097152) {
    return { error: 'Arquivo muito grande. Máximo 2MB' }
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Erro ao enviar. Tente novamente' }

  let blob
  try {
    blob = await resizeToWebP(file)
  } catch (err) {
    console.error('Erro ao redimensionar imagem:', err)
    return { error: 'Erro ao enviar. Tente novamente' }
  }

  const path = `${user.id}/avatar.webp`
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, blob, { upsert: true, contentType: 'image/webp' })

  if (uploadError) {
    console.error('Erro ao fazer upload do avatar:', uploadError)
    return { error: 'Erro ao enviar. Tente novamente' }
  }

  const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
  const newUrl = `${urlData.publicUrl}?v=${Date.now()}`

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: newUrl, updated_at: new Date().toISOString() })
    .eq('id', user.id)

  if (updateError) {
    console.error('Erro ao atualizar avatar_url:', updateError)
    return { error: 'Erro ao enviar. Tente novamente' }
  }

  return { url: newUrl }
}

export async function removeAvatar() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { error: storageError } = await supabase.storage
    .from('avatars')
    .remove([`${user.id}/avatar.webp`])

  if (storageError) console.error('Erro ao remover avatar do storage:', storageError)

  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: null, updated_at: new Date().toISOString() })
    .eq('id', user.id)

  if (error) { console.error('Erro ao zerar avatar_url:', error); return false }
  return true
}

// ───────── MÉTRICAS MENSAIS ─────────

function getMonthStartISO() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0).toISOString()
}

export async function fetchMonthlyTrainingStats() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { xpTotal: 0, sessionsCount: 0, exercisesCount: 0 }

  const monthStart = getMonthStartISO()

  const [{ data: exData, error: exError }, { data: dcData, error: dcError }] = await Promise.all([
    supabase
      .from('exercise_completions')
      .select(`
        completed_at,
        exercise:workout_exercises (
          day:workout_days (
            plan:workout_plans ( xp_per_exercise )
          )
        )
      `)
      .eq('user_id', user.id)
      .gte('completed_at', monthStart),

    supabase
      .from('workout_day_completions')
      .select(`
        completed_at,
        day:workout_days (
          plan:workout_plans ( xp_bonus_per_day )
        )
      `)
      .eq('user_id', user.id)
      .gte('completed_at', monthStart),
  ])

  if (exError) console.error('Erro ao buscar exercise_completions mensais:', exError)
  if (dcError) console.error('Erro ao buscar workout_day_completions mensais:', dcError)

  const exercisesCount  = (exData || []).length
  const xpFromExercises = (exData || []).reduce((s, r) => s + (r.exercise?.day?.plan?.xp_per_exercise || 0), 0)
  const xpFromDays      = (dcData || []).reduce((s, r) => s + (r.day?.plan?.xp_bonus_per_day || 0), 0)
  const sessionsCount   = new Set((exData || []).map(r => getLocalDateKey(r.completed_at))).size

  return { xpTotal: xpFromExercises + xpFromDays, sessionsCount, exercisesCount }
}

export async function fetchMonthlyAppearanceStats() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { xpTotal: 0, routinesCount: 0 }

  const monthStart = getMonthStartISO()

  const { data, error } = await supabase
    .from('routine_completions')
    .select(`
      completed_at,
      routine:routines ( xp_value )
    `)
    .eq('user_id', user.id)
    .gte('completed_at', monthStart)

  if (error) { console.error('Erro ao buscar routine_completions mensais:', error); return { xpTotal: 0, routinesCount: 0 } }

  const routinesCount = (data || []).length
  const xpTotal       = (data || []).reduce((s, r) => s + (r.routine?.xp_value || 0), 0)

  return { xpTotal, routinesCount }
}

// ───────── CORRIDA ─────────

async function adjustRunningAttributes(distanceKm) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const vitalidadeBoost = Math.round(distanceKm)
  const agilidadeBoost  = Math.round(distanceKm)
  const focoBoost       = Math.floor(distanceKm / 3)

  if (vitalidadeBoost === 0 && focoBoost === 0) return

  const { data: currentStats, error: fetchError } = await supabase
    .from('user_stats')
    .select('vitalidade, agilidade, foco')
    .eq('user_id', user.id)
    .single()

  if (fetchError || !currentStats) return

  const updates = { updated_at: new Date().toISOString() }

  if (vitalidadeBoost > 0) {
    updates.vitalidade = Math.max(MIN_ATTRIBUTE_VALUE, Math.min(MAX_ATTRIBUTE_VALUE, (currentStats.vitalidade || 0) + vitalidadeBoost))
    updates.agilidade  = Math.max(MIN_ATTRIBUTE_VALUE, Math.min(MAX_ATTRIBUTE_VALUE, (currentStats.agilidade  || 0) + agilidadeBoost))
  }
  if (focoBoost > 0) {
    updates.foco = Math.max(MIN_ATTRIBUTE_VALUE, Math.min(MAX_ATTRIBUTE_VALUE, (currentStats.foco || 0) + focoBoost))
  }

  const { error } = await supabase
    .from('user_stats')
    .update(updates)
    .eq('user_id', user.id)

  if (error) console.error('Erro ao ajustar atributos corrida:', error)
}

/**
 * Salva uma corrida finalizada.
 * IMPORTANTE: a validação de critério mínimo (>= 60s E >= 100m) é responsabilidade da UI
 * que chama esta função. saveRun não rejeita corridas curtas — apenas persiste o que recebeu.
 * Isso será implementado na Onda 2.
 */
export async function saveRun(runData) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const {
    distanceMeters,
    durationSeconds,
    paceSecondsPerKm,
    averageSpeedKmh,
    steps,
    calories,
    startedAt,
    endedAt,
  } = runData

  const distanceKm = distanceMeters / 1000
  const baseXp     = Math.floor(distanceKm * 50)
  const fastBonus  = (paceSecondsPerKm != null && paceSecondsPerKm < 360) ? Math.floor(distanceKm * 20) : 0
  const longBonus  = distanceMeters >= 5000 ? 100 : 0
  const xpEarned   = baseXp + fastBonus + longBonus

  const { data: run, error } = await supabase
    .from('runs')
    .insert({
      user_id:             user.id,
      distance_meters:     distanceMeters,
      duration_seconds:    durationSeconds,
      pace_seconds_per_km: paceSecondsPerKm ?? null,
      average_speed_kmh:   averageSpeedKmh  ?? null,
      steps:               steps            ?? null,
      calories:            calories         ?? null,
      xp_earned:           xpEarned,
      started_at:          startedAt,
      ended_at:            endedAt,
    })
    .select()
    .single()

  if (error) { console.error('Erro ao salvar corrida:', error); return null }

  const { xpAntes, xpDepois } = await addXP(xpEarned) || { xpAntes: 0, xpDepois: 0 }
  await adjustRunningAttributes(distanceKm)
  await updateStreakAfterCompletion()

  checkAchievements({
    triggeredBy:      'run',
    completedAtLocal: new Date(),
  }).catch(err => console.error('[checker] run:', err))
  checkLevelAndRankUp(xpAntes, xpDepois).catch(err => console.error('[level/rank] run:', err))

  return { ...run, xp_earned: xpEarned }
}

export async function fetchUserRuns(limit = 30) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('runs')
    .select('*')
    .eq('user_id', user.id)
    .order('started_at', { ascending: false })
    .limit(limit)

  if (error) { console.error('Erro ao buscar corridas:', error); return [] }
  return data || []
}

export async function fetchMonthlyRunStats() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { totalDistanceMeters: 0, totalDurationSeconds: 0, sessionsCount: 0, totalXP: 0, bestPaceSecondsPerKm: null }

  const monthStart = getMonthStartISO()

  const { data, error } = await supabase
    .from('runs')
    .select('distance_meters, duration_seconds, xp_earned, pace_seconds_per_km')
    .eq('user_id', user.id)
    .gte('started_at', monthStart)

  if (error) {
    console.error('Erro ao buscar stats mensais de corrida:', error)
    return { totalDistanceMeters: 0, totalDurationSeconds: 0, sessionsCount: 0, totalXP: 0, bestPaceSecondsPerKm: null }
  }

  const rows                = data || []
  const totalDistanceMeters = rows.reduce((s, r) => s + (r.distance_meters  || 0), 0)
  const totalDurationSeconds = rows.reduce((s, r) => s + (r.duration_seconds || 0), 0)
  const sessionsCount        = rows.length
  const totalXP              = rows.reduce((s, r) => s + (r.xp_earned        || 0), 0)
  const paces                = rows.map(r => r.pace_seconds_per_km).filter(p => p != null)
  const bestPaceSecondsPerKm = paces.length > 0 ? Math.min(...paces) : null

  return { totalDistanceMeters, totalDurationSeconds, sessionsCount, totalXP, bestPaceSecondsPerKm }
}

export async function deleteRun(runId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { error } = await supabase
    .from('runs')
    .delete()
    .eq('id', runId)
    .eq('user_id', user.id)

  if (error) { console.error('Erro ao deletar corrida:', error); return false }
  return true
}

// ───────── FAVORITOS ─────────

const MODULE_SLUG_BY_ID = { 1: 'corrida', 2: 'treino', 3: 'aparencia' }
const MODULE_ID_BY_SLUG = { corrida: 1, treino: 2, aparencia: 3 }

export async function fetchFavorites() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('user_favorites')
    .select('entity_id')
    .eq('user_id', user.id)
    .eq('entity_type', 'module')

  if (error) { console.error('Erro ao buscar favoritos:', error); return [] }
  return (data || []).map(r => MODULE_ID_BY_SLUG[r.entity_id]).filter(Boolean)
}

export async function addFavorite(moduleId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const slug = MODULE_SLUG_BY_ID[moduleId]
  if (!slug) return false

  const { data, error } = await supabase
    .from('user_favorites')
    .insert({ user_id: user.id, entity_type: 'module', entity_id: slug })
    .select()
    .single()

  if (error) { console.error('Erro ao adicionar favorito:', error); return false }
  return true
}

export async function removeFavorite(moduleId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const slug = MODULE_SLUG_BY_ID[moduleId]
  if (!slug) return false

  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('entity_type', 'module')
    .eq('entity_id', slug)

  if (error) { console.error('Erro ao remover favorito:', error); return false }
  return true
}

// ───────── NOTIFICAÇÕES / CONQUISTAS ─────────

function getNotificationCutoff() {
  return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
}

export async function fetchNotifications(limit = 30) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', getNotificationCutoff())
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) { console.error('Erro ao buscar notificações:', error); return [] }
  return data || []
}

export async function fetchUnreadCount() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('read', false)
    .gte('created_at', getNotificationCutoff())

  if (error) { console.error('Erro ao buscar unread count:', error); return 0 }
  return count || 0
}

export async function markNotificationAsRead(notificationId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .eq('user_id', user.id)

  if (error) { console.error('Erro ao marcar notificação como lida:', error); return false }
  return true
}

export async function markAllNotificationsAsRead() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', user.id)
    .eq('read', false)

  if (error) { console.error('Erro ao marcar todas notificações como lidas:', error); return false }
  return true
}

export async function createNotification({ type, title, message, icon, metadata }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('notifications')
    .insert({ user_id: user.id, type, title, message, icon, metadata })
    .select()
    .single()

  if (error) { console.error('Erro ao criar notificação:', error); return null }
  return data
}

export async function fetchUserAchievements() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', user.id)
    .order('unlocked_at', { ascending: false })

  if (error) { console.error('Erro ao buscar conquistas:', error); return [] }
  return data || []
}

export async function unlockAchievement(achievementId, metadata = null) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { error: insertError } = await supabase
    .from('user_achievements')
    .insert({ user_id: user.id, achievement_id: achievementId, metadata })

  if (insertError) {
    if (insertError.code === '23505') return false
    console.error('Erro ao desbloquear conquista:', insertError)
    return false
  }

  try {
    const achievement = getAchievementById(achievementId)
    if (achievement) {
      await createNotification({
        type:     'achievement',
        title:    formatAchievementTitle(achievement, metadata),
        message:  achievement.description,
        icon:     achievement.icon,
        metadata: { achievementId, ...metadata },
      })
    }
  } catch (notifError) {
    console.error('Conquista desbloqueada mas notificação falhou:', notifError)
  }

  return true
}

// ───────── CONTAGENS LIFETIME ─────────

export async function fetchLifetimeCounts() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { tasksCompleted: 0, routines: 0, exercises: 0 }

  const [
    { count: tasksCompleted },
    { count: routines },
    { count: exercises },
  ] = await Promise.all([
    supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('completed', true),
    supabase.from('routine_completions').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('exercise_completions').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
  ])

  return { tasksCompleted: tasksCompleted || 0, routines: routines || 0, exercises: exercises || 0 }
}

// ───────── CRIAR ─────────

export async function createTask({ name, category, xp_value }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  if (!name || !name.trim()) { console.error('createTask: nome obrigatório'); return null }
  if (!category)             { console.error('createTask: categoria obrigatória'); return null }
  if (!xp_value || xp_value <= 0) { console.error('createTask: xp_value deve ser positivo'); return null }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id:   user.id,
      name:      name.trim(),
      category,
      xp_value,
      completed: false,
    })
    .select()
    .single()

  if (error) { console.error('Erro ao criar task:', error); return null }
  return data
}
