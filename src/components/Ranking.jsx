import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Users, Info, TrendingUp, TrendingDown } from 'lucide-react'
import BottomNav from './BottomNav'

/* ── Design tokens ── */
const PUR   = '#A855F7'
const NEON  = '#ccff00'
const GREEN = '#10B981'
const GOLD  = '#F59E0B'
const SIL   = '#94A3B8'
const BRZ   = '#CD7F32'

const CARD = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 16,
  padding: 16,
}

/* ── Players mock ── */
const PLAYERS = [
  { name: 'TanjiroKamado',   pts: 85987, up: false, tier: 'Lenda II',       emoji: '🏆' },
  { name: 'OrochimaSannin',  pts: 79958, up: true,  tier: 'Lenda II',       emoji: '🏆' },
  { name: 'JetBlack',        pts: 68277, up: true,  tier: 'Lenda I',        emoji: '🏆' },
  { name: 'NarutoUzumaki',   pts: 64053, up: false, tier: 'Lenda I',        emoji: '🏆' },
  { name: 'FayeValentine',   pts: 49115, up: true,  tier: 'Grão-Mestre II', emoji: '🔥' },
  { name: 'SpikeSpiegel',    pts: 41230, up: true,  tier: 'Grão-Mestre I',  emoji: '🔥' },
  { name: 'EdwardElric',     pts: 38540, up: false, tier: 'Mestre III',     emoji: '⚔️' },
  { name: 'MikasaAckerman',  pts: 32100, up: true,  tier: 'Mestre II',      emoji: '⚔️' },
  { name: 'LeviAckerman',    pts: 28750, up: false, tier: 'Mestre I',       emoji: '⚔️' },
  { name: 'GokuSuperSaiyan', pts: 21300, up: true,  tier: 'Veterano II',    emoji: '🛡️' },
]

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#A855F7,#7C3AED)',
  'linear-gradient(135deg,#3B82F6,#2563EB)',
  'linear-gradient(135deg,#10B981,#059669)',
  'linear-gradient(135deg,#F59E0B,#D97706)',
  'linear-gradient(135deg,#EF4444,#DC2626)',
  'linear-gradient(135deg,#8B5CF6,#6D28D9)',
  'linear-gradient(135deg,#06B6D4,#0284C7)',
  'linear-gradient(135deg,#EC4899,#DB2777)',
  'linear-gradient(135deg,#84CC16,#65A30D)',
  'linear-gradient(135deg,#F97316,#EA580C)',
]

