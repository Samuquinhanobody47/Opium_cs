import Link from 'next/link'
import { FaGraduationCap, FaStar, FaCrown, FaGem, FaHeart } from 'react-icons/fa'
import { HiArrowRight } from 'react-icons/hi'

const COURSE_LEVELS = [
  {
    level: 'Básico',
    price: 9.99,
    icon: FaGraduationCap,
    color: 'from-zinc-600 to-zinc-800',
    border: 'border-zinc-600/30',
    glow: 'hover:shadow-zinc-500/20',
    description: 'Acesse os fundamentos da edição e comece sua jornada.',
    features: ['Módulos básicos', 'Acesso vitalício', 'Suporte por chat'],
  },
  {
    level: 'Bom',
    price: 19.99,
    icon: FaStar,
    color: 'from-blue-600 to-blue-900',
    border: 'border-blue-500/30',
    glow: 'hover:shadow-blue-500/20',
    description: 'Conteúdo intermediário com técnicas profissionais.',
    features: ['Todos do Básico', 'Módulos intermediários', 'Projetos práticos'],
  },
  {
    level: 'Completo',
    price: 39.99,
    icon: FaCrown,
    color: 'from-opium-purple-600 to-opium-purple-900',
    border: 'border-opium-purple-500/30',
    glow: 'hover:shadow-opium-purple-500/30',
    description: 'Acesso total ao conteúdo avançado + bônus exclusivos.',
    features: ['Todos do Bom', 'Módulos avançados', 'Bônus exclusivos', 'Certificado'],
    popular: true,
  },
  {
    level: 'VIP',
    price: 58.00,
    icon: FaGem,
    color: 'from-yellow-500 to-amber-800',
    border: 'border-yellow-500/30',
    glow: 'hover:shadow-yellow-500/20',
    description: 'Acesso VIP completo + mentoria + atualizações vitalícias.',
    features: ['Todos do Completo', 'Mentoria exclusiva', 'Updates vitalícios', 'Sala VIP no Discord', 'Suporte prioritário'],
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-opium-glow" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-opium-purple-300 via-white to-opium-purple-300 bg-clip-text text-transparent">
                Opium
              </span>
              <br />
              <span className="text-2xl sm:text-4xl lg:text-5xl text-zinc-300 font-light mt-2 block">
                Cursos de Edição
              </span>
            </h1>
            <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
              Domine a edição profissional com cursos completos e acesso vitalício.
              Aprenda do zero ao avançado com a nossa equipe especializada.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/courses" className="btn-primary text-base px-8 py-3 flex items-center gap-2">
                Ver Cursos <HiArrowRight />
              </Link>
              <Link href="/login" className="btn-secondary text-base px-8 py-3">
                Criar Conta Grátis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Course Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Escolha seu{' '}
            <span className="bg-gradient-to-r from-opium-purple-400 to-opium-purple-200 bg-clip-text text-transparent">
              nível
            </span>
          </h2>
          <p className="mt-3 text-zinc-500">Todos os planos incluem acesso vitalício permanente</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COURSE_LEVELS.map((course) => (
            <div
              key={course.level}
              className={`relative glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-opacity-50 ${course.border} ${course.glow}`}
            >
              {course.popular && (
                <div className="absolute top-3 right-3 bg-opium-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse-glow">
                  POPULAR
                </div>
              )}

              <div className="p-6">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center mb-4`}>
                  <course.icon className="text-white" size={22} />
                </div>

                {/* Level & Price */}
                <h3 className="text-xl font-bold text-white">Nível {course.level}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-sm text-zinc-400">R$</span>
                  <span className="text-3xl font-black text-white">
                    {course.price.toFixed(2).split('.')[0]}
                  </span>
                  <span className="text-lg text-zinc-400">
                    ,{course.price.toFixed(2).split('.')[1]}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-3 text-sm text-zinc-400">{course.description}</p>

                {/* Features */}
                <ul className="mt-4 space-y-2">
                  {course.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-opium-purple-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={`/checkout?level=${course.level}`}
                  className="mt-6 w-full btn-primary flex items-center justify-center gap-2 text-sm"
                >
                  Comprar Agora <HiArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Donation Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-card rounded-2xl p-8 text-center border-pink-500/20">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-rose-700 flex items-center justify-center mx-auto mb-4">
            <FaHeart className="text-white" size={22} />
          </div>
          <h3 className="text-2xl font-bold">Apoie a Opium</h3>
          <p className="mt-2 text-zinc-400 text-sm">
            Faça uma doação de qualquer valor para nos ajudar a continuar produzindo conteúdo de qualidade.
          </p>
          <form action="/api/donations/create" method="POST" className="mt-6 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
            <div className="relative flex-1 w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">R$</span>
              <input
                type="number"
                name="amount"
                min="0.10"
                step="0.01"
                placeholder="0,10"
                required
                className="input-dark pl-9"
              />
            </div>
            <button type="submit" className="btn-primary whitespace-nowrap">
              Doar <FaHeart size={12} className="ml-1" />
            </button>
          </form>
          <p className="mt-3 text-xs text-zinc-600">Valor mínimo: R$ 0,10</p>
        </div>
      </section>

      {/* Stats / Trust */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '500+', label: 'Alunos' },
            { value: '50+', label: 'Aulas' },
            { value: '4.9★', label: 'Avaliação' },
            { value: '∞', label: 'Acesso Vitalício' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-5 text-center">
              <div className="text-2xl font-black bg-gradient-to-r from-opium-purple-300 to-white bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-zinc-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}