import { Server } from 'socket.io'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (res.socket.server.io) {
    res.end()
    return
  }

  const io = new Server(res.socket.server)
  res.socket.server.io = io

  io.on('connection', (socket) => {
    socket.on('join-session', (sessionId: string) => {
      socket.join(sessionId)
    })

    socket.on('produce', (data) => {
      // Broadcast to all fans in session
      socket.to(data.sessionId).emit('new-producer', data)
    })
  })

  res.end()
}