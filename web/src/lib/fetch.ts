export const createApiResponse = <T>(data: T, status = 200) => {
  return Response.json(data, { status })
}

export const createApiError = (message: string, status = 400) => {
  return Response.json({ error: message }, { status })
}
