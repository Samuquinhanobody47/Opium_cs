'use client'

import { useState } from 'react'

const presetValues = [5, 10, 25, 50, 100]

export function DonationForm() {
  const [amount, setAmount] = useState('10')
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pixData, setPixData] = useState<{ qrCode: string; copiaECola: string; expiresAt: string } | null>(null)
  const [polling, setPolling] = useState(false)
  const [paid, setPaid] = useState(false)

  const finalAmount = isCustom ? parseFloat(customAmount) : parseFloat(amount)

  const handleDonate = async () => {
    setError('')

    if (!finalAmount || finalAmount < 0.10) {
      setError('Valor mínimo: R$0,10')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/donations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Erro ao gerar Pix')
        return
      }

      setPixData({
        qrCode: data.qrCode,
        copiaECola: data.copiaECola,
        expiresAt: data.expiresAt,
      })

      // Iniciar polling
      setPolling(true)
      const donationId = data.donationId
      const poll = async () => {
        try {
          const statusRes = await fetch(`/api/donations/status?id=${donationId}`)
          const statusData = await statusRes.json()

          if (statusData.status === 'PAID') {
            setPaid(true)
            setPolling(false)
            return
          }

          if (statusData.status === 'EXPIRED') {
            setPolling(false)
            setError('Pagamento expirado. Tente novamente.')
            return
          }

          // Continuar polling
          setTimeout(poll, 3000)
        } catch {
          setTimeout(poll, 5000)
        }
      }

      setTimeout(poll, 3000)
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (pixData?.copiaECola) {
      navigator.clipboard.writeText(pixData.copiaECola)
    }
  }

  if (paid) {
    return (
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 text-center">
        <p className="text-5xl mb-4">🎉</p>
        <h2 className="text-xl font-bold text-green-300 mb-2">
          Doação recebida!
        </h2>
        <p className="text-zinc-400">
          Muito obrigado pelo apoio! 💜
        </p>
      </div>
    )
  }

  if (pixData) {
    return (
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Escaneie o QR Code
        </h2>

        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-xl">
            <img
              src={pixData.qrCode}
              alt="QR Code Pix"
              className="w-48 h-48"
            />
          </div>
        </div>

        <div className="mb-4">
          <button
            onClick={copyToClipboard}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>📋</span>
            <span>Copiar código Pix (Copia e Cola)</span>
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-zinc-500">
            Valor: <span className="text-opium-purple font-semibold">R$ {finalAmount.toFixed(2)}</span>
          </p>
          {polling && (
            <p className="text-xs text-zinc-600 mt-2 flex items-center justify-center gap-2">
              <span className="inline-block w-3 h-3 border-2 border-opium-purple border-t-transparent rounded-full animate-spin" />
              Aguardando pagamento...
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8">
      <h2 className="text-lg font-semibold mb-6 text-center">
        Quanto deseja doar?
      </h2>

      {/* Valores pré-definidos */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {presetValues.map((val) => (
          <button
            key={val}
            onClick={() => {
              setAmount(val.toString())
              setIsCustom(false)
            }}
            className={`py-3 rounded-xl text-sm font-semibold transition-all ${
              !isCustom && amount === val.toString()
                ? 'bg-opium-purple text-white border border-opium-purple'
                : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600'
            }`}
          >
            R${val}
          </button>
        ))}
      </div>

      {/* Valor personalizado */}
      <div className="mb-6">
        <button
          onClick={() => setIsCustom(true)}
          className={`text-sm mb-2 ${isCustom ? 'text-opium-purple' : 'text-zinc-500'}`}
        >
          Outro valor
        </button>
        {isCustom && (
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">R$</span>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="0.10"
              min={0.10}
              step={0.01}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-opium-purple"
            />
          </div>
        )}
      </div>

      {/* Erro */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-300 mb-4">
          {error}
        </div>
      )}

      {/* Botão */}
      <button
        onClick={handleDonate}
        disabled={loading || (!isCustom && !amount) || (isCustom && !customAmount)}
        className="w-full bg-opium-purple hover:bg-opium-purple-dark text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {loading ? 'Gerando Pix...' : `Doar R$ ${finalAmount.toFixed(2)}`}
      </button>
    </div>
  )
}