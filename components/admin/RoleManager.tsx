'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { HiPencil } from 'react-icons/hi'

interface User {
  id: string
  name: string | null
  email: string | null
  role: string
  image: string | null
  createdAt: string
}

interface Props {
  users: User[]
}

const roleOptions = [
  { value: 'FUNDADOR', label: 'Fundador', color: 'text-red-400' },
  { value: 'ADM', label: 'ADM', color: 'text-blue-400' },
  { value: 'COLABORADOR', label: 'Colaborador', color: 'text-yellow-400' },
]

export function RoleManager({ users: initialUsers }: Props) {
  const [users, setUsers] = useState(initialUsers)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newRole, setNewRole] = useState('')

  const handleUpdateRole = async (userId: string) => {
    if (!newRole) return

    try {
      const res = await fetch('/api/admin/roles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || 'Erro ao atualizar cargo')
        return
      }

      toast.success('Cargo atualizado com sucesso!')
      setUsers((prev) =>
        prev.map((u) => u.id === userId ? { ...u, role: newRole } : u)
      )
      setEditingId(null)
      setNewRole('')
    } catch {
      toast.error('Erro ao atualizar cargo')
    }
  }

  const getRoleColor = (role: string) => {
    const found = roleOptions.find((r) => r.value === role)
    return found?.color || 'text-zinc-400'
  }

  const getRoleLabel = (role: string) => {
    const found = roleOptions.find((r) => r.value === role)
    return found?.label || role
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <div key={user.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-opium-purple-900/40 flex items-center justify-center overflow-hidden">
            {user.image ? (
              <img src={user.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-opium-purple-300">
                {(user.name || '?')[0].toUpperCase()}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user.name || 'Sem nome'}</p>
            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
          </div>

          {/* Cargo */}
          {editingId === user.id ? (
            <div className="flex items-center gap-2">
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="input-dark text-sm appearance-none"
              >
                {roleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleUpdateRole(user.id)}
                className="btn-primary text-xs py-1 px-3"
              >
                Salvar
              </button>
              <button
                onClick={() => {
                  setEditingId(null)
                  setNewRole('')
                }}
                className="text-xs text-zinc-500 hover:text-zinc-300"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${getRoleColor(user.role)}`}>
                🛡️
                {getRoleLabel(user.role)}
              </span>
              <button
                onClick={() => {
                  setEditingId(user.id)
                  setNewRole(user.role)
                }}
                className="p-1.5 text-zinc-600 hover:text-zinc-300 transition-colors"
                title="Editar cargo"
              >
                <HiPencil size={14} />
              </button>
            </div>
          )}
        </div>
      ))}

      {users.length === 0 && (
        <div className="glass-card rounded-xl p-8 text-center">
          <p className="text-zinc-500">Nenhum membro da equipe encontrado.</p>
        </div>
      )}
    </div>
  )
}