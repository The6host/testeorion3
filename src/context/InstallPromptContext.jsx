import { createContext, useContext, useEffect, useState } from 'react'

const InstallPromptContext = createContext(null)

export function InstallPromptProvider({ children }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [wasInstalled,   setWasInstalled]   = useState(false)

  useEffect(() => {
    function handleBeforeInstallPrompt(e) {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    function handleAppInstalled() {
      setDeferredPrompt(null)
      setWasInstalled(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const canInstall = Boolean(deferredPrompt)

  async function triggerInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setWasInstalled(true)
    }
  }

  return (
    <InstallPromptContext.Provider value={{ deferredPrompt, canInstall, triggerInstall, wasInstalled }}>
      {children}
    </InstallPromptContext.Provider>
  )
}

export function useInstallPrompt() {
  return useContext(InstallPromptContext)
}
