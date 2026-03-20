import { getKontabilaToken, kontabilaFetch } from '~/server/utils/kontabila'

export default defineEventHandler(async () => {
  const token = await getKontabilaToken()
  const res = await kontabilaFetch('/api/entities', token)

  if (!res.ok) {
    throw createError({ statusCode: res.status, message: 'Kontabila entities error' })
  }

  const data = await res.json()
  return data
})
