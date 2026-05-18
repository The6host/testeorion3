export const TASK_CATEGORIES = [
  'Fitness',
  'Foco',
  'Nutrição',
  'Mindfulness',
  'Social',
  'Produtividade',
]

export const CATEGORY_COLORS = {
  Fitness:       '#FF6B35',
  Foco:          '#22D3EE',
  Nutrição:      '#38BDF8',
  Mindfulness:   '#FF4D6D',
  Social:        '#EC4899',
  Produtividade: '#3DD68C',
}

// Atributos que sobem/descem (+1/-1) quando uma task da categoria é completada/desmarcada
export const CATEGORY_ATTRIBUTES = {
  Fitness:       ['forca', 'agilidade'],
  Foco:          ['inteligencia', 'foco'],
  'Nutrição':    ['hidratacao', 'vitalidade'],
  Mindfulness:   ['vitalidade', 'carisma'],
  Social:        ['carisma'],
  Produtividade: ['disciplina'],
}

export const MAX_ATTRIBUTE_VALUE = 100
export const MIN_ATTRIBUTE_VALUE = 0
