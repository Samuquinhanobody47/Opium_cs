import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { CourseManager } from '@/components/admin/CourseManager'

export default async function CourseManagementPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || (session.user.role !== 'FUNDADOR' && session.user.role !== 'ADM')) {
    redirect('/')
  }

  const courses = await prisma.course.findMany({
    include: {
      modules: {
        include: {
          lessons: { select: { id: true } },
        },
      },
      _count: {
        select: { purchases: { where: { status: 'PAID' } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const stats = {
    totalCourses: courses.length,
    totalPurchases: courses.reduce((acc, c) => acc + c._count.purchases, 0),
    totalRevenue: courses.reduce(
      (acc, c) => acc + c._count.purchases * c.price,
      0
    ),
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Cursos</h1>
          <p className="text-zinc-400 mt-1">
            {stats.totalCourses} cursos • {stats.totalPurchases} vendas • R$ {stats.totalRevenue.toFixed(2)} receita
          </p>
        </div>
      </div>

      <CourseManager courses={courses} />
    </div>
  )
}