import { supabase } from './supabase'
import { ATTRIBUTE_KEYS } from './userStats'
import { unlockAchievement, createNotification } from './userData'
import { getRankByXP } from './rank'
import { getTodayKey } from './dailySuggestions'

export async function checkAchievements(context = {}) {
  const { triggeredBy, completedAtLocal } = context

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []
    const uid = user.id

    const [
      { count: tasksCount    },
      { count: routinesCount },
      { count: exercisesCount },
      { data: statsData      },
      { data: profileData    },
      { data: unlockedData   },
    ] = await Promise.all([
      supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('user_id', uid).eq('completed', true),
      supabase.from('routine_completions').select('id', { count: 'exact', head: true }).eq('user_id', uid),
      supabase.from('exercise_completions').select('id', { count: 'exact', head: true }).eq('user_id', uid),
      supabase.from('user_stats').select('*').eq('user_id', uid).single(),
      supabase.from('profiles').select('streak_count').eq('id', uid).single(),
      supabase.from('user_achievements').select('achievement_id, metadata').eq('user_id', uid),
    ])

    const tasksLifetime     = tasksCount     || 0
    const routinesLifetime  = routinesCount  || 0
    const exercisesLifetime = exercisesCount || 0
    const stats   = statsData   || {}
    const profile = profileData || {}
    const unlocked = unlockedData || []

    const isAlreadyUnlocked = new Set()
    for (const row of unlocked) {
      if (row.metadata?.attribute) {
        isAlreadyUnlocked.add(`${row.achievement_id}_${row.metadata.attribute}`)
      } else {
        isAlreadyUnlocked.add(row.achievement_id)
      }
    }

    const newlyUnlocked = []

    async function tryUnlock(id, metadata = null) {
      const key = metadata?.attribute ? `${id}_${metadata.attribute}` : id
      if (isAlreadyUnlocked.has(key)) return
      const ok = await unlockAchievement(id, metadata)
      if (ok) newlyUnlocked.push(key)
    }

    // STREAK
    if ((profile.streak_count || 0) >= 3)  await tryUnlock('streak_3')
    if ((profile.streak_count || 0) >= 14) await tryUnlock('streak_14')
    if ((profile.streak_count || 0) >= 60) await tryUnlock('streak_60')

    // TASKS LIFETIME
    if (tasksLifetime >= 10)  await tryUnlock('tasks_10')
    if (tasksLifetime >= 100) await tryUnlock('tasks_100')
    if (tasksLifetime >= 500) await tryUnlock('tasks_500')

    // ROTINAS
    if (routinesLifetime >= 10) await tryUnlock('routines_10')

    // EXERCÍCIOS
    if (exercisesLifetime >= 50)  await tryUnlock('exercises_50')
    if (exercisesLifetime >= 200) await tryUnlock('exercises_200')

    // ATRIBUTOS (repeatable — uma por atributo)
    for (const attr of ATTRIBUTE_KEYS) {
      if ((stats[attr] || 0) >= 50)  await tryUnlock('attribute_50',  { attribute: attr })
      if ((stats[attr] || 0) >= 100) await tryUnlock('attribute_100', { attribute: attr })
    }

    // TODOS OS ATRIBUTOS >= 50
    if (ATTRIBUTE_KEYS.every(attr => (stats[attr] || 0) >= 50)) {
      await tryUnlock('all_attributes_50')
    }

    // ESPECIAIS (só pra tasks)
    if (triggeredBy === 'task' && completedAtLocal instanceof Date) {
      const hour = completedAtLocal.getHours()

      if (hour < 7)   await tryUnlock('early_bird')
      if (hour >= 22) await tryUnlock('night_owl')

      // MULTITASK — query extra condicional
      try {
        const todayStart = new Date(`${getTodayKey()}T00:00:00`).toISOString()
        const { data: todayTasks } = await supabase
          .from('tasks')
          .select('category')
          .eq('user_id', uid)
          .eq('completed', true)
          .gte('completed_at', todayStart)

        if (todayTasks) {
          const uniqueCategories = new Set(todayTasks.map(r => r.category))
          if (uniqueCategories.size === 6) await tryUnlock('multitask')
        }
      } catch (err) {
        console.error('[checker] multitask query falhou:', err)
      }
    }

    return newlyUnlocked
  } catch (err) {
    console.error('[checkAchievements] erro:', err)
    return []
  }
}

export async function checkLevelAndRankUp(xpAntes, xpDepois) {
  try {
    const levelAntes  = Math.floor(xpAntes  / 500) + 1
    const levelDepois = Math.floor(xpDepois / 500) + 1

    if (levelDepois > levelAntes) {
      await createNotification({
        type:     'level_up',
        title:    `Level ${levelDepois} alcançado`,
        message:  `Você ganhou ${levelDepois - levelAntes} ${levelDepois - levelAntes === 1 ? 'nível' : 'níveis'}`,
        icon:     '🎯',
        metadata: { fromLevel: levelAntes, toLevel: levelDepois, totalXP: xpDepois },
      })
    }

    const rankAntes  = getRankByXP(xpAntes)
    const rankDepois = getRankByXP(xpDepois)

    if (rankDepois.code !== rankAntes.code) {
      await createNotification({
        type:     'rank_up',
        title:    `Você subiu pro Rank ${rankDepois.code}`,
        message:  rankDepois.title,
        icon:     '⚔️',
        metadata: { fromRank: rankAntes.code, toRank: rankDepois.code },
      })
    }
  } catch (err) {
    console.error('[checkLevelAndRankUp] erro:', err)
  }
}
