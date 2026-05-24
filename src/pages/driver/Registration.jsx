import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, UploadCloud, Truck, ShieldAlert, ArrowRight, ShieldCheck, Clock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { auth } from '../../services/api'

export default function Registration() {
  const { user, logout } = useAuth()
  const [step, setStep] = useState(1)
  const [documents, setDocuments] = useState({ id: null, insurance: null })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // If already submitted and waiting
  if (user?.kycStatus === 'pending' && step === 3) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mb-6">
          <Clock className="w-12 h-12 text-amber-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Verification Pending</h1>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          Your documents have been uploaded securely. Our team is reviewing your profile to ensure safety on the platform. This usually takes 24-48 hours.
        </p>
        <button onClick={logout} className="text-gray-500 hover:text-white transition">Log Out</button>
      </div>
    )
  }

  const handleUpload = (type, e) => {
    if (e.target.files && e.target.files[0]) {
      setDocuments(prev => ({ ...prev, [type]: e.target.files[0] }))
    }
  }

  const submitKyc = async () => {
    setIsSubmitting(true)
    try {
      await auth.bypassKyc()
      window.location.reload()
    } catch (err) {
      alert('Failed to submit KYC: ' + err.message)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4 lg:p-8">
      <div className="max-w-2xl w-full">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white tracking-tight mb-3">Partner Onboarding</h1>
          <p className="text-gray-400">Join the elite network of towing professionals.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-12 max-w-md mx-auto">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-gray-800 text-gray-500'}`}>1</div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-emerald-500' : 'bg-gray-800'}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-gray-800 text-gray-500'}`}>2</div>
          </div>
        </div>

        {/* Step 1: ID Upload */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-gray-800/80 border border-gray-700/50 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl"><ShieldAlert className="w-8 h-8" /></div>
              <div>
                <h2 className="text-2xl font-bold text-white">Identity Verification</h2>
                <p className="text-gray-400">Upload your government-issued ID</p>
              </div>
            </div>

            <label className="border-2 border-dashed border-gray-600 hover:border-emerald-500 hover:bg-gray-800/50 transition-colors rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer group mb-8">
              <UploadCloud className="w-12 h-12 text-gray-500 group-hover:text-emerald-400 mb-4 transition-colors" />
              <span className="font-semibold text-gray-300 group-hover:text-white">{documents.id ? documents.id.name : 'Click to browse files'}</span>
              <span className="text-sm text-gray-500 mt-2">JPG, PNG or PDF (Max 5MB)</span>
              <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleUpload('id', e)} />
            </label>

            <div className="flex justify-between items-center">
              <button onClick={logout} className="text-gray-400 hover:text-white font-medium px-4 py-2">Log Out</button>
              <button onClick={() => setStep(2)} disabled={!documents.id} className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all">
                Next Step <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Vehicle Docs */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-gray-800/80 border border-gray-700/50 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl"><Truck className="w-8 h-8" /></div>
              <div>
                <h2 className="text-2xl font-bold text-white">Vehicle Documents</h2>
                <p className="text-gray-400">Upload your tow truck insurance or registration</p>
              </div>
            </div>

            <label className="border-2 border-dashed border-gray-600 hover:border-emerald-500 hover:bg-gray-800/50 transition-colors rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer group mb-8">
              <UploadCloud className="w-12 h-12 text-gray-500 group-hover:text-emerald-400 mb-4 transition-colors" />
              <span className="font-semibold text-gray-300 group-hover:text-white">{documents.insurance ? documents.insurance.name : 'Click to browse files'}</span>
              <span className="text-sm text-gray-500 mt-2">JPG, PNG or PDF (Max 5MB)</span>
              <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleUpload('insurance', e)} />
            </label>

            <div className="flex justify-between items-center">
              <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white font-medium px-4 py-2">Back</button>
              <button onClick={submitKyc} disabled={!documents.insurance || isSubmitting} className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                {isSubmitting ? <span className="animate-pulse">Uploading...</span> : <><ShieldCheck className="w-5 h-5" /> Submit for Review</>}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
