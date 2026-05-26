import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true)
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    
    deferredPrompt.prompt()
    
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setIsInstallable(false)
    }
    setDeferredPrompt(null)
  }

  // iOS Safari specific manual instructions (Apple does not support beforeinstallprompt)
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  const showIosInstructions = isIOS && !isInstalled && !isInstallable

  if (isInstalled) return null

  if (showIosInstructions) {
    return (
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Download className="w-5 h-5 text-brand-600" />
          <h4 className="font-bold text-brand-900 text-sm">Install App on iOS</h4>
        </div>
        <p className="text-xs text-brand-700">
          Tap the <b>Share</b> icon <span className="inline-block align-middle border rounded p-0.5"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg></span> at the bottom of Safari, then select <b>"Add to Home Screen"</b> to install.
        </p>
      </div>
    )
  }

  if (!isInstallable) return null

  return (
    <button
      onClick={handleInstallClick}
      className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-4 animate-pulse-soft"
    >
      <Download className="w-5 h-5" />
      Install App
    </button>
  )
}
