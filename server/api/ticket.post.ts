import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate required fields
  if (!body.tipo || !body.descrizione) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tipo e descrizione sono obbligatori'
    })
  }

  // Build ticket object
  const ticket = {
    id: `TKT-${Date.now()}`,
    app: body.app || 'Unknown',
    tipo: body.tipo,
    pagina: body.pagina || '/',
    descrizione: body.descrizione,
    urgenza: body.urgenza || 'media',
    email: body.email || null,
    userAgent: body.userAgent || null,
    url: body.url || null,
    timestamp: body.timestamp || new Date().toISOString(),
    status: 'nuovo'
  }

  // Log ticket (in production, save to DB or send to Slack)
  console.log('[TICKET]', JSON.stringify(ticket, null, 2))

  // Try to send to Slack webhook if configured
  const slackWebhook = process.env.SLACK_WEBHOOK_URL
  if (slackWebhook) {
    try {
      const urgenzaEmoji = {
        bassa: ':white_circle:',
        media: ':large_yellow_circle:',
        alta: ':red_circle:'
      }[ticket.urgenza] || ':white_circle:'

      const tipoEmoji = {
        bug: ':bug:',
        caricamento: ':hourglass_flowing_sand:',
        dati: ':floppy_disk:',
        altro: ':question:'
      }[ticket.tipo] || ':memo:'

      await $fetch(slackWebhook, {
        method: 'POST',
        body: {
          text: `${urgenzaEmoji} *Nuovo Ticket* ${tipoEmoji}`,
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: `${tipoEmoji} Ticket: ${ticket.tipo.toUpperCase()}`,
                emoji: true
              }
            },
            {
              type: 'section',
              fields: [
                { type: 'mrkdwn', text: `*App:*\n${ticket.app}` },
                { type: 'mrkdwn', text: `*Urgenza:*\n${urgenzaEmoji} ${ticket.urgenza}` },
                { type: 'mrkdwn', text: `*Pagina:*\n${ticket.pagina}` },
                { type: 'mrkdwn', text: `*ID:*\n${ticket.id}` }
              ]
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Descrizione:*\n${ticket.descrizione}`
              }
            },
            ...(ticket.email ? [{
              type: 'context',
              elements: [
                { type: 'mrkdwn', text: `:email: ${ticket.email}` }
              ]
            }] : [])
          ]
        }
      })
    } catch (slackError) {
      console.error('[TICKET] Slack notification failed:', slackError)
      // Continue anyway - ticket is logged
    }
  }

  return {
    success: true,
    ticketId: ticket.id,
    message: 'Ticket creato con successo'
  }
})
