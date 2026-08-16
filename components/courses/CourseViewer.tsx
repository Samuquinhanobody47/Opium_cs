'use client'

import { useState } from 'react'
import { HiPlay, HiClock, HiCheckCircle } from 'react-icons/hi'

type LessonWithVideo = {
  id: string
  title: string
  order: number
  video: {
    id: string
    title: string
    url: string
    thumbnail: string | null
    duration: number | null
    status: string
  } | null
}

type ModuleWithLessons = {
  id: string
  title: string
  order: number
  lessons: LessonWithVideo[]
}

type CourseData = {
  id: string
  title: string
  modules: ModuleWithLessons[]
}

interface Props {
  course: CourseData
  userId: string
}

export function CourseViewer({ course, userId }: Props) {
  const [activeLesson, setActiveLesson] = useState<LessonWithVideo | null>(
    course.modules[0]?.lessons[0] || null
  )
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '--:--'
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const markCompleted = (lessonId: string) => {
    setCompletedLessons((prev) => {
      const next = new Set(prev)
      next.add(lessonId)
      return next
    })
  }

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0)
  const progress = totalLessons > 0 ? Math.round((completedLessons.size / totalLessons) * 100) : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Video Player */}
      <div className="lg:col-span-2">
        {activeLesson?.video ? (
          <div className="glass-card rounded-2xl overflow-hidden">
            {/* Player */}
            <div className="video-container bg-black">
              <video
                key={activeLesson.video.url}
                controls
                className="w-full"
                poster={activeLesson.video.thumbnail || undefined}
                onEnded={() => markCompleted(activeLesson.id)}
              >
                <source src={activeLesson.video.url} type="video/mp4" />
                Seu navegador não suporta vídeo HTML5.
              </video>
            </div>

            {/* Lesson Info */}
            <div className="p-5">
              <h2 className="text-lg font-bold">{activeLesson.title}</h2>
              {activeLesson.video.duration && (
                <div className="flex items-center gap-1.5 text-sm text-zinc-500 mt-1">
                  <HiClock size={14} />
                  {formatDuration(activeLesson.video.duration)}
                </div>
              )}
              <button
                onClick={() => markCompleted(activeLesson.id)}
                className="mt-3 text-sm text-opium-purple-400 hover:text-opium-purple-300 flex items-center gap-1.5"
              >
                <HiCheckCircle size={16} />
                Marcar como concluída
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-20 text-center">
            <HiPlay className="text-zinc-600 mx-auto" size={48} />
            <p className="text-zinc-500 mt-3">Selecione uma aula para começar</p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mt-4 glass-card rounded-xl p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Progresso</span>
            <span className="font-semibold text-opium-purple-300">{progress}%</span>
          </div>
          <div className="mt-2 h-2 bg-opium-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-opium-purple-600 to-opium-purple-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-zinc-600">
            {completedLessons.size} de {totalLessons} aulas concluídas
          </p>
        </div>
      </div>

      {/* Sidebar — Module List */}
      <div className="lg:col-span-1 space-y-4 max-h-[80vh] overflow-y-auto pr-1">
        {course.modules.map((module) => (
          <div key={module.id} className="glass-card rounded-xl overflow-hidden">
            <div className="bg-opium-purple-900/40 px-4 py-3">
              <h3 className="font-semibold text-sm">{module.title}</h3>
              <span className="text-xs text-zinc-500">{module.lessons.length} aulas</span>
            </div>
            <div className="divide-y divide-opium-purple-900/20">
              {module.lessons.map((lesson) => {
                const isActive = activeLesson?.id === lesson.id
                const isCompleted = completedLessons.has(lesson.id)

                return (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLesson(lesson)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      isActive
                        ? 'bg-opium-purple-600/20 border-l-2 border-opium-purple-400'
                        : 'hover:bg-opium-purple-900/10'
                    }`}
                  >
                    {/* Status icon */}
                    {isCompleted ? (
                      <HiCheckCircle className="text-green-400 shrink-0" size={18} />
                    ) : isActive ? (
                      <HiPlay className="text-opium-purple-400 shrink-0" size={18} />
                    ) : (
                      <div className="w-4.5 h-4.5 rounded-full border border-zinc-600 shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${isActive ? 'text-white font-medium' : 'text-zinc-400'}`}>
                        {lesson.title}
                      </p>
                      {lesson.video?.duration && (
                        <span className="text-xs text-zinc-600">
                          {formatDuration(lesson.video.duration)}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}