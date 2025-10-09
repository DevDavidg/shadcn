export const revalidateTag = async (tag: string) => {
  const { revalidateTag: nextRevalidateTag } = await import('next/cache')
  return nextRevalidateTag(tag)
}

export const revalidatePath = async (path: string) => {
  const { revalidatePath: nextRevalidatePath } = await import('next/cache')
  return nextRevalidatePath(path)
}
