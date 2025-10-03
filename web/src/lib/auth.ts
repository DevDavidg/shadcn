import { NextRequest } from 'next/server'
import { z } from 'zod'

export const authSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  role: z.enum(['user', 'admin']).default('user')
})

export type AuthUser = z.infer<typeof authSchema>

export const getAuthUser = async (
  request: NextRequest
): Promise<AuthUser | null> => {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return null
    }

    const response = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: request.headers.get('cookie') || ''
        }
      }
    )

    if (!response.ok) {
      return null
    }

    const userData = await response.json()
    return authSchema.parse(userData)
  } catch {
    return null
  }
}

export const requireAuth = async (request: NextRequest): Promise<AuthUser> => {
  const user = await getAuthUser(request)

  if (!user) {
    throw new Error('Authentication required')
  }

  return user
}

export const requireRole = async (
  request: NextRequest,
  requiredRole: AuthUser['role']
): Promise<AuthUser> => {
  const user = await requireAuth(request)

  if (user.role !== requiredRole && user.role !== 'admin') {
    throw new Error('Insufficient permissions')
  }

  return user
}

export const createAuthResponse = (user: AuthUser, _token: string) => {
  // eslint-disable-line no-unused-vars
  const response = Response.json({ user })

  // Note: In a real implementation, you would set cookies in the middleware or route handler
  // This is a placeholder for the cookie setting logic

  return response
}

export const clearAuthResponse = () => {
  const response = Response.json({ success: true })

  // Note: In a real implementation, you would clear cookies in the middleware or route handler
  // This is a placeholder for the cookie clearing logic

  return response
}
