import { ATTRIBUTE_META } from './userStats'

export const ACHIEVEMENTS = [
  // STREAK (3)
  { id: 'streak_3',          category: 'streak',     icon: '🔥', title: 'Comecei',             description: '3 dias consecutivos',                                   target: 3    },
  { id: 'streak_14',         category: 'streak',     icon: '🔥', title: 'Constância',           description: '14 dias consecutivos',                                  target: 14   },
  { id: 'streak_60',         category: 'streak',     icon: '🔥', title: 'Inevitável',           description: '60 dias consecutivos',                                  target: 60   },

  // TASKS LIFETIME (3)
  { id: 'tasks_10',          category: 'tasks',      icon: '📌', title: 'Primeiros Passos',     description: '10 tasks completadas',                                  target: 10   },
  { id: 'tasks_100',         category: 'tasks',      icon: '📌', title: 'Disciplinado',         description: '100 tasks completadas',                                 target: 100  },
  { id: 'tasks_500',         category: 'tasks',      icon: '📌', title: 'Mestre da Rotina',     description: '500 tasks completadas',                                 target: 500  },

  // ATRIBUTOS (3)
  { id: 'attribute_50',      category: 'atributos',  icon: '💎', title: 'Dominou',              description: 'Atributo chegou a 50',                                  target: 50,  repeatable: true },
  { id: 'attribute_100',     category: 'atributos',  icon: '💎', title: 'Maestria em',          description: 'Atributo chegou ao máximo',                             target: 100, repeatable: true },
  { id: 'all_attributes_50', category: 'atributos',  icon: '💎', title: 'Equilíbrio Perfeito',  description: 'Todos os 8 atributos em pelo menos 50',                 target: 50   },

  // ROTINAS / EXERCÍCIOS (3)
  { id: 'routines_10',       category: 'rotinas',    icon: '🧴', title: 'Cuidado Próprio',      description: '10 rotinas completadas',                                target: 10   },
  { id: 'exercises_50',      category: 'exercicios', icon: '💪', title: 'Disciplina Física',    description: '50 exercícios completados',                             target: 50   },
  { id: 'exercises_200',     category: 'exercicios', icon: '🏋️', title: 'Atleta',               description: '200 exercícios completados',                            target: 200  },

  // ESPECIAIS (3)
  { id: 'early_bird',        category: 'especial',   icon: '🌅', title: 'Madrugador',           description: 'Completou uma task antes das 7h da manhã',              target: null },
  { id: 'night_owl',         category: 'especial',   icon: '🌙', title: 'Noctívago',            description: 'Completou uma task depois das 22h',                     target: null },
  { id: 'multitask',         category: 'especial',   icon: '🎯', title: 'Multitarefa',          description: 'Completou tasks de todas as 6 categorias no mesmo dia', target: null },
]

export function getAchievementById(id) {
  return ACHIEVEMENTS.find(a => a.id === id)
}

export function getAchievementsByCategory(category) {
  return ACHIEVEMENTS.filter(a => a.category === category)
}

export function formatAchievementTitle(achievement, metadata) {
  if (achievement.repeatable && metadata?.attribute) {
    const attrLabel = ATTRIBUTE_META[metadata.attribute]?.label || metadata.attribute
    return `${achievement.title} ${attrLabel}`
  }
  return achievement.title
}
