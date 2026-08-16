'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { HiMenu, HiX } from 'react-icons/hi'
import { FaDiscord, FaWhatsapp } from 'react-icons/fa'
import { Role } from '@prisma/client'
import { ROLE_LABELS, hasPermission } from '@/lib/roles'

export function Header() {
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Início' },
    { href: '/courses', label: 'Cursos' },
  ]

  // Links dinâmicos por cargo
  const roleLinks = []
  if (session?.user?.role === 'FUNDADOR' || session?.user?.role === 'ADM') {
    roleLinks.push({ href: '/admin/moderation', label: 'Moderação' })
    roleLinks.push({ href: '/admin/courses', label: 'Gerenciar Cursos' })
    roleLinks.push({ href: '/chat', label: 'Chat' })
  }
  if (session?.user?.role === 'FUNDADOR') {
    roleLinks.push({ href: '/admin/finance', label: 'Finanças' })
    roleLinks.push({ href: '/admin/roles', label: 'Cargos' })
  }
  if (session?.user?.role === 'COLABORADOR') {
    roleLinks.push({ href: '/dashboard/upload', label: 'Enviar Vídeo' })
    roleLinks.push({ href: '/chat', label: 'Chat' })
  }
  if (session?.user?.role === 'ALUNO') {
    roleLinks.push({ href: '/courses/my', label: 'Meus Cursos' })
  }

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-opium-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-opium-purple-500 to-opium-purple-800 flex items-center justify-center font-bold text-lg glow-purple-sm group-hover:glow-purple transition-all">
              O
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-opium-purple-300 to-white bg-clip-text text-transparent">
              Opium
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-opium-purple-600/10 transition-all"
              >
                {link.label}
              </Link>
            ))}
            {roleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-opium-purple-300 hover:text-white hover:bg-opium-purple-600/10 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Social links */}
            <a
              href="https://opiumstory.centralcart.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-opium-purple-300 transition-colors text-sm"
            >
              Loja
            </a>
            <a
              href="https://chat.whatsapp.com/L5HJVcKuqOJA0cf7CFsN9"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-green-400 transition-colors"
            >
              <FaWhatsapp size={18} />
            </a>
            <a
              href="https://discord.gg/qJde8KDv8"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-indigo-400 transition-colors"
            >
              <FaDiscord size={18} />
            </a>

            {/* Auth */}
            {status === 'authenticated' ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt=""
                      className="w-7 h-7 rounded-full ring-2 ring-opium-purple-600/50"
                    />
                  )}
                  <div className="text-sm">
                    <span className="text-zinc-300">{session.user?.name}</span>
                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-opium-purple-600/20 text-opium-purple-300">
                      {ROLE_LABELS[(session.user?.role ?? 'ALUNO') as Role] || 'Aluno'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="btn-primary text-sm py-1.5 px-4"
              >
                Entrar
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white"
          >
            {mobileMenuOpen ? <HiX size={22} /> : <HiMenu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden animate-fade-in py-4 border-t border-opium-purple-900/30">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-opium-purple-600/10"
                >
                  {link.label}
                </Link>
              ))}
              {roleLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-opium-purple-300 hover:text-white hover:bg-opium-purple-600/10"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-opium-purple-900/20">
              <a href="https://opiumstory.centralcart.ai/" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-400 hover:text-opium-purple-300">Loja</a>
              <a href="https://chat.whatsapp.com/L5HJVcKuqOJA0cf7CFsN9" target="_blank" rel="noopener noreferrer" className="text-green-400"><FaWhatsapp size={18} /></a>
              <a href="https://discord.gg/qJde8KDv8" target="_blank" rel="noopener noreferrer" className="text-indigo-400"><FaDiscord size={18} /></a>
            </div>
            <div className="mt-4 pt-4 border-t border-opium-purple-900/20">
              {status === 'authenticated' ? (
                <button onClick={() => signOut()} className="text-sm text-zinc-500 hover:text-red-400">Sair da conta</button>
              ) : (
                <button onClick={() => signIn()} className="btn-primary text-sm w-full">Entrar</button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}