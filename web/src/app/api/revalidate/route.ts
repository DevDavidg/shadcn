import { NextRequest } from 'next/server'
import { revalidateTag, revalidatePath } from '@/lib/cache'
import { createApiResponse, createApiError } from '@/lib/fetch'
import { z } from 'zod'

const revalidateSchema = z.object({
  tag: z.string().optional(),
  path: z.string().optional(),
  secret: z.string()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tag, path, secret } = revalidateSchema.parse(body)

    if (secret !== process.env.REVALIDATE_SECRET) {
      return createApiError('Invalid secret', 401)
    }

    if (tag) {
      await revalidateTag(tag)
      return createApiResponse({ revalidated: true, tag })
    }

    if (path) {
      await revalidatePath(path)
      return createApiResponse({ revalidated: true, path })
    }

    return createApiError('Either tag or path must be provided', 400)
  } catch (error) {
    console.error('Revalidation error:', error)
    return createApiError('Failed to revalidate', 500)
  }
}
