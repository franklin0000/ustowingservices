import React from 'react'
import { AlertTriangle, RefreshCw, Home, ChevronDown } from 'lucide-react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, showDetails: false }
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

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 text-gray-100">
          <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-100 mb-1">Algo salió mal</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Ha ocurrido un error inesperado al cargar esta sección. Puedes reintentar o recargar la aplicación para restablecerla.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left">
                <button
                  type="button"
                  onClick={() => this.setState(s => ({ showDetails: !s.showDetails }))}
                  className="text-xs text-gray-500 hover:text-gray-400 flex items-center gap-1 mx-auto mb-2"
                >
                  <span>Ver detalle técnico</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${this.state.showDetails ? 'rotate-180' : ''}`} />
                </button>
                {this.state.showDetails && (
                  <pre className="p-3 bg-black/60 rounded-xl border border-gray-800 text-[11px] text-red-400 font-mono whitespace-pre-wrap break-all max-h-32 overflow-y-auto">
                    {this.state.error?.message || this.state.error?.toString()}
                  </pre>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-900/30"
              >
                <RefreshCw className="w-4 h-4" /> Recargar
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex-1 py-3 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold text-sm flex items-center justify-center gap-2 transition border border-gray-700"
              >
                <Home className="w-4 h-4" /> Inicio
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
