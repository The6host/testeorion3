import { useState } from 'react'
import { useUserDataContext } from '../context/UserDataContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Users, Info, TrendingUp, TrendingDown, Crown, Star, Sprout } from 'lucide-react'
import BottomNav from './BottomNav'
import { getRankByXP, getNextRank, getRankProgress } from '../lib/rank'

/* ── Design tokens ── */
const PUR   = '#7C3AED'
const MUTED = '#888888'
const DIM   = '#444444'
const GREEN = '#10B981'
const GOLD  = '#F59E0B'
const SIL   = '#94A3B8'
const BRZ   = '#CD7F32'

const CARD = {
  background: '#111111',
  border: '1px solid #222222',
  borderRadius: 12,
  padding: 16,
}

const PLAYERS = [
  { name: 'TanjiroKamado',   pts: 85987, up: false },
  { name: 'OrochimaSannin',  pts: 79958, up: true  },
  { name: 'JetBlack',        pts: 68277, up: true  },
  { name: 'NarutoUzumaki',   pts: 64053, up: false },
  { name: 'FayeValentine',   pts: 49115, up: true  },
  { name: 'SpikeSpiegel',    pts: 41230, up: true  },
  { name: 'EdwardElric',     pts: 38540, up: false },
  { name: 'MikasaAckerman',  pts: 32100, up: true  },
  { name: 'LeviAckerman',    pts: 28750, up: false },
  { name: 'GokuSuperSaiyan', pts: 21300, up: true  },
]

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#7C3AED,#6D28D9)',
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


const TIME_TABS = ['Hoje', 'Semana', 'Mês', 'Total']

function PodiumColumn({ player, rank, avatarIndex, platHeight }) {
  const medalColor = rank === 1 ? GOLD : rank === 2 ? SIL : BRZ
  const avatarSize = rank === 1 ? 62 : 50

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {rank === 1 ? (
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 32, height: 32, borderRadius: 8, marginBottom: 4,
            background: `${GOLD}22`, border: `1px solid ${GOLD}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Crown size={16} color={GOLD} />
        </motion.div>
      ) : (
        <div style={{ height: 36 }} />
      )}

      <div style={{
        width: avatarSize, height: avatarSize, borderRadius: '50%',
        background: AVATAR_GRADIENTS[avatarIndex],
        border: `3px solid ${medalColor}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: rank === 1 ? 18 : 14, fontWeight: 900, color: '#fff',
        marginBottom: 8,
      }}>
        {getInitials(player.name)}
      </div>

      <div style={{
        fontSize: rank === 1 ? 12 : 11, fontWeight: 800, color: '#fff',
        textAlign: 'center', lineHeight: 1.25, marginBottom: 2,
        maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {getFirstName(player.name)}
      </div>

      <div style={{
        fontSize: 10, color: MUTED, marginBottom: 4,
        maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        @{player.name.toLowerCase()}
      </div>

      <div style={{ fontSize: 12, fontWeight: 900, color: GREEN, marginBottom: 0 }}>
        {fmtPts(player.pts)} pts
      </div>

      <div style={{
        width: '100%', height: platHeight, marginTop: 10,
        background: `${medalColor}18`,
        border: `1px solid ${medalColor}33`,
        borderBottom: 'none',
        borderRadius: '8px 8px 0 0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: rank === 1 ? 16 : 14, fontWeight: 900, color: medalColor,
      }}>
        {rank}
      </div>
    </div>
  )
}

function Podium() {
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
        background: '#111111', border: '1px solid #222222',
        borderRadius: 12, overflow: 'hidden',
        padding: '20px 12px 0',
        marginBottom: 10,
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

function PosBadge({ pos }) {
  const styles = {
    1: { bg: `${GOLD}22`, border: `${GOLD}44`, color: GOLD },
    2: { bg: `${SIL}18`,  border: `${SIL}35`,  color: SIL  },
    3: { bg: `${BRZ}18`,  border: `${BRZ}35`,  color: BRZ  },
  }
  const s = styles[pos] || {
    bg: '#1a1a1a', border: '#222222', color: MUTED,
  }

  return (
    <div style={{
      width: 28, height: 28, flexShrink: 0,
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 7,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, fontWeight: 900, color: s.color,
    }}>
      {pos}
    </div>
  )
}

function PlayerRow({ player, pos, avatarIndex, delay }) {
  const rank = getRankByXP(player.pts)

  return (
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1], delay }}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px', marginBottom: 6,
        background: '#0f0f0f',
        border: `1px solid ${pos <= 3 ? '#2a2a2a' : '#1e1e1e'}`,
        borderRadius: 10,
      }}
    >
      <PosBadge pos={pos} />

      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        background: AVATAR_GRADIENTS[avatarIndex],
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 900, color: '#fff',
      }}>
        {getInitials(player.name)}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {getFirstName(player.name)}
        </div>
        <div style={{ marginTop: 3 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            background: `${rank.color}14`, border: `1px solid ${rank.color}30`,
            borderRadius: 6, padding: '1px 7px',
            fontSize: 10, fontWeight: 700, color: rank.color,
          }}>
            {rank.code} · {rank.title}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
          {player.up
            ? <TrendingUp   size={12} color={GREEN} />
            : <TrendingDown size={12} color="#EF4444" />
          }
          <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>
            {fmtPts(player.pts)}
          </span>
        </div>
        <div style={{ fontSize: 10, color: MUTED, marginTop: 1 }}>pts</div>
      </div>
    </motion.div>
  )
}

