import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { env } from '@/lib/env';

type RouteHandler = (req: Request, ...args: any[]) => Promise<NextResponse>;

export function requireRole(role: string) {
  return (handler: RouteHandler) => {
    return async (req: Request, ...args: any[]) => {
      try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
          return NextResponse.json({ success: false, error: 'Unauthorized: Missing token' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];

        if (!env.JWT_SECRET) {
          console.error('JWT_SECRET is not defined');
          return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
        }

        const decoded = jwt.verify(token, env.JWT_SECRET) as any;

        // Check if user has the required role or is an ADMIN
        // We assume decoded.roles is an array of strings
        const userRoles = decoded.roles || [];
        if (!userRoles.includes(role) && !userRoles.includes('ADMIN')) {
          return NextResponse.json({ success: false, error: `Access denied: Requires role ${role}` }, { status: 403 });
        }

        // If authorized, proceed to the actual handler
        return handler(req, ...args);
      } catch (err) {
        console.error('Middleware auth error:', err);
        return NextResponse.json({ success: false, error: 'Unauthorized: Invalid token' }, { status: 401 });
      }
    }
  }
}
