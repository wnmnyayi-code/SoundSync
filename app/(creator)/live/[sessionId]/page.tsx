'use client'
import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { Device } from 'mediasoup-client'

export default function LiveSession({ params }: { params: { sessionId: string } }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [socket, setSocket] = useState<any>(null)
  const [device, setDevice] = useState<Device | null>(null)

  useEffect(() => {
    // Connect to signaling server
    const socketIo = io('/api/socket')
    setSocket(socketIo)

    socketIo.on('connect', async () => {
      // Initialize mediasoup device
      const mediasoupDevice = new Device()
      
      // Get router RTP capabilities
      const res = await fetch(`/api/live/${params.sessionId}/rtp`)
      const { rtpCapabilities } = await res.json()
      
      await mediasoupDevice.load({ routerRtpCapabilities: rtpCapabilities })
      setDevice(mediasoupDevice)

      // Produce audio (from creator's mic or uploaded tracks)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (videoRef.current) videoRef.current.srcObject = stream

      const producer = await mediasoupDevice.createProducer({
        track: stream.getAudioTracks()[0],
        codecOptions: { opusStereo: true },
      })

      socketIo.emit('produce', { producerId: producer.id })
    })

    return () => socketIo.disconnect()
  }, [params.sessionId])

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <h1 className="text-white text-2xl font-bold">Live Session</h1>
      <video ref={videoRef} autoPlay muted className="hidden" />
      <p className="text-gray-400 mt-4">Streaming to fans...</p>
    </div>
  )
}