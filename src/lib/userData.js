import { supabase } from './supabase'
import { getTodayKey, getLocalDateKey } from './dailySuggestions'

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

export async function fetchAllUserData() {
  const [profile, stats, tasks] = await Promise.all([
    fetchProfile(),
    fetchUserStats(),
    fetchTasks(),
  ])
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
