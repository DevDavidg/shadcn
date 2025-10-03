import { z } from 'zod'
import { env } from './env'

type FetchOptions = RequestInit & {
  timeout?: number
  retries?: number
  tags?: string[]
}

class FetchError extends Error {
  constructor(
    message: string,
    public status: number, // eslint-disable-line no-unused-vars
    public statusText: string // eslint-disable-line no-unused-vars
  ) {
    super(message)
    this.name = 'FetchError'
  }
}

const fetchWithTimeout = async (
  url: string,
  options: FetchOptions = {}
): Promise<Response> => {
  const { timeout: timeoutMs = 10000, retries = 3, ...fetchOptions } = options

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new FetchError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response.statusText
        )
      }

      return response
    } catch (error) {
      if (attempt === retries) {
        throw error
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
    }
  }

  throw new Error('Max retries exceeded')
}

export const api = {
  get: async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${env.NEXT_PUBLIC_APP_URL}/api${endpoint}`

    const response = await fetchWithTimeout(url, {
      ...options,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    return response.json()
  },

  post: async <T>(
    endpoint: string,
    data?: unknown,
    options: FetchOptions = {}
  ): Promise<T> => {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${env.NEXT_PUBLIC_APP_URL}/api${endpoint}`

    const response = await fetchWithTimeout(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: data ? JSON.stringify(data) : undefined
    })

    return response.json()
  },

  put: async <T>(
    endpoint: string,
    data?: unknown,
    options: FetchOptions = {}
  ): Promise<T> => {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${env.NEXT_PUBLIC_APP_URL}/api${endpoint}`

    const response = await fetchWithTimeout(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: data ? JSON.stringify(data) : undefined
    })

    return response.json()
  },

  delete: async <T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> => {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${env.NEXT_PUBLIC_APP_URL}/api${endpoint}`

    const response = await fetchWithTimeout(url, {
      ...options,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    return response.json()
  }
}

export const createApiResponse = <T>(data: T, status = 200) => {
  return Response.json(data, { status })
}

export const createApiError = (message: string, status = 400) => {
  return Response.json({ error: message }, { status })
}

export const validateRequest = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T => {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Validation error: ${error.errors.map((e) => e.message).join(', ')}`
      )
    }
    throw error
  }
}
