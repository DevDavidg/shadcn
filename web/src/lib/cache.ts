import { unstable_cache } from 'next/cache'

export const createCache = <T extends unknown[], R>(
  fn: (..._args: T) => Promise<R>, // eslint-disable-line no-unused-vars
  keyParts: string[],
  options?: {
    revalidate?: number | false
    tags?: string[]
  }
) => {
  return unstable_cache(fn, keyParts, {
    revalidate: options?.revalidate ?? 3600,
    tags: options?.tags ?? []
  })
}

export const revalidateTag = async (tag: string) => {
  const { revalidateTag: nextRevalidateTag } = await import('next/cache')
  return nextRevalidateTag(tag)
}

export const revalidatePath = async (path: string) => {
  const { revalidatePath: nextRevalidatePath } = await import('next/cache')
  return nextRevalidatePath(path)
}
