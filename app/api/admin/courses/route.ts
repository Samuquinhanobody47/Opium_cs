import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// Criar curso
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || (session.user.role !== 'FUNDADOR' && session.user.role !== 'ADM')) {
    return NextResponse.json({ message: 'Sem permissão' }, { status: 403 })
  }

  const body = await req.json() as {
    title: string
    description: string
    level: string
    price: number
  }

  if (!body.title) {
    return NextResponse.json({ message: 'Título obrigatório' }, { status: 400 })
  }

  const course = await prisma.course.create({
    data: {
      title: body.title,
      description: body.description || '',
      level: body.level as any,
      price: body.price,
    },
  })

  return NextResponse.json({ course })
}

// Excluir curso
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || (session.user.role !== 'FUNDADOR' && session.user.role !== 'ADM')) {
    return NextResponse.json({ message: 'Sem permissão' }, { status: 403 })
  }

  const { courseId } = await req.json() as { courseId: string }
  if (!courseId) {
    return NextResponse.json({ message: 'courseId obrigatório' }, { status: 400 })
  }

  await prisma.course.delete({ where: { id: courseId } })
  return NextResponse.json({ message: 'Curso excluído' })
}