import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NEON = '#ccff00'
const BG   = '#010208'
const CARD = '#0d0f18'
const BDR  = '#1c1f2e'
const TOTAL = 6

/* ── Icons ─────────────────────────────────────────────────────────── */
const I = {
  target:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  flame:    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2s-4 4-4 8a4.07 4.07 0 0 0 2.5 3.76c-.23-1-.14-2.2.85-3.26 0 0 1.15 1.76 1.15 3.5 0 0 1.5-.74 1.5-2.5 0 0 2 1.5 2 3.5 0 3-2 5-4 5s-4-2.5-4-5C4 7 12 2 12 2z"/></svg>,
  clock:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  brain:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24A2.5 2.5 0 0 1 9.5 2z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24A2.5 2.5 0 0 0 14.5 2z"/></svg>,
  sparkle:  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l2.09 6.26H20.5l-5.27 3.83 2.01 6.26L12 14.52l-5.24 3.83 2.01-6.26L3.5 8.26H9.91z"/></svg>,
  dumbbell: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="1" y="9" width="4" height="6" rx="1"/><rect x="19" y="9" width="4" height="6" rx="1"/><path d="M5 12h14"/><rect x="7" y="7" width="2" height="10" rx="1"/><rect x="15" y="7" width="2" height="10" rx="1"/></svg>,
  wallet:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor"/><path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/></svg>,
  book:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  utensils: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 2v7c0 1.7 1.3 3 3 3s3-1.3 3-3V2M6 15v7M15 2v20M15 7h4a2 2 0 0 1 0 4h-4"/></svg>,
  moon:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  trophy:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M18 2H6v7a6 6 0 0 0 12 0V2zM4 22h16M12 17v5"/></svg>,
  users:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  heart:    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>,
}

