import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { FinanceDashboard } from '@/components/admin/FinanceDashboard'

export default async function FinancePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || (session.user.role !== 'FUNDADOR' && session.user.role !== 'ADM')) {
    redirect('/')
  }

  const [purchases, donations, referrals] = await Promise.all([
    prisma.purchase.findMany({
      where: { status: 'PAID' },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true, level: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.donation.findMany({
      where: { status: 'PAID' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.referral.findMany({
      where: { paidOut: true },
      include: {
        referrer: { select: { name: true, role: true } },
        purchase: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
    }),
  ])

  const totalRevenue = purchases.reduce((acc, p) => acc + p.amount, 0)
  const totalDonations = donations.reduce((acc, d) => acc + d.amount, 0)
  const totalCommissions = referrals.reduce((acc, r) => acc + r.commission, 0)
  const netRevenue = totalRevenue - totalCommissions

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-2">Financeiro</h1>
      <p className="text-zinc-400 mb-8">
        Visão geral de receitas, doações e comissões.
      </p>

      <FinanceDashboard
        totalRevenue={totalRevenue}
        totalDonations={totalDonations}
        totalCommissions={totalCommissions}
        netRevenue={netRevenue}
        totalPurchases={purchases.length}
        totalDonationsCount={donations.length}
        recentPurchases={purchases.slice(0, 20)}
        recentDonations={donations.slice(0, 10)}
        referralStats={referrals}
      />
    </div>
  )
}