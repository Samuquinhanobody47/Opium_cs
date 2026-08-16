import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { hasPermission } from '@/lib/roles'

const adminNav = [
  { href: '/admin/moderation', label: 'Moderação', icon: '🎬', minRole: 'ADM' as const },
  { href: '/admin/courses', label: 'Cursos', icon: '📚', minRole: 'ADM' as const },
  { href: '/admin/finance', label: 'Financeiro', icon: '💰', minRole: 'ADM' as const },
  { href: '/admin/settings', label: 'Configurações', icon: '⚙️', minRole: 'ADM' as const },
  { href: '/admin/roles', label: 'Cargos', icon: '👤', minRole: 'FUNDADOR' as const },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  if (session.user.role === 'ALUNO') {
    redirect('/courses')
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-zinc-950 border-r border-zinc-800 p-4 hidden lg:block">
        <div className="mb-6">
          <Link href="/" className="text-lg font-bold text-opium-purple">
            ◈ Opium
          </Link>
          <p className="text-xs text-zinc-600 mt-0.5">Painel Administrativo</p>
        </div>

        <nav className="space-y-1">
          {adminNav
            .filter((item) => {
              if (item.minRole === 'FUNDADOR') return session.user.role === 'FUNDADOR'
              return hasPermission(session.user.role as any, item.minRole)
            })
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-all"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))
          }

          {/* Links extras */}
          <div className="pt-4 mt-4 border-t border-zinc-800">
            <Link
              href="/dashboard/upload"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-all"
            >
              <span>📤</span>
              <span>Upload de Vídeo</span>
            </Link>
            <Link
              href="/chat"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-all"
            >
              <span>💬</span>
              <span>Chat Interno</span>
            </Link>
          </div>

          <div className="pt-4 mt-4 border-t border-zinc-800">
            <Link
              href="/courses"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-all"
            >
              <span>🏠</span>
              <span>Voltar ao Site</span>
            </Link>
          </div>
        </nav>

        {/* User Info */}
        <div className="mt-auto pt-6 border-t border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-opium-purple/30 flex items-center justify-center overflow-hidden">
              {session.user.image ? (
                <img src={session.user.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-opium-purple">
                  {(session.user.name || 'U').charAt(0)}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-300 truncate">
                {session.user.name || 'Usuário'}
              </p>
              <p className="text-[10px] text-zinc-600">
                {session.user.role}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 z-50 px-2 py-1">
        <div className="flex items-center justify-around">
          {adminNav
            .filter((item) => {
              if (item.minRole === 'FUNDADOR') return session.user.role === 'FUNDADOR'
              return hasPermission(session.user.role as any, item.minRole)
            })
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 py-1 px-2 text-[10px] text-zinc-500"
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))
          }
          <Link
            href="/chat"
            className="flex flex-col items-center gap-0.5 py-1 px-2 text-[10px] text-zinc-500"
          >
            <span className="text-base">💬</span>
            <span>Chat</span>
          </Link>
        </div>
      </div>

      {/* Conteúdo */}
      <main className="flex-1 p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}