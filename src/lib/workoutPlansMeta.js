import { TrendingUp, Flame, Target, Zap, Sprout, Compass, Mountain, Sparkles } from 'lucide-react'

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
  'Calistenia Iniciante': {
    Icon:        Sprout,
    color:       '#84CC16',
    colorBg:     '#84CC1620',
    headerBg:    'linear-gradient(135deg, #0a1400 0%, #050900 100%)',
    headerBorder:'#84CC1633',
    glowColor:   '#84CC1618',
    iconBg:      '#0a1400',
    longDescription: 'Construa base de força com peso corporal e padrões fundamentais',
  },
  'Calistenia Intermediária': {
    Icon:        Compass,
    color:       '#06B6D4',
    colorBg:     '#06B6D420',
    headerBg:    'linear-gradient(135deg, #001a20 0%, #000d14 100%)',
    headerBorder:'#06B6D433',
    glowColor:   '#06B6D418',
    iconBg:      '#001a20',
    longDescription: 'Movimentos completos com variações unilaterais e progressões',
  },
  'Calistenia Avançada': {
    Icon:        Mountain,
    color:       '#EA580C',
    colorBg:     '#EA580C20',
    headerBg:    'linear-gradient(135deg, #1a0800 0%, #0d0400 100%)',
    headerBorder:'#EA580C33',
    glowColor:   '#EA580C18',
    iconBg:      '#1a0800',
    longDescription: 'Alto volume e intensidade com introdução a movimentos de elite',
  },
  'Skill Work': {
    Icon:        Sparkles,
    color:       '#EC4899',
    colorBg:     '#EC489920',
    headerBg:    'linear-gradient(135deg, #1a0814 0%, #0d050e 100%)',
    headerBorder:'#EC489933',
    glowColor:   '#EC489918',
    iconBg:      '#1a0814',
    longDescription: 'Domine as 4 skills lendárias: Handstand, Planche, Front Lever e Muscle-up',
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
