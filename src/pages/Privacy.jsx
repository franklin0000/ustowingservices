import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="p-8 sm:p-12">
          <Link to="/register" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Registration
          </Link>

          <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">Privacy Policy</h1>
          <p className="text-gray-500 font-medium mb-10">Last Updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <p>We collect information you provide directly to us, including your name, email address, phone number, payment information, and location data when using the app.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect to provide, maintain, and improve our services, process transactions, send notifications, and provide customer support.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
              <p>We may share your location and contact information with Drivers (if you are a Client) or Clients (if you are a Driver) solely for the purpose of facilitating the requested service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
              <p>We implement appropriate technical and organizational measures designed to protect the security of any personal information we process. We use bank-grade encryption for all sensitive data.</p>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
