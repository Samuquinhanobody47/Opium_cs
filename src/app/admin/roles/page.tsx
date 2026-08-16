import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { RoleManager } from '@/components/admin/RoleManager'

export default async function RolesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'FUNDADOR') {
    redirect('/')
  }

  const usersRaw = await prisma.user.findMany({
    where: { role: { not: 'ALUNO' } },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
    },
    orderBy: [
      { role: 'asc' },
      { name: 'asc' },
    ],
  })

  const users = JSON.parse(JSON.stringify(usersRaw))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-2">Gestão de Cargos</h1>
      <p className="text-zinc-400 mb-8">
        Apenas o Fundador pode alterar cargos da equipe.
      </p>

      <RoleManager users={users} />
    </div>
  )
}