import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, X, Briefcase, Calendar } from 'lucide-react'
import { drivers } from '../services/api'

export default function DriverProfileModal({ driverId, isOpen, onClose }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isOpen) return;
    
    if (!driverId) {
      setLoading(false);
      setProfile(null);
      return;
    }

    setLoading(true);
    try {
      drivers.publicProfile(driverId)
        .then(data => setProfile(data))
        .catch(err => {
          console.error('Failed to load profile', err);
          setProfile(null);
        })
        .finally(() => setLoading(false));
    } catch (err) {
      console.error('Sync error in publicProfile', err);
      setLoading(false);
      setProfile(null);
    }
  }, [isOpen, driverId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-gray-900/40 backdrop-blur-sm">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">Driver Profile</h2>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-10">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : profile ? (
          <div className="overflow-y-auto p-5 pb-8 space-y-6">
            
            {/* Header */}
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-md border-4 border-white mb-3 overflow-hidden">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Driver" className="w-full h-full object-cover" />
                ) : (
                  profile.name?.split(' ').map(n => n[0]).join('').slice(0, 2)
                )}
              </div>
              <h3 className="font-bold text-xl text-gray-900">{profile.name}</h3>
              <p className="text-gray-500 text-sm mt-1">{profile.vehicle} • {profile.licensePlate}</p>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-4">
              <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center flex-1">
                <Star className="w-6 h-6 text-amber-400 fill-amber-400 mb-1" />
                <span className="font-bold text-gray-900 text-lg">{profile.rating}</span>
                <span className="text-xs text-gray-500 font-medium">{profile.totalRatings} Reviews</span>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center flex-1">
                <Briefcase className="w-6 h-6 text-blue-500 mb-1" />
                <span className="font-bold text-gray-900 text-lg">{profile.completedJobs}</span>
                <span className="text-xs text-gray-500 font-medium">Jobs Completed</span>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Reviews */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Recent Reviews</h4>
              {profile.reviews && profile.reviews.length > 0 ? (
                <div className="space-y-4">
                  {profile.reviews.map((rev, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-gray-800">{rev.clientName}</span>
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-bold text-amber-700">{rev.rating}</span>
                        </div>
                      </div>
                      {rev.review ? (
                        <p className="text-gray-600 text-sm italic">"{rev.review}"</p>
                      ) : (
                        <p className="text-gray-400 text-sm italic">No comment provided.</p>
                      )}
                      <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(rev.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 text-sm py-4 bg-gray-50 rounded-xl">No reviews yet for this driver.</p>
              )}
            </div>

          </div>
        ) : (
          <div className="p-5 text-center text-red-500">Failed to load profile.</div>
        )}
      </motion.div>
    </div>
  )
}
