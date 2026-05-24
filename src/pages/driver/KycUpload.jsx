import { useState } from 'react'
import { UploadCloud, CheckCircle, AlertTriangle, FileText, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { auth } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function KycUpload() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [idDoc, setIdDoc] = useState('')
  const [licenseDoc, setLicenseDoc] = useState('')
  const [loading, setLoading] = useState(false)

  // Simulate file upload by converting file to a base64 string
  const handleFileChange = (e, setter) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setter(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!idDoc || !licenseDoc) return alert('Please upload both documents.')
    setLoading(true)
    try {
      await auth.kycUpload(idDoc, licenseDoc)
      // Simulate brief Stripe processing delay
      setTimeout(() => {
        setLoading(false)
        setUser(prev => ({ ...prev, kycStatus: 'approved' }))
        navigate('/driver/dashboard')
      }, 1500)
    } catch (err) {
      alert('Failed to verify documents: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-lg w-full bg-white rounded-3xl p-8 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Verify Your Identity</h2>
        </div>
        <p className="text-gray-500 mb-6">To start accepting jobs and receive payouts, we need to verify your identity using our secure automated system.</p>

        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center gap-3 mb-8">
          <ShieldCheck className="w-8 h-8 text-indigo-600 shrink-0" />
          <p className="text-xs text-indigo-800 font-medium">
            Your information is securely processed and verified instantly via <span className="font-bold">Stripe Identity</span>. 
            We do not store your raw biometric data.
          </p>
        </div>

        <div className="space-y-6">
          {/* Official ID */}
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center relative hover:border-indigo-400 transition bg-gray-50 group">
            <input type="file" accept="image/*,.pdf" onChange={e => handleFileChange(e, setIdDoc)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="flex flex-col items-center justify-center pointer-events-none">
              {idDoc ? (
                <>
                  <CheckCircle className="w-10 h-10 text-emerald-500 mb-2" />
                  <p className="font-bold text-emerald-700">Official ID Uploaded</p>
                </>
              ) : (
                <>
                  <FileText className="w-10 h-10 text-gray-400 mb-2 group-hover:text-indigo-500 transition" />
                  <p className="font-bold text-gray-700">Upload Official ID</p>
                  <p className="text-sm text-gray-400">Passport, National ID (Front and Back)</p>
                </>
              )}
            </div>
          </div>

          {/* Driver License */}
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center relative hover:border-indigo-400 transition bg-gray-50 group">
            <input type="file" accept="image/*,.pdf" onChange={e => handleFileChange(e, setLicenseDoc)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="flex flex-col items-center justify-center pointer-events-none">
              {licenseDoc ? (
                <>
                  <CheckCircle className="w-10 h-10 text-emerald-500 mb-2" />
                  <p className="font-bold text-emerald-700">Driver's License Uploaded</p>
                </>
              ) : (
                <>
                  <UploadCloud className="w-10 h-10 text-gray-400 mb-2 group-hover:text-indigo-500 transition" />
                  <p className="font-bold text-gray-700">Upload Driver's License</p>
                  <p className="text-sm text-gray-400">Valid license document (Front and Back)</p>
                </>
              )}
            </div>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={!idDoc || !licenseDoc || loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl mt-8 shadow-lg shadow-indigo-900/20 disabled:opacity-50 flex items-center justify-center gap-2 transition"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Verifying with Stripe...</>
          ) : (
            <>Verify Identity <ArrowRight className="w-5 h-5" /></>
          )}
        </button>
      </motion.div>
    </div>
  )
}
