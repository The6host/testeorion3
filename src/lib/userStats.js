export const ATTRIBUTE_KEYS = [
  'forca', 'vitalidade', 'inteligencia', 'disciplina',
  'agilidade', 'foco', 'carisma', 'hidratacao',
]

export const ATTRIBUTE_META = {
  forca:        { label: 'Força',        color: '#F97316' },
  vitalidade:   { label: 'Vitalidade',   color: '#EF4444' },
  inteligencia: { label: 'Inteligência', color: '#8B5CF6' },
  disciplina:   { label: 'Disciplina',   color: '#10B981' },
  agilidade:    { label: 'Agilidade',    color: '#7C3AED' },
  foco:         { label: 'Foco',         color: '#06B6D4' },
  carisma:      { label: 'Carisma',      color: '#EC4899' },
  hidratacao:   { label: 'Hidratação',   color: '#3B82F6' },
}

export const MAX_ATTRIBUTE_VALUE = 100

export function getUserAttributes() {
  return {
    forca:        38,
    vitalidade:   42,
    inteligencia: 31,
    disciplina:   45,
    agilidade:    28,
    foco:         35,
    carisma:      25,
    hidratacao:   33,
  }
}

export function getAttributesSum() {
  return Object.values(getUserAttributes()).reduce((sum, v) => sum + v, 0)
}

export function getAttributesAverage() {
  return (getAttributesSum() / ATTRIBUTE_KEYS.length).toFixed(1)
}
