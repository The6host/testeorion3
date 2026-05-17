// src/lib/rank.js — ÚNICA fonte de verdade do sistema de Rank

export const RANKS = [
  {
    code: 'E',
    title: 'Caçador Fraco',
    description: 'Iniciante — Apenas começando sua jornada',
    minXP: 0,
    maxXP: 1500,
    color: '#FF6B35',
    colorBg: '#FF6B3520',
  },
  {
    code: 'D',
    title: 'Caçador Comum',
    description: 'Clareza — Construindo consistência',
    minXP: 1500,
    maxXP: 5000,
    color: '#9B7EDE',
    colorBg: '#9B7EDE20',
  },
  {
    code: 'C',
    title: 'Caçador Treinado',
    description: 'Padrão — Domínio em formação',
    minXP: 5000,
    maxXP: 15000,
    color: '#4A9EFF',
    colorBg: '#4A9EFF20',
  },
  {
    code: 'B',
    title: 'Caçador de Elite',
    description: 'Prime — Acima da média absoluta',
    minXP: 15000,
    maxXP: 30000,
    color: '#3DD68C',
    colorBg: '#3DD68C20',
  },
  {
    code: 'A',
    title: 'Caçador de Alto Rank',
    description: 'Legado — Padrão raro de excelência',
    minXP: 30000,
    maxXP: 50000,
    color: '#FFB627',
    colorBg: '#FFB62720',
  },
  {
    code: 'S',
    title: 'Caçador Lendário',
    description: 'Inevitável — Topo absoluto',
    minXP: 50000,
    maxXP: Infinity,
    color: '#FFD700',
    colorBg: '#FFD70020',
  },
]

export function getRankByXP(totalXP) {
  return RANKS.find(r => totalXP >= r.minXP && totalXP < r.maxXP) ?? RANKS[0]
}

export function getRankProgress(totalXP) {
  const rank = getRankByXP(totalXP)
  if (rank.maxXP === Infinity) return 100
  const xpInRank  = totalXP - rank.minXP
  const rankRange = rank.maxXP - rank.minXP
  return Math.min(100, (xpInRank / rankRange) * 100)
}

export function getNextRank(totalXP) {
  const current      = getRankByXP(totalXP)
  const currentIndex = RANKS.findIndex(r => r.code === current.code)
  return RANKS[currentIndex + 1] ?? null
}