export default function Ranking() {
  const [mainTab, setMainTab] = useState('Global')
  const [timeTab, setTimeTab] = useState('Total')
  const { profile } = useUserDataContext()

  const USER_XP  = profile?.total_xp ?? 0
  const userRank = getRankByXP(USER_XP)
  const nextRank = getNextRank(USER_XP)
  const rankPct  = Math.round(getRankProgress(USER_XP))

  return (
    <div style={{ minHeight: '100dvh', background: '#080808', color: '#fff' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px 88px' }}>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: '#1a1a2e',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Trophy size={18} color={PUR} />
          </div>
          <h1 style={{ flex: 1, fontSize: 24, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1 }}>
            Ranking
          </h1>
          <button style={{
            background: '#1a1a1a', border: '1px solid #222222',
            borderRadius: 9, width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <Info size={16} color={MUTED} />
          </button>
        </motion.div>

        {/* Main tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          style={{
            display: 'flex', gap: 6,
            background: '#111111', border: '1px solid #222222',
            borderRadius: 12, padding: 4, marginBottom: 10,
          }}
        >
          {[
            { key: 'Global', icon: <Trophy size={14} /> },
            { key: 'Amigos', icon: <Users   size={14} /> },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setMainTab(tab.key)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 6, padding: '9px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 700, transition: 'all 0.2s',
                background: mainTab === tab.key ? PUR : 'transparent',
                color: mainTab === tab.key ? '#fff' : MUTED,
              }}
            >
              {tab.icon} {tab.key}
            </button>
          ))}
        </motion.div>

        {/* Time subtabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ display: 'flex', gap: 4, marginBottom: 16 }}
        >
          {TIME_TABS.map(t => (
            <button
              key={t}
              onClick={() => setTimeTab(t)}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 700, transition: 'all 0.2s',
                background: timeTab === t ? '#1a1a2e' : '#111111',
                color: timeTab === t ? PUR : MUTED,
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
              {/* Tier card */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 }}
                style={{
                  ...CARD,
                  background: '#131025',
                  border: `1px solid ${PUR}33`,
                  marginBottom: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 9, background: '#1a1a2e',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Sprout size={17} color={GREEN} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>
                        {userRank.code} · {userRank.title}
                      </div>
                      <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>
                        Progresso para Rank {nextRank?.code ?? 'MAX'}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{rankPct}%</div>
                  </div>
                </div>

                <div style={{ height: 4, background: '#222222', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${rankPct}%` }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                    style={{ height: '100%', borderRadius: 99, background: PUR }}
                  />
                </div>
                <div style={{ fontSize: 12, color: MUTED, textAlign: 'right' }}>
                  {USER_XP.toLocaleString('pt-BR')} / {nextRank ? nextRank.minXP.toLocaleString('pt-BR') : '∞'} XP
                </div>
              </motion.div>

              <Podium />

              {/* Minha posição */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.22 }}
                style={{
                  ...CARD,
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: '#0d1a14', border: '1px solid #1a3325',
                  marginBottom: 16,
                }}
              >
                <div style={{
                  background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: 9, padding: '6px 12px',
                  fontSize: 14, fontWeight: 900, color: GREEN, flexShrink: 0,
                }}>
                  —
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Sua Posição</div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>
                    Sincronize para aparecer
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: GREEN }}>0</div>
                  <div style={{ fontSize: 10, color: MUTED }}>pontos</div>
                </div>
              </motion.div>

              <div style={{
                fontSize: 10, fontWeight: 700, color: MUTED,
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10,
              }}>
                Top 50 — Global
              </div>

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
            <motion.div
              key="amigos"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{ textAlign: 'center', padding: '56px 20px' }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 14, background: '#1a1a2e',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <Users size={24} color={PUR} />
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
                Nenhum amigo ainda
              </div>
              <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.65, marginBottom: 28 }}>
                Adicione amigos para ver o ranking<br />e competir em grupo.
              </div>
              <button style={{
                padding: '12px 32px',
                background: PUR, border: 'none', borderRadius: 10,
                color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer',
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
