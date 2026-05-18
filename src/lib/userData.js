import { supabase } from './supabase'
import { getTodayKey, getLocalDateKey } from './dailySuggestions'
import { CATEGORY_ATTRIBUTES, MAX_ATTRIBUTE_VALUE, MIN_ATTRIBUTE_VALUE } from './categories'

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
  const [profileRaw, stats, tasks] = await Promise.all([
    fetchProfile(),
    fetchUserStats(),
    fetchTasks(),
  ])
  const profile = await checkAndDecayStreak(profileRaw)
  return { profile, stats, tasks }
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
  if (!user) return

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('total_xp')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) return

  const newTotalXP = Math.max(0, profile.total_xp + amount)
  const newLevel   = Math.floor(newTotalXP / 500) + 1

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ total_xp: newTotalXP, level: newLevel, updated_at: new Date().toISOString() })
    .eq('id', user.id)

  if (updateError) console.error('Erro ao atualizar XP:', updateError)
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

  const { count, error: countError } = await supabase
    .from('tasks')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('completed', true)
    .gte('completed_at', startOfDay)
    .lte('completed_at', endOfDay)

  if (countError) {
    console.error('Erro ao contar tasks de hoje:', countError)
    return
  }

  if (count > 1) {
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

  await addXP(task.xp_value)
  await adjustAttributesByCategory(task.category, +1)
  await updateStreakAfterCompletion()
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
