import { supabase } from './supabase'

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
