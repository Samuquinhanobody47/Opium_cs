'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { HiPlus, HiPencil, HiTrash, HiChevronDown, HiChevronUp } from 'react-icons/hi'

type CourseData = {
  id: string
  title: string
  description: string | null
  level: string
  price: number
  modules: { id: string; lessons: { id: string }[] }[]
  _count: { purchases: number }
}

interface Props {
  courses: CourseData[]
}

export function CourseManager({ courses: initialCourses }: Props) {
  const [courses, setCourses] = useState(initialCourses)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', level: 'BASICO', price: 9.99 })

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || 'Erro ao criar curso')
        return
      }

      toast.success('Curso criado com sucesso!')
      setCourses((prev) => [...prev, data.course])
      setShowForm(false)
      setForm({ title: '', description: '', level: 'BASICO', price: 9.99 })
    } catch {
      toast.error('Erro ao criar curso')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este curso?')) return

    try {
      const res = await fetch('/api/admin/courses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: id }),
      })

      if (!res.ok) {
        toast.error('Erro ao excluir curso')
        return
      }

      toast.success('Curso excluído')
      setCourses((prev) => prev.filter((c) => c.id !== id))
    } catch {
      toast.error('Erro ao excluir curso')
    }
  }

  const levelLabels: Record<string, string> = {
    BASICO: 'Básico',
    BOM: 'Bom',
    COMPLETO: 'Completo',
    VIP: 'VIP',
  }

  const levelPrices: Record<string, number> = {
    BASICO: 9.99,
    BOM: 19.99,
    COMPLETO: 39.99,
    VIP: 58.0,
  }

  return (
    <div>
      {/* Botão Criar */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="btn-primary flex items-center gap-2 mb-6"
      >
        {showForm ? <HiChevronUp size={18} /> : <HiPlus size={18} />}
        {showForm ? 'Fechar' : 'Novo Curso'}
      </button>

      {/* Formulário */}
      {showForm && (
        <div className="glass-card rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Criar Curso</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Título</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-dark"
                placeholder="Ex: Edição Avançada"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Nível</label>
              <select
                value={form.level}
                onChange={(e) =>
                  setForm({
                    ...form,
                    level: e.target.value,
                    price: levelPrices[e.target.value] || 9.99,
                  })
                }
                className="input-dark appearance-none cursor-pointer"
              >
                <option value="BASICO">Básico — R$ 9,99</option>
                <option value="BOM">Bom — R$ 19,99</option>
                <option value="COMPLETO">Completo — R$ 39,99</option>
                <option value="VIP">VIP — R$ 58,00</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-zinc-400 mb-1">Descrição</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-dark min-h-[80px]"
                placeholder="Descrição do curso..."
              />
            </div>
          </div>
          <button onClick={handleCreate} className="mt-4 btn-primary text-sm">
            Criar Curso
          </button>
        </div>
      )}

      {/* Lista de Cursos */}
      <div className="space-y-3">
        {courses.map((course) => (
          <div key={course.id} className="glass-card rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{course.title}</h3>
                <p className="text-sm text-zinc-500 mt-0.5">{course.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="bg-opium-purple-900/40 px-2 py-0.5 rounded-full text-opium-purple-300">
                    {levelLabels[course.level] || course.level}
                  </span>
                  <span className="text-zinc-500">
                    R$ {course.price.toFixed(2)}
                  </span>
                  <span className="text-zinc-600">
                    {course.modules.length} módulos
                  </span>
                  <span className="text-green-400/70">
                    {course._count.purchases} vendas
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(course.id)}
                className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
                title="Excluir"
              >
                <HiTrash size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}