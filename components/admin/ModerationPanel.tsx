'use client'

import { useState } from 'react'
import { HiCheck, HiX, HiPlay, HiEye, HiClock } from 'react-icons/hi'
import toast from 'react-hot-toast'

type VideoWithUploader = {
  id: string
  title: string
  url: string
  thumbnail: string | null
  duration: number | null
  status: string
  createdAt: string  // serialized ISO string
  reviewedAt: string | null
  uploader: { id: string; name: string | null; role: string }
  lesson: { id: string; title: string } | null
}

interface Props {
  videos: VideoWithUploader[]
  isPending: boolean
}

export function ModerationPanel({ videos, isPending }: Props) {
  const [videoList, setVideoList] = useState(videos)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleAction = async (videoId: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch(`/api/admin/moderation/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || 'Erro ao processar')
        return
      }

      toast.success(
        action === 'approve' ? 'Vídeo aprovado!' : 'Vídeo rejeitado'
      )

      if (isPending) {
        setVideoList((prev) => prev.filter((v) => v.id !== videoId))
      } else {
        setVideoList((prev) =>
          prev.map((v) =>
            v.id === videoId
              ? { ...v, status: action === 'approve' ? 'APPROVED' : 'REJECTED' }
              : v
          )
        )
      }
    } catch {
      toast.error('Erro ao processar')
    }
  }

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-500/20 text-yellow-400',
      APPROVED: 'bg-green-500/20 text-green-400',
      REJECTED: 'bg-red-500/20 text-red-400',
    }
    const labels: Record<string, string> = {
      PENDING: 'Pendente',
      APPROVED: 'Aprovado',
      REJECTED: 'Rejeitado',
    }
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${colors[status] || 'bg-zinc-700 text-zinc-400'}`}>
        {labels[status] || status}
      </span>
    )
  }

  if (videoList.length === 0) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <p className="text-zinc-500">
          {isPending ? 'Nenhum vídeo pendente 🎉' : 'Nenhum vídeo no histórico'}
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Preview Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <video controls autoPlay className="w-full rounded-xl">
              <source src={previewUrl} type="video/mp4" />
            </video>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {videoList.map((video) => (
          <div
            key={video.id}
            className="glass-card rounded-xl p-4 flex items-center gap-4"
          >
            {/* Thumbnail / Preview */}
            <div
              className="relative w-24 h-16 bg-opium-dark rounded-lg overflow-hidden cursor-pointer flex-shrink-0"
              onClick={() => setPreviewUrl(video.url)}
            >
              {video.thumbnail ? (
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <HiPlay className="text-zinc-600" size={24} />
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <HiEye className="text-white" size={20} />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{video.title}</p>
              <p className="text-xs text-zinc-500">
                Enviado por {video.uploader.name || video.uploader.role} •{' '}
                {new Date(video.createdAt).toLocaleDateString('pt-BR')}
              </p>
              {video.lesson && (
                <p className="text-xs text-zinc-600">
                  Aula: {video.lesson.title}
                </p>
              )}
            </div>

            {/* Status */}
            {statusBadge(video.status)}

            {/* Actions */}
            {isPending && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(video.id, 'approve')}
                  className="p-2 bg-green-500/20 rounded-lg hover:bg-green-500/30 transition-colors"
                  title="Aprovar"
                >
                  <HiCheck className="text-green-400" size={18} />
                </button>
                <button
                  onClick={() => handleAction(video.id, 'reject')}
                  className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                  title="Rejeitar"
                >
                  <HiX className="text-red-400" size={18} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}