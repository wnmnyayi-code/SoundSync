import { Server as NetServer } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as SocketIOServer } from 'socket.io'
import * as mediasoup from 'mediasoup'
import { Worker, Router, Transport, Producer, Consumer } from 'mediasoup/node/lib/types'

export const config = {
    api: {
        bodyParser: false,
    },
}

// Global variables to maintain state across hot reloads (in dev)
// In production, this should be handled more robustly or with a separate signaling server
let worker: Worker
const routers = new Map<string, Router>()
const transports = new Map<string, Transport>()
const producers = new Map<string, Producer>()
const consumers = new Map<string, Consumer>()

const initWorker = async () => {
    if (worker) return worker
    worker = await mediasoup.createWorker({
        rtcMinPort: 10000,
        rtcMaxPort: 10100,
        logLevel: 'warn',
    })

    worker.on('died', () => {
        console.error('mediasoup worker died, exiting in 2 seconds... [pid:%d]', worker.pid)
        setTimeout(() => process.exit(1), 2000)
    })

    return worker
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!(res.socket as any).server.io) {
        console.log('Initializing Socket.io')
        const httpServer: NetServer = (res.socket as any).server
        const io = new SocketIOServer(httpServer, {
            path: '/api/socket',
            addTrailingSlash: false,
        })

        await initWorker()

        io.on('connection', (socket) => {
            console.log('New client connected:', socket.id)

            socket.on('join-session', async ({ sessionId }, callback) => {
                socket.join(sessionId)

                // Create router for session if not exists
                if (!routers.has(sessionId)) {
                    const mediaCodecs: mediasoup.types.RtpCodecCapability[] = [
                        {
                            kind: 'audio',
                            mimeType: 'audio/opus',
                            clockRate: 48000,
                            channels: 2
                        }
                    ]
                    const router = await worker.createRouter({ mediaCodecs })
                    routers.set(sessionId, router)
                }

                callback?.({ success: true })
            })

            socket.on('getRouterRtpCapabilities', async ({ sessionId }, callback) => {
                const router = routers.get(sessionId)
                if (router) {
                    callback(router.rtpCapabilities)
                } else {
                    callback(null)
                }
            })

            socket.on('createWebRtcTransport', async ({ sessionId, consuming }, callback) => {
                const router = routers.get(sessionId)
                if (!router) return callback({ error: 'Router not found' })

                try {
                    const transport = await router.createWebRtcTransport({
                        listenIps: [{ ip: '0.0.0.0', announcedIp: '127.0.0.1' }], // TODO: Use env var for announced IP
                        enableUdp: true,
                        enableTcp: true,
                        preferUdp: true,
                    })

                    transports.set(transport.id, transport)

                    callback({
                        id: transport.id,
                        iceParameters: transport.iceParameters,
                        iceCandidates: transport.iceCandidates,
                        dtlsParameters: transport.dtlsParameters,
                    })
                } catch (error) {
                    console.error('createWebRtcTransport error:', error)
                    callback({ error: 'Failed to create transport' })
                }
            })

            socket.on('connectWebRtcTransport', async ({ transportId, dtlsParameters }, callback) => {
                const transport = transports.get(transportId)
                if (transport) {
                    await transport.connect({ dtlsParameters })
                    callback()
                }
            })

            socket.on('produce', async ({ transportId, kind, rtpParameters, sessionId }, callback) => {
                const transport = transports.get(transportId)
                if (!transport) return callback({ error: 'Transport not found' })

                try {
                    const producer = await transport.produce({ kind, rtpParameters })
                    producers.set(producer.id, producer)

                    // Broadcast to room
                    socket.to(sessionId).emit('newProducer', { producerId: producer.id })

                    producer.on('transportclose', () => {
                        producers.delete(producer.id)
                    })

                    callback({ id: producer.id })
                } catch (error) {
                    console.error('produce error:', error)
                    callback({ error: 'Failed to produce' })
                }
            })

            socket.on('consume', async ({ sessionId, transportId, producerId, rtpCapabilities }, callback) => {
                const router = routers.get(sessionId)
                if (!router) return callback({ error: 'Router not found' })

                if (!router.canConsume({ producerId, rtpCapabilities })) {
                    return callback({ error: 'Cannot consume' })
                }

                const transport = transports.get(transportId)
                if (!transport) return callback({ error: 'Transport not found' })

                try {
                    const consumer = await transport.consume({
                        producerId,
                        rtpCapabilities,
                        paused: true, // Start paused
                    })

                    consumers.set(consumer.id, consumer)

                    consumer.on('transportclose', () => {
                        consumers.delete(consumer.id)
                    })

                    consumer.on('producerclose', () => {
                        consumers.delete(consumer.id)
                        socket.emit('consumerClosed', { consumerId: consumer.id })
                    })

                    callback({
                        id: consumer.id,
                        producerId,
                        kind: consumer.kind,
                        rtpParameters: consumer.rtpParameters,
                    })

                    // Resume immediately for now
                    await consumer.resume()

                } catch (error) {
                    console.error('consume error:', error)
                    callback({ error: 'Failed to consume' })
                }
            })
        })

            ; (res.socket as any).server.io = io
    }
    res.end()
}
