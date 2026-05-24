import { Search, Shield, Ban } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'

export default function AdminUsers() {
  const { getAdminUsers, updateUserStatus } = useApp()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => { getAdminUsers(search || undefined).then(setUsers).catch(() => {}) }, [search])

  const toggleStatus = async (id, current) => {
    const newStatus = current === 'active' ? 'suspended' : 'active'
    await updateUserStatus(id, newStatus)
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">User Management</h1><p className="text-gray-500 mt-1">{users.length} registered users</p></div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-medium"><span className="w-2 h-2 bg-emerald-500 rounded-full" />{users.filter(u => u.status === 'active').length} Active</div>
          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-sm font-medium"><span className="w-2 h-2 bg-red-500 rounded-full" />{users.filter(u => u.status === 'suspended').length} Suspended</div>
        </div>
      </div>
      <div className="card mb-6"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input className="input-field pl-10" placeholder="Search users by name or email..." value={search} onChange={e => setSearch(e.target.value)} /></div></div>
      <div className="card overflow-hidden"><div className="overflow-x-auto">
        <table className="w-full"><thead><tr className="border-b border-gray-100">
          <th className="text-left text-xs font-semibold text-gray-400 uppercase py-3 px-4">User</th>
          <th className="text-left text-xs font-semibold text-gray-400 uppercase py-3 px-4">Contact</th>
          <th className="text-left text-xs font-semibold text-gray-400 uppercase py-3 px-4">Joined</th>
          <th className="text-left text-xs font-semibold text-gray-400 uppercase py-3 px-4">Requests</th>
          <th className="text-left text-xs font-semibold text-gray-400 uppercase py-3 px-4">Status</th>
          <th className="text-left text-xs font-semibold text-gray-400 uppercase py-3 px-4">Actions</th>
        </tr></thead><tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
              <td className="py-3 px-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-semibold text-sm">{user.name.split(' ').map(n => n[0]).join('')}</div><div><p className="text-sm font-semibold">{user.name}</p><p className="text-xs text-gray-400">{user.id}</p></div></div></td>
              <td className="py-3 px-4"><p className="text-sm">{user.email}</p><p className="text-xs text-gray-400">{user.phone}</p></td>
              <td className="py-3 px-4 text-sm text-gray-600">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
              <td className="py-3 px-4 text-sm font-semibold">{user.requestCount}</td>
              <td className="py-3 px-4"><span className={user.status === 'active' ? 'badge-success' : 'badge-danger'}>{user.status === 'active' ? 'Active' : 'Suspended'}</span></td>
              <td className="py-3 px-4"><button onClick={() => toggleStatus(user.id, user.status)} className={`p-1.5 rounded-lg transition ${user.status === 'active' ? 'hover:bg-red-50 text-red-500' : 'hover:bg-emerald-50 text-emerald-500'}`}>{user.status === 'active' ? <Ban className="w-4 h-4" /> : <Shield className="w-4 h-4" />}</button></td>
            </tr>
          ))}
        </tbody></table>
      </div></div>
    </div>
  )
}
