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
        const socketIo = io({ path: '/api/socket' })
        setSocket(socketIo)

        socketIo.on('connect', async () => {
            // Initialize mediasoup device
            const mediasoupDevice = new Device()

            // Get router RTP capabilities
            socketIo.emit('getRouterRtpCapabilities', { sessionId: params.sessionId }, async (rtpCapabilities: any) => {
                if (!rtpCapabilities) {
                    console.error("No RTP capabilities")
                    return
                }

                await mediasoupDevice.load({ routerRtpCapabilities: rtpCapabilities })
                setDevice(mediasoupDevice)

                // Create transport for producing
                socketIo.emit('createWebRtcTransport', { sessionId: params.sessionId, consuming: false }, async (transportParams: any) => {
                    if (transportParams.error) {
                        console.error(transportParams.error)
                        return
                    }

                    const producerTransport = mediasoupDevice.createSendTransport(transportParams)

                    producerTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
                        socketIo.emit('connectWebRtcTransport', { transportId: producerTransport.id, dtlsParameters }, () => callback())
                    })

                    producerTransport.on('produce', ({ kind, rtpParameters }, callback, errback) => {
                        socketIo.emit('produce', {
                            transportId: producerTransport.id,
                            kind,
                            rtpParameters,
                            sessionId: params.sessionId
                        }, ({ id }: any) => {
                            callback({ id })
                        })
                    })

                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                    if (videoRef.current) videoRef.current.srcObject = stream

                    const producer = await producerTransport.produce({
                        track: stream.getAudioTracks()[0],
                        codecOptions: { opusStereo: true },
                    })
                })
            })
        })

        return () => {
            socketIo.disconnect()
        }
    }, [params.sessionId])

    return (
        <div className="min-h-screen bg-dark-900 p-8">
            <h1 className="text-white text-2xl font-bold">Live Session Host</h1>
            <video ref={videoRef} autoPlay muted className="hidden" />
            <p className="text-gray-400 mt-4">Streaming to fans...</p>
        </div>
    )
}
