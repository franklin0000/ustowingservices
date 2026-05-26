import { Settings, Bell, DollarSign, MapPin, Shield, Save } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'

export default function AdminSettings() {
  const { getAdminSettings, updateAdminSettings } = useApp()
  const [settings, setSettings] = useState({
    platformName: 'Gruas',
    platformFee: 25,
    maxRadius: 15,
    currency: 'USD',
    autoAssign: true,
    notifyDrivers: true,
    notifyClients: true,
    requireRating: true,
    minDriverRating: 4.0,
    maxActiveJobs: 1,
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getAdminSettings().then(data => {
      if (!data) return;
      setSettings(prev => ({
        ...prev,
        platformName: data.platform_name || prev.platformName,
        platformFee: data.platform_fee_pct !== undefined ? Number(data.platform_fee_pct) : prev.platformFee,
        maxRadius: data.max_search_radius_km !== undefined ? Number(data.max_search_radius_km) : prev.maxRadius,
        currency: data.currency || prev.currency,
        autoAssign: data.auto_assign === 'true',
        notifyDrivers: data.notify_drivers === 'true',
        notifyClients: data.notify_clients === 'true',
        requireRating: data.require_rating === 'true',
        minDriverRating: data.min_driver_rating !== undefined ? Number(data.min_driver_rating) : prev.minDriverRating,
        maxActiveJobs: data.max_active_jobs_per_driver !== undefined ? Number(data.max_active_jobs_per_driver) : prev.maxActiveJobs,
      }))
    }).catch(e => console.error(e))
  }, [])

  const handleSave = async () => {
    try {
      await updateAdminSettings({
        platform_name: settings.platformName,
        platform_fee_pct: settings.platformFee.toString(),
        max_search_radius_km: settings.maxRadius.toString(),
        currency: settings.currency,
        auto_assign: settings.autoAssign.toString(),
        notify_drivers: settings.notifyDrivers.toString(),
        notify_clients: settings.notifyClients.toString(),
        require_rating: settings.requireRating.toString(),
        min_driver_rating: settings.minDriverRating.toString(),
        max_active_jobs_per_driver: settings.maxActiveJobs.toString()
      });
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-500 mt-1">Configure platform behavior and policies</p>
        </div>
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-600" /> General
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Platform Name</label>
              <input
                className="input-field"
                value={settings.platformName}
                onChange={e => setSettings({ ...settings, platformName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
              <select
                className="input-field"
                value={settings.currency}
                onChange={e => setSettings({ ...settings, currency: e.target.value })}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="MXN">MXN - Mexican Peso</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-brand-600" /> Pricing
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Platform Fee (%)</label>
              <input
                type="number"
                className="input-field"
                value={settings.platformFee}
                onChange={e => setSettings({ ...settings, platformFee: Number(e.target.value) })}
              />
              <p className="text-xs text-gray-400 mt-1">Percentage taken from each transaction</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Search Radius (km)</label>
              <input
                type="number"
                className="input-field"
                value={settings.maxRadius}
                onChange={e => setSettings({ ...settings, maxRadius: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand-600" /> Notifications
          </h3>
          <div className="space-y-4">
            {[
              { key: 'autoAssign', label: 'Auto-assign drivers', desc: 'Automatically match nearest available driver' },
              { key: 'notifyDrivers', label: 'Notify drivers of new jobs', desc: 'Push notifications for new requests' },
              { key: 'notifyClients', label: 'Notify clients of updates', desc: 'Status updates via push notifications' },
              { key: 'requireRating', label: 'Require rating after service', desc: 'Clients must rate before closing' },
            ].map(item => (
              <label key={item.key} className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-gray-700">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
                <div
                  onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key] })}
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer flex items-center ${
                    settings[item.key] ? 'bg-brand-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings[item.key] ? 'translate-x-[22px]' : 'translate-x-[2px]'
                  }`} />
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-600" /> Driver Requirements
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Minimum Driver Rating</label>
              <input
                type="number"
                step="0.1"
                className="input-field"
                value={settings.minDriverRating}
                onChange={e => setSettings({ ...settings, minDriverRating: Number(e.target.value) })}
              />
              <p className="text-xs text-gray-400 mt-1">Drivers below this rating will be flagged for review</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Active Jobs Per Driver</label>
              <input
                type="number"
                className="input-field"
                value={settings.maxActiveJobs}
                onChange={e => setSettings({ ...settings, maxActiveJobs: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 slide-in">
          <Save className="w-5 h-5" /> Settings saved successfully
        </div>
      )}
    </div>
  )
}