/* ── Helpers ── */
function getInitials(name) {
  const words = name.match(/[A-Z][a-z]*/g) || [name]
  return words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

function getFirstName(name) {
  return (name.match(/[A-Z][a-z]*/g) || [name])[0]
}

function fmtPts(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function getTierColor(tier) {
  if (tier.includes('Lenda'))       return GOLD
  if (tier.includes('Grão-Mestre')) return PUR
  if (tier.includes('Mestre'))      return '#3B82F6'
  if (tier.includes('Veterano'))    return GREEN
  return 'rgba(255,255,255,0.4)'
}

const TIME_TABS = ['Hoje', 'Semana', 'Mês', 'Total']

/* ══════════════════════════════════════
   PODIUM
══════════════════════════════════════ */
function PodiumColumn({ player, rank, avatarIndex, platHeight }) {
  const medalColor = rank === 1 ? GOLD : rank === 2 ? SIL : BRZ
  const avatarSize = rank === 1 ? 64 : 52

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      {/* Crown (1st only) */}
      {rank === 1 ? (
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: 26, lineHeight: 1, marginBottom: 4 }}
        >
          👑
        </motion.div>
      ) : (
        <div style={{ height: 34 }} />
      )}

      {/* Avatar */}
      <div style={{
        width: avatarSize, height: avatarSize, borderRadius: '50%',
        background: AVATAR_GRADIENTS[avatarIndex],
        border: `3px solid ${medalColor}`,
        boxShadow: `0 0 18px ${medalColor}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: rank === 1 ? 20 : 16, fontWeight: 900, color: '#fff',
        marginBottom: 8,
      }}>
        {getInitials(player.name)}
      </div>

      {/* Name */}
      <div style={{
        fontSize: rank === 1 ? 12 : 11, fontWeight: 800, color: '#fff',
        textAlign: 'center', lineHeight: 1.25, marginBottom: 2,
        maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {getFirstName(player.name)}
      </div>

      {/* @username */}
      <div style={{
        fontSize: 10, color: 'rgba(255,255,255,0.38)', marginBottom: 4,
        maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        @{player.name.toLowerCase()}
      </div>

      {/* Score */}
      <div style={{ fontSize: 12, fontWeight: 900, color: GREEN, marginBottom: 0 }}>
        {fmtPts(player.pts)} pts
      </div>

      {/* Platform block */}
      <div style={{
        width: '100%', height: platHeight, marginTop: 10,
        background: `linear-gradient(180deg, ${medalColor}28 0%, ${medalColor}10 100%)`,
        border: `1px solid ${medalColor}44`,
        borderBottom: 'none',
        borderRadius: '8px 8px 0 0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: rank === 1 ? 24 : 20,
      }}>
        {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
      </div>
    </div>
  )
}

function Podium() {
  /* left=2nd, center=1st, right=3rd */
  const order       = [PLAYERS[1], PLAYERS[0], PLAYERS[2]]
  const ranks       = [2, 1, 3]
  const avatarIdx   = [1, 0, 2]
  const platHeights = [56, 84, 40]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      style={{
        display: 'flex', alignItems: 'flex-end', gap: 0,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 20, overflow: 'hidden',
        padding: '20px 12px 0',
        marginBottom: 12,
      }}
    >
      {order.map((player, i) => (
        <PodiumColumn
          key={i}
          player={player}
          rank={ranks[i]}
          avatarIndex={avatarIdx[i]}
          platHeight={platHeights[i]}
        />
      ))}
    </motion.div>
  )
}

/* ══════════════════════════════════════
   POSITION BADGE
══════════════════════════════════════ */
function PosBadge({ pos }) {
  const styles = {
    1: { bg: `${GOLD}22`, border: `${GOLD}44`, color: GOLD   },
    2: { bg: `${SIL}18`,  border: `${SIL}35`,  color: SIL    },
    3: { bg: `${BRZ}18`,  border: `${BRZ}35`,  color: BRZ    },
  }
  const s = styles[pos] || {
    bg: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.09)',
    color: 'rgba(255,255,255,0.45)',
  }

  return (
    <div style={{
      width: 28, height: 28, flexShrink: 0,
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, fontWeight: 900, color: s.color,
    }}>
      {pos}
    </div>
  )
}

/* ══════════════════════════════════════
   PLAYER ROW
══════════════════════════════════════ */
function PlayerRow({ player, pos, avatarIndex, delay }) {
  const tierColor = getTierColor(player.tier)

  return (
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1], delay }}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px', marginBottom: 6,
        background: pos <= 3 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${pos <= 3 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 13,
      }}
    >
      {/* Position */}
      <PosBadge pos={pos} />

      {/* Avatar */}
      <div style={{
        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
        background: AVATAR_GRADIENTS[avatarIndex],
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 900, color: '#fff',
      }}>
        {getInitials(player.name)}
      </div>

      {/* Name + tier */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {getFirstName(player.name)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            background: `${tierColor}14`, border: `1px solid ${tierColor}30`,
            borderRadius: 6, padding: '1px 7px',
            fontSize: 10, fontWeight: 700, color: tierColor,
          }}>
            {player.emoji} {player.tier}
          </div>
        </div>
      </div>

      {/* Points + trend */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
          {player.up
            ? <TrendingUp size={12} color={GREEN} />
            : <TrendingDown size={12} color="#EF4444" />
          }
          <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>
            {fmtPts(player.pts)}
          </span>
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>pts</div>
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════
   ROOT
══════════════════════════════════════ */
export default function Ranking() {
  const [mainTab, setMainTab] = useState('Global')
  const [timeTab, setTimeTab] = useState('Total')

  return (
    <div style={{ minHeight: '100dvh', background: '#010208', color: '#fff' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px 88px' }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}
        >
          <span style={{ fontSize: 26 }}>🏆</span>
          <h1 style={{ flex: 1, fontSize: 26, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1 }}>
            Ranking
          </h1>
          <button style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 10, width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <Info size={16} color="rgba(255,255,255,0.5)" />
          </button>
        </motion.div>

        {/* ── Main tabs: Global / Amigos ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          style={{
            display: 'flex', gap: 6,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14, padding: 4,
            marginBottom: 12,
          }}
        >
          {[
            { key: 'Global', icon: <Trophy size={14} /> },
            { key: 'Amigos', icon: <Users size={14} /> },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setMainTab(tab.key)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 6, padding: '9px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 700, transition: 'all 0.2s',
                background: mainTab === tab.key ? PUR : 'transparent',
                color: mainTab === tab.key ? '#fff' : 'rgba(255,255,255,0.38)',
                boxShadow: mainTab === tab.key ? '0 0 16px rgba(168,85,247,0.3)' : 'none',
              }}
            >
              {tab.icon} {tab.key}
            </button>
          ))}
        </motion.div>

        {/* ── Time subtabs ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ display: 'flex', gap: 4, marginBottom: 18 }}
        >
          {TIME_TABS.map(t => (
            <button
              key={t}
              onClick={() => setTimeTab(t)}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 700, transition: 'all 0.2s',
                background: timeTab === t ? 'rgba(168,85,247,0.14)' : 'rgba(255,255,255,0.04)',
                color: timeTab === t ? PUR : 'rgba(255,255,255,0.38)',
                borderBottom: timeTab === t ? `2px solid ${PUR}` : '2px solid transparent',
              }}
            >
              {t}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {mainTab === 'Global' ? (
            <motion.div
              key="global"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* ── Tier card ── */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 }}
                style={{
                  ...CARD,
                  background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(109,40,217,0.05) 100%)',
                  border: '1px solid rgba(168,85,247,0.2)',
                  marginBottom: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 24 }}>🌱</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>Iniciante II</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                        Progresso para próximo tier
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: PUR }}>75%</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ height: 7, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                    style={{
                      height: '100%', borderRadius: 99,
                      background: `linear-gradient(90deg, ${PUR}, #C084FC)`,
                      boxShadow: '0 0 10px rgba(168,85,247,0.55)',
                    }}
                  />
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', textAlign: 'right' }}>
                  375,5 / 499,5 pts
                </div>
              </motion.div>

              {/* ── Podium ── */}
              <Podium />

              {/* ── Minha posição ── */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.22 }}
                style={{
                  ...CARD,
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'rgba(16,185,129,0.06)',
                  border: '1px solid rgba(16,185,129,0.18)',
                  marginBottom: 18,
                }}
              >
                <div style={{
                  background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: 10, padding: '6px 12px',
                  fontSize: 14, fontWeight: 900, color: GREEN, flexShrink: 0,
                }}>
                  #?
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Sua Posição</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                    Sincronize para aparecer
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: GREEN }}>875</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>pontos</div>
                </div>
              </motion.div>

              {/* ── Top 50 label ── */}
              <div style={{
                fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.32)',
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10,
              }}>
                Top 50 — Global
              </div>

              {/* ── Player list ── */}
              {PLAYERS.map((player, i) => (
                <PlayerRow
                  key={i}
                  player={player}
                  pos={i + 1}
                  avatarIndex={i}
                  delay={0.25 + i * 0.05}
                />
              ))}
            </motion.div>
          ) : (
            /* ── Amigos empty state ── */
            <motion.div
              key="amigos"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{ textAlign: 'center', padding: '56px 20px' }}
            >
              <div style={{ fontSize: 52, marginBottom: 16 }}>👥</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
                Nenhum amigo ainda
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 1.65, marginBottom: 28 }}>
                Adicione amigos para ver o ranking<br />e competir em grupo.
              </div>
              <button style={{
                padding: '12px 32px',
                background: PUR, border: 'none', borderRadius: 12,
                color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer',
                boxShadow: '0 0 22px rgba(168,85,247,0.35)',
              }}>
                Convidar Amigos
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      <BottomNav />
    </div>
  )
}
