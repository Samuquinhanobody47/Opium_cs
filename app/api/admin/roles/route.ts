import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  // Apenas Fundador pode alterar cargos
  if (!session?.user?.id || session.user.role !== 'FUNDADOR') {
    return NextResponse.json({ message: 'Apenas o Fundador pode alterar cargos' }, { status: 403 })
  }

  const { userId, role } = await req.json() as { userId: string; role: string }
  if (!userId || !role) {
    return NextResponse.json({ message: 'userId e role obrigatórios' }, { status: 400 })
  }

  const validRoles = ['FUNDADOR', 'ADM', 'COLABORADOR']
  if (!validRoles.includes(role)) {
    return NextResponse.json({ message: 'Cargo inválido' }, { status: 400 })
  }

  // Não pode rebaixar a si mesmo
  if (userId === session.user.id) {
    return NextResponse.json({ message: 'Você não pode alterar seu próprio cargo' }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: role as any },
  })

  return NextResponse.json({ message: 'Cargo atualizado com sucesso' })
}