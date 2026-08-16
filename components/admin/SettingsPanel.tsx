'use client'

import { useState, useEffect } from 'react'

interface Props {
  isFundador: boolean
}

export function SettingsPanel({ isFundador }: Props) {
  const [settings, setSettings] = useState<Record<string, { value: string; description: string | null }>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  // Configurações conhecidas com valores padrão
  const defaultSettings: Record<string, { label: string; value: string; description: string; editableBy: string }> = {
    PIX_KEY: {
      label: 'Chave Pix',
      value: '',
      description: 'Chave Pix para recebimentos de pagamentos e doações',
      editableBy: 'FUNDADOR',
    },
    SITE_NAME: {
      label: 'Nome do Site',
      value: 'Opium',
      description: 'Nome exibido no site',
      editableBy: 'ADM',
    },
    DONATION_MIN: {
      label: 'Doação Mínima (R$)',
      value: '0.10',
      description: 'Valor mínimo permitido para doações',
      editableBy: 'ADM',
    },
    REFERRAL_COMMISSION: {
      label: 'Comissão por Indicação (R$)',
      value: '1.00',
      description: 'Valor pago ao indicador por cada venda',
      editableBy: 'ADM',
    },
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/settings')
        if (res.ok) {
          const data = await res.json()
          setSettings(data)
        }
      } catch (err) {
        console.error('Erro ao carregar configurações:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const canEdit = (key: string) => {
    const config = defaultSettings[key]
    if (!config) return isFundador // configs desconhecidas: só fundador
    if (config.editableBy === 'FUNDADOR') return isFundador
    return true // ADM+
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')

    const updates: Record<string, string> = {}
    for (const [key, config] of Object.entries(defaultSettings)) {
      const current = settings[key]?.value || config.value
      updates[key] = current
    }

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (res.ok) {
        setMessage('✅ Configurações salvas com sucesso!')
      } else {
        const data = await res.json()
        setMessage(`❌ ${data.message || 'Erro ao salvar'}`)
      }
    } catch {
      setMessage('❌ Erro de conexão')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], value },
    }))
  }

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <p className="text-zinc-400">Carregando configurações...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {Object.entries(defaultSettings).map(([key, config]) => {
        const currentValue = settings[key]?.value || config.value
        const editable = canEdit(key)
        const isPixKey = key === 'PIX_KEY'

        return (
          <div key={key} className="glass-card rounded-xl p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-zinc-200">{config.label}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">{config.description}</p>
              </div>
              {!editable && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                  Apenas Fundador
                </span>
              )}
            </div>
            <input
              type={isPixKey ? 'text' : 'text'}
              value={currentValue}
              onChange={(e) => handleChange(key, e.target.value)}
              disabled={!editable}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm
                ${editable
                  ? 'bg-zinc-900 border-zinc-700 text-zinc-200 focus:border-opium-purple focus:ring-1 focus:ring-opium-purple/50 outline-none'
                  : 'bg-zinc-900/50 border-zinc-800 text-zinc-600 cursor-not-allowed'
                }
              `}
              placeholder={config.value}
            />
          </div>
        )
      })}

      {/* Botão Salvar */}
      <div className="flex items-center justify-between pt-4">
        {message && (
          <p className={`text-sm ${message.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-opium-purple hover:bg-opium-purple-dark text-white px-6 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </div>
    </div>
  )
}
