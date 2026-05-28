import { Share, Plus, Check } from 'lucide-react'

const MUTED = '#888888'

const STEPS = [
  {
    Icon: Share,
    label: 'Toque em',
    bold: 'Compartilhar',
    sub: 'botão na barra inferior do Safari',
  },
  {
    Icon: Plus,
    label: 'Toque em',
    bold: 'Adicionar à Tela de Início',
    sub: 'role a lista de opções para encontrar',
  },
  {
    Icon: Check,
    label: 'Toque em',
    bold: 'Adicionar',
    sub: 'no canto superior direito',
  },
]

export default function IOSInstallInstructions() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {STEPS.map(({ Icon, label, bold, sub }, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 11, flexShrink: 0,
            background: '#1a1a1a', border: '1px solid #2a2a2a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={18} color='#7C3AED' />
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#fff' }}>
              {label} <span style={{ fontWeight: 700 }}>{bold}</span>
            </div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{sub}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
