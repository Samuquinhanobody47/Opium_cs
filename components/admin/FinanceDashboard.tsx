'use client'

import { HiCash, HiHeart, HiUserGroup, HiTrendingUp } from 'react-icons/hi'

interface Props {
  totalRevenue: number
  totalDonations: number
  totalCommissions: number
  netRevenue: number
  totalPurchases: number
  totalDonationsCount: number
  recentPurchases: any[]
  recentDonations: any[]
  referralStats: any[]
}

export function FinanceDashboard({
  totalRevenue,
  totalDonations,
  totalCommissions,
  netRevenue,
  totalPurchases,
  totalDonationsCount,
  recentPurchases,
  recentDonations,
  referralStats,
}: Props) {
  const stats = [
    {
      label: 'Receita Total',
      value: `R$ ${totalRevenue.toFixed(2)}`,
      icon: HiCash,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      label: 'Doações',
      value: `R$ ${totalDonations.toFixed(2)}`,
      icon: HiHeart,
      color: 'text-pink-400',
      bg: 'bg-pink-500/10',
    },
    {
      label: 'Comissões',
      value: `R$ ${totalCommissions.toFixed(2)}`,
      icon: HiUserGroup,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
    {
      label: 'Receita Líquida',
      value: `R$ ${netRevenue.toFixed(2)}`,
      icon: HiTrendingUp,
      color: 'text-opium-purple-300',
      bg: 'bg-opium-purple-500/10',
    },
  ]

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-5">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={stat.color} size={20} />
            </div>
            <p className="text-xs text-zinc-500">{stat.label}</p>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Vendas Recentes */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">
          Vendas Recentes ({totalPurchases})
        </h2>
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-opium-purple-900/20">
                  <th className="text-left px-4 py-3 text-zinc-500 font-medium">Usuário</th>
                  <th className="text-left px-4 py-3 text-zinc-500 font-medium">Curso</th>
                  <th className="text-left px-4 py-3 text-zinc-500 font-medium">Valor</th>
                  <th className="text-left px-4 py-3 text-zinc-500 font-medium">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-opium-purple-900/10">
                {recentPurchases.map((p: any) => (
                  <tr key={p.id} className="hover:bg-opium-dark/30">
                    <td className="px-4 py-2.5">{p.user?.name || p.user?.email}</td>
                    <td className="px-4 py-2.5 text-zinc-400">{p.course?.title}</td>
                    <td className="px-4 py-2.5 text-green-400 font-medium">
                      R$ {p.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-zinc-500">
                      {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Doações */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">
          Doações ({totalDonationsCount})
        </h2>
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-opium-purple-900/20">
                  <th className="text-left px-4 py-3 text-zinc-500 font-medium">Nome</th>
                  <th className="text-left px-4 py-3 text-zinc-500 font-medium">Valor</th>
                  <th className="text-left px-4 py-3 text-zinc-500 font-medium">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-opium-purple-900/10">
                {recentDonations.map((d: any) => (
                  <tr key={d.id} className="hover:bg-opium-dark/30">
                    <td className="px-4 py-2.5">{d.name || 'Anônimo'}</td>
                    <td className="px-4 py-2.5 text-pink-400 font-medium">
                      R$ {d.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-zinc-500">
                      {new Date(d.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Comissões de Indicação */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Comissões de Indicação</h2>
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-opium-purple-900/20">
                  <th className="text-left px-4 py-3 text-zinc-500 font-medium">Indicador</th>
                  <th className="text-left px-4 py-3 text-zinc-500 font-medium">Indicado</th>
                  <th className="text-left px-4 py-3 text-zinc-500 font-medium">Comissão</th>
                  <th className="text-left px-4 py-3 text-zinc-500 font-medium">Pago</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-opium-purple-900/10">
                {referralStats.map((r: any) => (
                  <tr key={r.id} className="hover:bg-opium-dark/30">
                    <td className="px-4 py-2.5">{r.referrer?.name || r.referrer?.role}</td>
                    <td className="px-4 py-2.5 text-zinc-400">{r.purchase?.user?.name || '—'}</td>
                    <td className="px-4 py-2.5 text-yellow-400 font-medium">
                      R$ {r.commission.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5">
                      {r.paidOut ? (
                        <span className="text-xs text-green-400">✓ Sim</span>
                      ) : (
                        <span className="text-xs text-zinc-500">Pendente</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}