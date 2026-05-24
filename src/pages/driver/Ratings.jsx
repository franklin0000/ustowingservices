import { Star, MessageSquare } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { motion } from 'framer-motion'

export default function Ratings() {
  const { getRatings } = useApp()
  const [data, setData] = useState(null)

  useEffect(() => { getRatings().then(setData).catch(() => {}) }, [])

  if (!data) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
    </div>
  )

  const totalForPct = data.distribution.reduce((s, d) => s + d.count, 0) || 1

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-100">My Ratings</h1>
        <p className="text-sm text-gray-400 mt-1">See what clients say about your service</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Avg Rating Card */}
        <div className="bg-gray-800/80 border border-gray-700/50 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Overall Rating</p>
          <div className="text-6xl font-black text-gray-100 mb-3">{data.avgRating.toFixed(1)}</div>
          <div className="flex items-center justify-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} className={`w-6 h-6 ${s <= Math.round(data.avgRating) ? 'text-amber-400 fill-amber-400 drop-shadow-md' : 'text-gray-600'}`} />
            ))}
          </div>
          <p className="text-gray-400 text-sm font-semibold bg-gray-700/30 px-4 py-1.5 rounded-full border border-gray-700">
            {data.totalRatings} Total Ratings
          </p>
        </div>

        {/* Distribution Card */}
        <div className="bg-gray-800/80 border border-gray-700/50 rounded-3xl p-6 shadow-sm lg:col-span-2">
          <h3 className="font-bold text-gray-100 mb-5 text-sm uppercase tracking-wide">Rating Distribution</h3>
          <div className="space-y-4">
            {data.distribution.map(d => (
              <div key={d.star} className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-300 w-8 flex items-center gap-1">
                  {d.star} <Star className="w-3.5 h-3.5 fill-gray-500 text-gray-500" />
                </span>
                <div className="flex-1 bg-gray-900 rounded-full h-3.5 overflow-hidden border border-gray-700 shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(d.count / totalForPct) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="bg-amber-400 h-full rounded-full shadow-lg"
                  />
                </div>
                <span className="text-xs font-semibold text-gray-400 w-16 text-right">
                  {d.count} <span className="text-gray-600">({((d.count / totalForPct) * 100).toFixed(0)}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-gray-800/80 border border-gray-700/50 rounded-3xl p-6 shadow-sm">
        <h3 className="font-bold text-gray-100 mb-6 flex items-center gap-2 text-sm uppercase tracking-wide">
          <MessageSquare className="w-5 h-5 text-emerald-400" /> Client Reviews
        </h3>
        <div className="space-y-4">
          {data.reviews.length === 0 ? (
            <div className="text-center py-10 bg-gray-900/50 rounded-2xl border border-dashed border-gray-700">
              <MessageSquare className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 font-semibold">No reviews yet</p>
              <p className="text-xs text-gray-500 mt-1">Keep providing great service to earn reviews.</p>
            </div>
          ) : (
            data.reviews.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl bg-gray-900/50 border border-gray-700/50 hover:bg-gray-900 transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center font-bold text-sm border border-blue-500/20">
                      {r.clientName?.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-gray-200">{r.clientName}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-700'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-800 px-2.5 py-1 rounded-lg border border-gray-700">
                    {r.date ? new Date(r.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                  </span>
                </div>
                {r.review && <p className="text-sm text-gray-400 ml-13 leading-relaxed">"{r.review}"</p>}
              </motion.div>
            ))
          )}
        </div>
      </div>

    </div>
  )
}
