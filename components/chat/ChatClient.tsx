'use client'

import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

type Message = {
  id: string
  content: string
  room: string
  createdAt: string
  sender: {
    id: string
    name: string
    role: string
    image: string | null
  }
}

const roleColors: Record<string, string> = {
  FUNDADOR: 'text-red-400',
  ADM: 'text-amber-400',
  COLABORADOR: 'text-blue-400',
}

const roleBadges: Record<string, string> = {
  FUNDADOR: 'bg-red-500/20 text-red-300 border border-red-500/30',
  ADM: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  COLABORADOR: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
}

const roomEmojis: Record<string, string> = {
  geral: '💬',
  colaboradores: '🎬',
  adms: '🛡️',
  fundadores: '👑',
  'gestao-precos': '💰',
}

const roomLabels: Record<string, string> = {
  geral: 'Geral',
  colaboradores: 'Colaboradores',
  adms: 'ADMs',
  fundadores: 'Fundadores',
  'gestao-precos': 'Gestão & Preços',
}

export function ChatClient({
  userId,
  userName,
  userRole,
  userImage,
  availableRooms,
  initialMessages,
}: {
  userId: string
  userName: string
  userRole: string
  userImage: string | null
  availableRooms: string[]
  initialMessages: Message[]
}) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [activeRoom, setActiveRoom] = useState(availableRooms[0])
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [connected, setConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const newSocket = io({ path: '/api/socketio' })

    newSocket.on('connect', () => {
      setConnected(true)
      newSocket.emit('join', { userId, userName, userRole, room: activeRoom })
    })

    newSocket.on('disconnect', () => setConnected(false))

    newSocket.on('message', (msg: Message) => {
      setMessages((prev) => [...prev, msg])
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [userId])

  useEffect(() => {
    if (!socket || !connected) return
    socket.emit('leave', { room: activeRoom })
    const filtered = messages.filter((m) => m.room !== activeRoom)
    setMessages(filtered)
    // Recarregar mensagens da sala ao trocar
    socket.emit('join', { userId, userName, userRole, room: activeRoom })
    socket.emit('load-history', { room: activeRoom })
  }, [activeRoom, socket, connected])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim() || !socket || !connected) return
    socket.emit('message', {
      room: activeRoom,
      content: input.trim(),
    })
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-240px)] min-h-[400px]">
      {/* Sidebar de Salas */}
      <div className="lg:w-56 shrink-0 bg-zinc-900/80 rounded-2xl border border-zinc-800 p-3">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Salas
        </h2>
        <div className="space-y-1">
          {availableRooms.map((room) => (
            <button
              key={room}
              onClick={() => setActiveRoom(room)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeRoom === room
                  ? 'bg-opium-purple/20 text-opium-purple border border-opium-purple/30'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              <span>{roomEmojis[room] || '💬'}</span>
              <span>{roomLabels[room] || room}</span>
            </button>
          ))
          }
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-xs text-zinc-500">
              {connected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 flex flex-col bg-zinc-900/80 rounded-2xl border border-zinc-800 overflow-hidden">
        {/* Header da sala */}
        <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <span className="text-lg">{roomEmojis[activeRoom] || '💬'}</span>
            <h3 className="font-semibold text-zinc-100">
              {roomLabels[activeRoom] || activeRoom}
            </h3>
          </div>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-zinc-600 py-12">
              <p className="text-4xl mb-2">💬</p>
              <p>Nenhuma mensagem nesta sala ainda.</p>
              <p className="text-sm text-zinc-700 mt-1">Seja o primeiro a falar!</p>
            </div>
          )}
          {messages.map((msg) => {
            const isOwn = msg.sender.id === userId
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className="shrink-0 w-9 h-9 rounded-full bg-opium-purple/30 flex items-center justify-center overflow-hidden">
                  {msg.sender.image ? (
                    <img
                      src={msg.sender.image}
                      alt={msg.sender.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold text-opium-purple">
                      {msg.sender.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Balão */}
                <div className={`max-w-[70%] ${isOwn ? 'text-right' : ''}`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    {!isOwn && (
                      <>
                        <span className={`text-sm font-semibold ${roleColors[msg.sender.role] || 'text-zinc-300'}`}>
                          {msg.sender.name}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${roleBadges[msg.sender.role] || 'bg-zinc-700 text-zinc-400'}`}>
                          {msg.sender.role}
                        </span>
                      </>
                    )}
                    <span className="text-[10px] text-zinc-600">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                  <div
                    className={`inline-block px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words ${
                      isOwn
                        ? 'bg-opium-purple text-white rounded-br-sm'
                        : 'bg-zinc-800 text-zinc-200 rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-900/50">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Mensagem em #${roomLabels[activeRoom] || activeRoom}...`}
              rows={1}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none focus:border-opium-purple transition-colors"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || !connected}
              className="bg-opium-purple hover:bg-opium-purple-dark text-white px-5 py-2.5 rounded-xl font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}