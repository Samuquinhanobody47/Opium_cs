import Link from 'next/link'
import { FaDiscord, FaWhatsapp } from 'react-icons/fa'

export function Footer() {
  return (
    <footer className="border-t border-opium-purple-900/30 bg-opium-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-opium-purple-500 to-opium-purple-800 flex items-center justify-center font-bold">
                O
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-opium-purple-300 to-white bg-clip-text text-transparent">
                Opium
              </span>
            </div>
            <p className="text-sm text-zinc-500">
              Cursos de edição profissional com acesso vitalício.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-3">Links</h4>
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-zinc-500 hover:text-opium-purple-300 transition-colors"
              >
                Início
              </Link>
              <Link
                href="/courses"
                className="text-sm text-zinc-500 hover:text-opium-purple-300 transition-colors"
              >
                Cursos
              </Link>
              <a
                href="https://opiumstory.centralcart.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-500 hover:text-opium-purple-300 transition-colors"
              >
                Nossa Loja
              </a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-3">Comunidade</h4>
            <div className="flex flex-col gap-2.5">
              <a
                href="https://chat.whatsapp.com/L5HJVcKuqOJA0cf7CFsN9"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-zinc-500 hover:text-green-400 transition-colors"
              >
                <FaWhatsapp size={16} />
                Grupo do WhatsApp
              </a>
              <a
                href="https://discord.gg/qJde8KDv8"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-zinc-500 hover:text-indigo-400 transition-colors"
              >
                <FaDiscord size={16} />
                Servidor Discord
              </a>
              <a
                href="https://opiumstory.centralcart.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-500 hover:text-opium-purple-300 transition-colors"
              >
                Opium Store
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-opium-purple-900/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Opium. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://opiumstory.centralcart.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-600 hover:text-opium-purple-400 transition-colors"
            >
              Loja
            </a>
            <a
              href="https://chat.whatsapp.com/L5HJVcKuqOJA0cf7CFsN9"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-600 hover:text-green-400 transition-colors"
            >
              WhatsApp
            </a>
            <a
              href="https://discord.gg/qJde8KDv8"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-600 hover:text-indigo-400 transition-colors"
            >
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}