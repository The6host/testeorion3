import { TrendingUp, Flame, Target, Zap } from 'lucide-react'

export const WORKOUT_PLAN_META = {
  'Ganhar Massa Muscular': {
    Icon:        TrendingUp,
    color:       '#10B981',
    colorBg:     '#10B98120',
    headerBg:    'linear-gradient(135deg, #052e16 0%, #0d1a14 100%)',
    headerBorder:'#10B98133',
    glowColor:   '#10B98118',
    iconBg:      '#052e16',
    longDescription: 'Hipertrofia com foco em volume e progressão de carga',
  },
  'Perder Gordura': {
    Icon:        Flame,
    color:       '#EF4444',
    colorBg:     '#EF444420',
    headerBg:    'linear-gradient(135deg, #1a0808 0%, #0d0505 100%)',
    headerBorder:'#EF444433',
    glowColor:   '#EF444418',
    iconBg:      '#1a0808',
    longDescription: 'Treino metabólico com alta intensidade e circuitos',
  },
  'Secar': {
    Icon:        Target,
    color:       '#3B82F6',
    colorBg:     '#3B82F620',
    headerBg:    'linear-gradient(135deg, #0a0f1e 0%, #050810 100%)',
    headerBorder:'#3B82F633',
    glowColor:   '#3B82F618',
    iconBg:      '#0a0f1e',
    longDescription: 'Combinação de força e cardio para definição muscular',
  },
  'Manter Shape': {
    Icon:        Zap,
    color:       '#F59E0B',
    colorBg:     '#F59E0B20',
    headerBg:    'linear-gradient(135deg, #1a1200 0%, #0d0a00 100%)',
    headerBorder:'#F59E0B33',
    glowColor:   '#F59E0B18',
    iconBg:      '#1a1200',
    longDescription: 'Treino equilibrado para manutenção do condicionamento',
  },
}

const FALLBACK_META = {
  Icon:        TrendingUp,
  color:       '#7C3AED',
  colorBg:     '#7C3AED20',
  headerBg:    'linear-gradient(135deg, #1a0a2e 0%, #0d0510 100%)',
  headerBorder:'#7C3AED33',
  glowColor:   '#7C3AED18',
  iconBg:      '#1a0a2e',
  longDescription: '',
}

export function getPlanMeta(planName) {
  return WORKOUT_PLAN_META[planName] || FALLBACK_META
}
