import { NextResponse } from 'next/server'
import type { ApiResponse } from '@/types/api'

export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public isOperational = true
    ) {
        super(message)
        Object.setPrototypeOf(this, AppError.prototype)
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(400, message)
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(401, message)
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(403, message)
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(404, message)
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(409, message)
    }
}

export class RateLimitError extends AppError {
    constructor(message = 'Too many requests') {
        super(429, message)
    }
}

/**
 * Global error handler for API routes
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse<never>> {
    console.error('API Error:', error)

    // Handle known AppError instances
    if (error instanceof AppError) {
        return NextResponse.json(
            {
                success: false,
                error: error.message,
            },
            { status: error.statusCode }
        )
    }

    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
        const prismaError = error as { code: string; meta?: any }

        switch (prismaError.code) {
            case 'P2002':
                return NextResponse.json(
                    {
                        success: false,
                        error: 'A record with this value already exists',
                    },
                    { status: 409 }
                )
            case 'P2025':
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Record not found',
                    },
                    { status: 404 }
                )
            case 'P2003':
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Foreign key constraint failed',
                    },
                    { status: 400 }
                )
            default:
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Database error occurred',
                    },
                    { status: 500 }
                )
        }
    }

    // Handle validation errors (Zod, etc.)
    if (error && typeof error === 'object' && 'issues' in error) {
        return NextResponse.json(
            {
                success: false,
                error: 'Validation failed',
            },
            { status: 400 }
        )
    }

    // Default error response
    return NextResponse.json(
        {
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error',
        },
        { status: 500 }
    )
}

/**
 * Async error wrapper for API routes
 */
export function asyncHandler<T>(
    handler: (req: Request, context?: any) => Promise<NextResponse<ApiResponse<T>>>
) {
    return async (req: Request, context?: any): Promise<NextResponse<ApiResponse<T>>> => {
        try {
            return await handler(req, context)
        } catch (error) {
            return handleApiError(error) as NextResponse<ApiResponse<T>>
        }
    }
}

/**
 * Log error to external service (e.g., Sentry)
 */
export function logError(error: Error, context?: Record<string, any>) {
    // TODO: Integrate with Sentry or similar service
    console.error('Error logged:', {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
    })
}
