import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || (session.user.role !== 'FUNDADOR' && session.user.role !== 'ADM')) {
    return NextResponse.json({ message: 'Sem permissão' }, { status: 403 })
  }

  const { videoId } = await req.json() as { videoId: string }
  if (!videoId) {
    return NextResponse.json({ message: 'videoId obrigatório' }, { status: 400 })
  }

  const video = await prisma.video.findUnique({ where: { id: videoId } })
  if (!video) {
    return NextResponse.json({ message: 'Vídeo não encontrado' }, { status: 404 })
  }

  await prisma.video.update({
    where: { id: videoId },
    data: { status: 'APPROVED', reviewedBy: session.user.id, reviewedAt: new Date() },
  })

  return NextResponse.json({ message: 'Vídeo aprovado com sucesso' })
}