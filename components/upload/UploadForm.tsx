'use client'

import { useState } from 'react'

type Course = {
  id: string
  title: string
  modules: {
    id: string
    title: string
    order: number
    lessons: { id: string; title: string }[]
  }[]
}

export function UploadForm({ courses }: { courses: Course[] }) {
  const [courseId, setCourseId] = useState('')
  const [moduleId, setModuleId] = useState('')
  const [lessonId, setLessonId] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [duration, setDuration] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const selectedCourse = courses.find((c) => c.id === courseId)
  const selectedModule = selectedCourse?.modules.find((m) => m.id === moduleId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!courseId || !lessonId || !title || !url) {
      setError('Preencha todos os campos obrigatórios')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/videos/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          title,
          url,
          duration: duration ? parseInt(duration) : null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Erro ao enviar vídeo')
        return
      }

      setSuccess('Vídeo enviado com sucesso! Aguardando aprovação.')
      setTitle('')
      setUrl('')
      setDuration('')
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-5">
      {/* Selecionar Curso */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">
          Curso *
        </label>
        <select
          value={courseId}
          onChange={(e) => {
            setCourseId(e.target.value)
            setModuleId('')
            setLessonId('')
          }}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-opium-purple"
        >
          <option value="">Selecione um curso...</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>

      {/* Selecionar Módulo */}
      {selectedCourse && (
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Módulo *
          </label>
          <select
            value={moduleId}
            onChange={(e) => {
              setModuleId(e.target.value)
              setLessonId('')
            }}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-opium-purple"
          >
            <option value="">Selecione um módulo...</option>
            {selectedCourse.modules.map((m) => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>
        </div>
      )}

      {/* Selecionar Aula */}
      {selectedModule && (
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Aula *
          </label>
          <select
            value={lessonId}
            onChange={(e) => setLessonId(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-opium-purple"
          >
            <option value="">Selecione uma aula...</option>
            {selectedModule.lessons.map((l) => (
              <option key={l.id} value={l.id}>{l.title}</option>
            ))}
          </select>
        </div>
      )}

      {/* Título do Vídeo */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">
          Título do Vídeo *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Introdução ao módulo"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-opium-purple"
        />
      </div>

      {/* URL do Vídeo */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">
          URL do Vídeo *
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-opium-purple"
        />
        <p className="text-xs text-zinc-600 mt-1">Cole a URL do vídeo (YouTube, Vimeo, etc.)</p>
      </div>

      {/* Duração (opcional) */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">
          Duração (segundos) — opcional
        </label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Ex: 300"
          min={0}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-opium-purple"
        />
      </div>

      {/* Feedback */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-sm text-green-300">
          {success}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !lessonId || !title || !url}
        className="w-full bg-opium-purple hover:bg-opium-purple-dark text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {loading ? 'Enviando...' : 'Enviar Vídeo'}
      </button>
    </form>
  )
}