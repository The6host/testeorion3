import { getRankByXP } from '../lib/rank'

const SIZES = {
  sm: { fontSize: 11, padding: '2px 9px',  gap: 4 },
  md: { fontSize: 12, padding: '4px 12px', gap: 5 },
  lg: { fontSize: 14, padding: '6px 16px', gap: 6 },
}

export function RankBadge({ totalXP = 0, size = 'md' }) {
  const rank = getRankByXP(totalXP)
  const s    = SIZES[size] ?? SIZES.md
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: s.gap,
      borderRadius: 99, fontWeight: 700,
      padding: s.padding, fontSize: s.fontSize,
      background: rank.colorBg, color: rank.color,
      border: `1px solid ${rank.color}40`,
    }}>
      <span>{rank.code}</span>
      <span style={{ opacity: 0.55 }}>·</span>
      <span>{rank.title}</span>
    </span>
  )
}

export default RankBadge
