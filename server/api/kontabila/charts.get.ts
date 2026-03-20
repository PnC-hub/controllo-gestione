import { getKontabilaToken, kontabilaFetch } from '~/server/utils/kontabila'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const entityId = query.entityId ? `?entityId=${query.entityId}` : ''

  const token = await getKontabilaToken()
  const res = await kontabilaFetch(`/api/dashboard/charts${entityId}`, token)

  if (!res.ok) {
    throw createError({ statusCode: res.status, message: 'Kontabila charts error' })
  }

  return res.json()
})
