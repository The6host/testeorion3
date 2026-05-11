const CLICK_URL = 'https://res.cloudinary.com/dctzllsly/video/upload/v1778455021/click_mjhzu9.mp3'

let _audio = null

function getAudio() {
  if (!_audio) {
    _audio = new Audio(CLICK_URL)
    _audio.volume = 0.4
  }
  return _audio
}

/* Reseta currentTime antes de tocar — cliques rápidos nunca se sobrepõem */
export function playClick() {
  const a = getAudio()
  a.currentTime = 0
  a.play().catch(() => {})
}
