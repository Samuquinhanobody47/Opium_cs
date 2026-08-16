import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET — Retorna todas as configurações (ADM+)
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || (session.user.role !== 'FUNDADOR' && session.user.role !== 'ADM')) {
    return NextResponse.json({ message: 'Sem permissão' }, { status: 403 })
  }

  const settings = await prisma.settings.findMany({
    orderBy: { key: 'asc' },
  })

  // Retorna como objeto key→value para facilitar uso no frontend
  const result: Record<string, { value: string; description: string | null }> = {}
  for (const s of settings) {
    result[s.key] = { value: s.value, description: s.description }
  }

  return NextResponse.json(result)
}

// PUT — Atualiza configurações (ADM+; Pix key apenas FUNDADOR)
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || (session.user.role !== 'FUNDADOR' && session.user.role !== 'ADM')) {
    return NextResponse.json({ message: 'Sem permissão' }, { status: 403 })
  }

  const body = await req.json() as Record<string, string>

  const updates: { key: string; value: string }[] = []

  for (const [key, value] of Object.entries(body)) {
    // Apenas FUNDADOR pode alterar a chave Pix
    if (key === 'PIX_KEY' && session.user.role !== 'FUNDADOR') {
      return NextResponse.json(
        { message: 'Apenas Fundadores podem alterar a chave Pix' },
        { status: 403 }
      )
    }

    // Upsert: cria se não existe, atualiza se existe
    await prisma.settings.upsert({
      where: { key },
      update: { value },
      create: {
        key,
        value,
        description: key === 'PIX_KEY' ? 'Chave Pix para recebimentos' : null,
      },
    })

    updates.push({ key, value })
  }

  return NextResponse.json({
    message: 'Configurações atualizadas',
    updated: updates,
  })
}