/* ── Option card (single + multi) ──────────────────────────────────── */
function OptionCard({ icon, label, sub, selected, onClick, multi = false }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 16px',
        background: selected ? 'rgba(204,255,0,0.06)' : CARD,
        border: `1px solid ${selected ? 'rgba(204,255,0,0.4)' : BDR}`,
        borderRadius: 14, cursor: 'pointer', textAlign: 'left',
        transition: 'border-color 0.15s, background 0.15s',
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
        background: selected ? 'rgba(204,255,0,0.1)' : '#141620',
        border: `1px solid ${selected ? 'rgba(204,255,0,0.28)' : '#252838'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: selected ? NEON : 'rgba(255,255,255,0.4)',
      }}>
        {I[icon] || I.sparkle}
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: selected ? '#fff' : 'rgba(255,255,255,0.82)', lineHeight: 1.2 }}>{label}</p>
        {sub && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', marginTop: 3 }}>{sub}</p>}
      </div>

      {multi && (
        <div style={{
          width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
          border: `1.5px solid ${selected ? NEON : 'rgba(255,255,255,0.22)'}`,
          background: selected ? NEON : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {selected && <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </div>
      )}
    </motion.button>
  )
}

/* ── Steps ─────────────────────────────────────────────────────────── */
function Step1({ value, onChange }) {
  const opts = [
    { value: 'disciplina', label: 'Falta de disciplina',  sub: 'Sei o que fazer, mas não consigo manter',        icon: 'target'   },
    { value: 'motivacao',  label: 'Falta de motivação',   sub: 'Tenho dificuldade em manter o ritmo',             icon: 'flame'    },
    { value: 'tempo',      label: 'Falta de tempo',       sub: 'Quero melhorar mas a rotina é corrida',           icon: 'clock'    },
    { value: 'foco',       label: 'Falta de foco',        sub: 'Me distraio fácil e perco produtividade',         icon: 'brain'    },
    { value: 'otimizar',   label: 'Quero otimizar',       sub: 'Já sou bom, mas quero ir pro próximo nível',      icon: 'sparkle'  },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {opts.map(o => <OptionCard key={o.value} {...o} selected={value === o.value} onClick={() => onChange(o.value)} />)}
    </div>
  )
}

function Step2({ value = [], onChange }) {
  const opts = [
    { value: 'corpo',       label: 'Corpo e saúde',          icon: 'dumbbell'  },
    { value: 'mente',       label: 'Mente e emocional',      icon: 'brain'     },
    { value: 'dinheiro',    label: 'Dinheiro e finanças',    icon: 'wallet'    },
    { value: 'estudos',     label: 'Estudos e carreira',     icon: 'book'      },
    { value: 'alimentacao', label: 'Alimentação',             icon: 'utensils'  },
    { value: 'sono',        label: 'Qualidade do sono',      icon: 'moon'      },
  ]
  function toggle(v) {
    onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v])
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {opts.map(o => <OptionCard key={o.value} {...o} selected={value.includes(o.value)} onClick={() => toggle(o.value)} multi />)}
    </div>
  )
}

function Step3({ value, onChange }) {
  const opts = [
    { v: 1, label: 'Quase zero' }, { v: 2, label: 'Pouca' }, { v: 3, label: 'Razoável' },
    { v: 4, label: 'Boa' },        { v: 5, label: 'Excelente' },
  ]
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {opts.map(o => (
        <motion.button
          key={o.v} onClick={() => onChange(o.v)} whileTap={{ scale: 0.95 }}
          style={{
            flex: 1, padding: '22px 6px',
            background: value === o.v ? 'rgba(204,255,0,0.08)' : CARD,
            border: `1px solid ${value === o.v ? 'rgba(204,255,0,0.45)' : BDR}`,
            borderRadius: 14, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            boxShadow: value === o.v ? '0 0 20px rgba(204,255,0,0.1)' : 'none',
            transition: 'all 0.15s',
          }}
        >
          <span style={{ fontSize: 30, fontWeight: 900, fontFamily: 'monospace', color: value === o.v ? NEON : 'rgba(255,255,255,0.65)', lineHeight: 1 }}>{o.v}</span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', textAlign: 'center', lineHeight: 1.3 }}>{o.label}</span>
        </motion.button>
      ))}
    </div>
  )
}

function Step4({ value, onChange }) {
  const opts = [
    { value: 'competicao', label: 'Competição',          sub: 'Me motivo superando outros',                   icon: 'trophy'   },
    { value: 'equipe',     label: 'Equipe',               sub: 'Rendo mais com gente junto',                   icon: 'users'    },
    { value: 'momento',    label: 'Depende do momento',   sub: 'Compito e colaboro dependendo da situação',    icon: 'sparkle'  },
    { value: 'eu',         label: 'Eu comigo mesmo',      sub: 'Meu maior rival sou eu de ontem',              icon: 'target'   },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {opts.map(o => <OptionCard key={o.value} {...o} selected={value === o.value} onClick={() => onChange(o.value)} />)}
    </div>
  )
}

function Step5({ value, onChange }) {
  const opts = [
    { value: 'saude',        label: 'Saúde',              sub: 'Cuidar melhor do meu corpo e mente',       icon: 'heart'    },
    { value: 'estudos',      label: 'Estudos',             sub: 'Render mais e aprender de verdade',         icon: 'book'     },
    { value: 'dinheiro',     label: 'Dinheiro',            sub: 'Ter mais controle financeiro',              icon: 'wallet'   },
    { value: 'aparencia',    label: 'Aparência',           sub: 'Me sentir bem no espelho',                  icon: 'dumbbell' },
    { value: 'produtividade',label: 'Produtividade',       sub: 'Aproveitar melhor meu tempo',               icon: 'target'   },
    { value: 'equilibrio',   label: 'Equilíbrio geral',   sub: 'Quero melhorar um pouco de tudo',           icon: 'sparkle'  },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {opts.map(o => <OptionCard key={o.value} {...o} selected={value === o.value} onClick={() => onChange(o.value)} />)}
    </div>
  )
}

function Step6({ altura, setAltura, peso, setPeso }) {
  const imcVal = peso / ((altura / 100) ** 2)
  const imc    = imcVal.toFixed(1)
  const cat    = imcVal < 18.5 ? 'Abaixo do peso' : imcVal < 25 ? 'Peso ideal' : imcVal < 30 ? 'Sobrepeso' : 'Obesidade'
  const color  = imcVal < 18.5 ? '#eab308' : imcVal < 25 ? NEON : imcVal < 30 ? '#f97316' : '#ef4444'
  const pct    = Math.max(0, Math.min(100, ((imcVal - 10) / 30) * 100))
  const msg    = imcVal < 18.5
    ? 'Você está abaixo do peso ideal. O ORION vai ajudar a construir uma rotina equilibrada.'
    : imcVal < 25
      ? 'Você está no peso ideal! O ORION vai manter seus resultados e otimizar sua performance.'
      : imcVal < 30
        ? 'Você está acima do peso ideal. O ORION pode te ajudar a mudar isso com consistência.'
        : 'O ORION vai te guiar passo a passo para uma transformação completa.'

  const sliderStyle = { flex: 1, accentColor: NEON, cursor: 'pointer', height: 4 }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Altura */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={NEON} strokeWidth="2" strokeLinecap="round">
            <path d="M21 6H3M21 12H3M21 18H3M3 6l3-3M3 6l3 3"/>
          </svg>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.14em' }}>ALTURA</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <input type="range" min={140} max={210} value={altura} onChange={e => setAltura(+e.target.value)} style={sliderStyle} />
          <span style={{ fontSize: 22, fontWeight: 900, color: '#fff', minWidth: 78, textAlign: 'right' }}>
            {altura}<span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginLeft: 2 }}>cm</span>
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
          <span>140cm</span><span>210cm</span>
        </div>
      </div>

      {/* Peso */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={NEON} strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="6" r="4"/><path d="M6.5 10h11l2 12H4.5z"/>
          </svg>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.14em' }}>PESO</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <input type="range" min={40} max={150} value={peso} onChange={e => setPeso(+e.target.value)} style={sliderStyle} />
          <span style={{ fontSize: 22, fontWeight: 900, color: '#fff', minWidth: 78, textAlign: 'right' }}>
            {peso}<span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginLeft: 2 }}>kg</span>
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
          <span>40kg</span><span>150kg</span>
        </div>
      </div>

      {/* IMC */}
      <div style={{ background: 'rgba(6,16,6,0.9)', border: '1px solid rgba(204,255,0,0.14)', borderRadius: 14, padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={NEON} strokeWidth="2" strokeLinecap="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Seu IMC</span>
          </div>
          <div style={{
            fontSize: 10, fontWeight: 700, color,
            background: `${color}18`, border: `1px solid ${color}44`,
            padding: '3px 10px', borderRadius: 20,
          }}>{cat}</div>
        </div>

        <p style={{ fontSize: 52, fontWeight: 900, color, textAlign: 'center', lineHeight: 1, marginBottom: 18, fontFamily: 'monospace' }}>{imc}</p>

        {/* Color bar */}
        <div style={{ position: 'relative', marginBottom: 6 }}>
          <div style={{
            height: 8, borderRadius: 4,
            background: 'linear-gradient(to right, #eab308 0%,#eab308 27%,#4ade80 27%,#4ade80 43%,#f97316 43%,#f97316 60%,#ef4444 60%,#ef4444 100%)',
          }}>
            <div style={{
              position: 'absolute', top: '50%', left: `${pct}%`,
              transform: 'translate(-50%, -50%)',
              width: 14, height: 14, borderRadius: '50%',
              background: '#fff', border: '2.5px solid #010208',
              boxShadow: `0 0 8px ${color}`,
            }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.32)', marginBottom: 14 }}>
          <span>Abaixo</span><span>Ideal</span><span>Sobre</span><span>Obeso</span>
        </div>

        {/* Analysis */}
        <div style={{
          display: 'flex', gap: 10, alignItems: 'flex-start',
          padding: '12px 14px',
          background: 'rgba(204,255,0,0.04)', border: '1px solid rgba(204,255,0,0.1)', borderRadius: 10,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NEON} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: NEON, marginBottom: 4 }}>Análise ORION IA</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.48)', lineHeight: 1.55 }}>{msg}</p>
          </div>
        </div>
      </div>

    </div>
  )
}

/* ── Quiz metadata ─────────────────────────────────────────────────── */
const QUESTIONS = [
  { q: 'O que está te travando agora?',                   sub: '90% das pessoas não evoluem por causa de UM desses motivos'          },
  { q: 'Se você pudesse mudar TUDO, o que mudaria?',      sub: 'Selecione tudo que você quer transformar nos próximos 90 dias'        },
  { q: 'De 1 a 5, quanta disciplina você tem HOJE?',      sub: 'Sem julgamento. A maioria marca 2 ou 3'                              },
  { q: 'O que te faz dar o máximo?',                      sub: 'Sua resposta define como o ORION vai te desafiar'                    },
  { q: 'Se só pudesse mudar UMA coisa agora, qual seria?',sub: 'A IA do ORION vai priorizar isso no seu plano'                       },
  { q: 'Última etapa: suas métricas',                     sub: 'A IA precisa disso para calcular seu plano ideal'                    },
]

/* ── Main component ────────────────────────────────────────────────── */
export default function Quiz({ onClose }) {
  const [step,    setStep]    = useState(1)
  const [answers, setAnswers] = useState({})
  const [altura,  setAltura]  = useState(170)
  const [peso,    setPeso]    = useState(70)

  function set(key, val) { setAnswers(p => ({ ...p, [key]: val })) }

  function canProceed() {
    if (step === 1) return !!answers.s1
    if (step === 2) return (answers.s2 || []).length > 0
    if (step === 3) return !!answers.s3
    if (step === 4) return !!answers.s4
    if (step === 5) return !!answers.s5
    return true
  }

  function next() {
    if (!canProceed()) return
    if (step < TOTAL) setStep(s => s + 1)
    else onClose()
  }

  const { q, sub } = QUESTIONS[step - 1]
  const progress   = (step / TOTAL) * 100
  const isLast     = step === TOTAL

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: BG, overflowY: 'auto' }}
    >
      {/* Background glows */}
      <div style={{ position: 'fixed', top: -80, left: -80, width: 420, height: 420, background: 'radial-gradient(circle, rgba(109,40,217,0.16) 0%, transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: -80, right: -80, width: 420, height: 420, background: 'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>

        {/* ── Header ── */}
        <div style={{ padding: '18px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {step > 1
            ? <button onClick={() => setStep(s => s - 1)} style={{ position: 'absolute', left: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: 22, lineHeight: 1, padding: '4px 8px' }}>‹</button>
            : null
          }
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={NEON}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span style={{ fontSize: 17, fontWeight: 900, color: '#fff', letterSpacing: '-0.01em' }}>ORION</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(204,255,0,0.07)', border: '1px solid rgba(204,255,0,0.18)', borderRadius: 20, padding: '3px 12px' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={NEON} strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              <span style={{ fontSize: 10, color: NEON, fontWeight: 600 }}>Criando seu plano personalizado</span>
            </div>
          </div>
        </div>

        {/* ── Progress ── */}
        <div style={{ marginTop: 16 }}>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              style={{ height: '100%', background: NEON, originX: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.38, ease: 'easeOut' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 20px 0', fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>
            <span>Pergunta {step} de {TOTAL}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* ── Step content ── */}
        <div style={{ flex: 1, padding: '22px 20px 140px', maxWidth: 680, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.25, marginBottom: 8 }}>{q}</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', marginBottom: 24, lineHeight: 1.5 }}>{sub}</p>

              {step === 1 && <Step1 value={answers.s1} onChange={v => set('s1', v)} />}
              {step === 2 && <Step2 value={answers.s2} onChange={v => set('s2', v)} />}
              {step === 3 && <Step3 value={answers.s3} onChange={v => set('s3', v)} />}
              {step === 4 && <Step4 value={answers.s4} onChange={v => set('s4', v)} />}
              {step === 5 && <Step5 value={answers.s5} onChange={v => set('s5', v)} />}
              {step === 6 && <Step6 altura={altura} setAltura={setAltura} peso={peso} setPeso={setPeso} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Bottom CTA ── */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10,
          padding: '12px 20px 32px',
          background: `linear-gradient(to top, ${BG} 55%, transparent)`,
        }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            {isLast && (
              <button onClick={onClose} style={{ display: 'block', width: '100%', textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,80,80,0.55)', fontSize: 13, marginBottom: 10, padding: '4px 0' }}>
                Prefiro não informar
              </button>
            )}
            <motion.button
              onClick={next}
              whileTap={canProceed() ? { scale: 0.98 } : {}}
              style={{
                width: '100%', padding: '18px 0',
                background: canProceed() ? NEON : 'rgba(204,255,0,0.07)',
                color: canProceed() ? '#000' : 'rgba(204,255,0,0.22)',
                border: canProceed() ? 'none' : '1px solid rgba(204,255,0,0.14)',
                borderRadius: 14, fontWeight: 900, fontSize: 16,
                cursor: canProceed() ? 'pointer' : 'default',
                transition: 'background 0.18s, color 0.18s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {isLast ? 'Analisar meu perfil' : 'Próximo passo'} <span style={{ fontSize: 20, lineHeight: 1 }}>›</span>
            </motion.button>
          </div>
        </div>

      </div>
    </motion.div>
  )
}
