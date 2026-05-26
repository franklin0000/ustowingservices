import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Terms() {
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

          <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">Terms of Service</h1>
          <p className="text-gray-500 font-medium mb-10">Last Updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p>By accessing or using US Towing Services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Services Provided</h2>
              <p>US Towing Services provides a platform connecting users (Clients) with independent towing and roadside assistance providers (Drivers). We do not provide towing services directly.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
              <p>You must provide accurate, complete, and current information when creating an account. You are responsible for safeguarding the password and for all activities under your account.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Payment Terms</h2>
              <p>Clients agree to pay for all services requested through the platform. Prices are estimated based on distance and service type but may vary based on actual conditions.</p>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
