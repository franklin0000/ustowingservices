import React from 'react'
import { AlertTriangle, RefreshCw, Home, RotateCcw, LogOut } from 'lucide-react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleHardReload = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations()
        for (const reg of registrations) await reg.unregister()
      }
      if ('caches' in window) {
        const keys = await caches.keys()
        for (const k of keys) await caches.delete(k)
      }
    } catch (e) {}
    window.location.reload(true)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  handleLogoutAndReset = () => {
    try {
      localStorage.removeItem('gruas_token')
      localStorage.removeItem('gruas_user')
      sessionStorage.clear()
    } catch (e) {}
    window.location.href = '/login'
  }

  render() {
    if (this.state.hasError) {
      const errorMsg = this.state.error?.message || this.state.error?.toString() || 'Error desconocido'

      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 text-gray-100">
          <div className="max-w-lg w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-100 mb-1">Algo salió mal</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Ha ocurrido un error inesperado al cargar esta sección. Puedes reintentar o limpiar la caché para restablecerla.
              </p>
            </div>

            {/* Always visible technical detail for rapid diagnosis */}
            <div className="p-3 bg-black/60 rounded-xl border border-red-500/20 text-left">
              <p className="text-[10px] font-bold uppercase tracking-wider text-red-400/80 mb-1">Detalle del error:</p>
              <pre className="text-xs font-mono text-red-300 whitespace-pre-wrap break-all max-h-36 overflow-y-auto">
                {errorMsg}
              </pre>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-900/30"
              >
                <RotateCcw className="w-4 h-4" /> Reintentar
              </button>

              <button
                type="button"
                onClick={this.handleHardReload}
                className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-blue-900/30"
              >
                <RefreshCw className="w-4 h-4" /> Limpiar y recargar
              </button>
            </div>

            <div className="flex gap-3 pt-1 border-t border-gray-800">
              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium text-xs flex items-center justify-center gap-1.5 transition border border-gray-700"
              >
                <Home className="w-3.5 h-3.5" /> Ir al Inicio
              </button>
              <button
                type="button"
                onClick={this.handleLogoutAndReset}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-red-400 font-medium text-xs flex items-center justify-center gap-1.5 transition border border-gray-700"
              >
                <LogOut className="w-3.5 h-3.5" /> Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

