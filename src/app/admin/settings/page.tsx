import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { SettingsPanel } from '@/components/admin/SettingsPanel'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || (session.user.role !== 'FUNDADOR' && session.user.role !== 'ADM')) {
    redirect('/')
  }

  const isFundador = session.user.role === 'FUNDADOR'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-2">Configurações</h1>
      <p className="text-zinc-400 mb-8">
        Gerencie as configurações da plataforma.
        {!isFundador && (
          <span className="block text-xs text-yellow-500 mt-1">
            ⚠ A chave Pix só pode ser alterada por Fundadores.
          </span>
        )}
      </p>

      <SettingsPanel isFundador={isFundador} />
    </div>
  )
}