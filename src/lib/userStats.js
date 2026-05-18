import { MAX_ATTRIBUTE_VALUE as MAX_FROM_CATEGORIES } from './categories'

export const ATTRIBUTE_KEYS = [
  'forca', 'vitalidade', 'inteligencia', 'disciplina',
  'agilidade', 'foco', 'carisma', 'hidratacao',
]

export const ATTRIBUTE_META = {
  forca:        { label: 'Força',        color: '#FF6B35' },
  vitalidade:   { label: 'Vitalidade',   color: '#FF4D6D' },
  inteligencia: { label: 'Inteligência', color: '#4A9EFF' },
  disciplina:   { label: 'Disciplina',   color: '#3DD68C' },
  agilidade:    { label: 'Agilidade',    color: '#9B7EDE' },
  foco:         { label: 'Foco',         color: '#22D3EE' },
  carisma:      { label: 'Carisma',      color: '#EC4899' },
  hidratacao:   { label: 'Hidratação',   color: '#38BDF8' },
}

export const MAX_ATTRIBUTE_VALUE = MAX_FROM_CATEGORIES

export function getEmptyAttributes() {
  return ATTRIBUTE_KEYS.reduce((acc, k) => ({ ...acc, [k]: 0 }), {})
}

export function getAttributesSum(stats) {
  if (!stats) return 0
  return ATTRIBUTE_KEYS.reduce((sum, k) => sum + (stats[k] || 0), 0)
}

export function getAttributesAverage(stats) {
  if (!stats) return '0.0'
  const values = ATTRIBUTE_KEYS.map(k => stats[k] || 0)
  return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
}
