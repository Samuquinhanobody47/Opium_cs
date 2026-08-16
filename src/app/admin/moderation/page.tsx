import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { ModerationPanel } from '@/components/admin/ModerationPanel'

export default async function ModerationPage() {
  const session = await getServerSession(authOptions)

  if (
    !session?.user ||
    (session.user.role !== 'FUNDADOR' && session.user.role !== 'ADM')
  ) {
    redirect('/')
  }

  const pendingVideos = await prisma.video.findMany({
    where: { status: 'PENDING' },
    include: {
      uploader: { select: { id: true, name: true, role: true } },
      lesson: {
        select: { id: true, title: true, module: { select: { courseId: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const allVideos = await prisma.video.findMany({
    where: { status: { not: 'PENDING' } },
    include: {
      uploader: { select: { id: true, name: true, role: true } },
      lesson: {
        select: { id: true, title: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
    take: 50,
  })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-2">Moderação de Vídeos</h1>
      <p className="text-zinc-400 mb-8">
        Revise e aprove os vídeos enviados pelos colaboradores.
      </p>

      {/* Vídeos Pendentes */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          Pendentes ({pendingVideos.length})
        </h2>
        <ModerationPanel videos={JSON.parse(JSON.stringify(pendingVideos)) as any} isPending />
      </section>

      {/* Histórico */}
      <section>
        <h2 className="text-lg font-semibold text-zinc-400 mb-4">
          Histórico Recente ({allVideos.length})
        </h2>
        <ModerationPanel videos={JSON.parse(JSON.stringify(allVideos)) as any} isPending={false} />
      </section>
    </div>
  )
}