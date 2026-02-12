import { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify'

type Handler<T extends RouteGenericInterface = RouteGenericInterface> = (
    request: FastifyRequest<T>,
    reply: FastifyReply,
) => Promise<unknown> | unknown

const buckets = new Map<string, { count: number; first: number }>()

export function rateLimitWrapper<T extends RouteGenericInterface = RouteGenericInterface>(max: number, windowMs: number) {
    return (handler: Handler<T>) => {
        return async (request: FastifyRequest<T>, reply: FastifyReply) => {
            try {
                const ip = (request.ip as string) || (request.raw.socket.remoteAddress as string) || 'unknown'
                const route = request.url || 'unknown'
                const key = `${ip}:${route}`
                const now = Date.now()
                const entry = buckets.get(key) ?? { count: 0, first: now }
                if (now - entry.first > windowMs) {
                    entry.count = 0
                    entry.first = now
                }
                entry.count += 1
                buckets.set(key, entry)
                if (entry.count > max) {
                    reply.status(429).send({ message: 'Too many requests' })
                    return
                }
                return await handler(request, reply)
            } catch (err) {
                // On unexpected error in limiter, allow the request to proceed to avoid denying service
                return await handler(request, reply)
            }
        }
    }
}
