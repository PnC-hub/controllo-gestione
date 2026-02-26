import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database Profitera...')

  // Crea utente admin
  const adminPassword = await bcrypt.hash('Profitera2026!', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@profitera.it' },
    update: {},
    create: {
      email: 'admin@profitera.it',
      passwordHash: adminPassword,
      nome: 'Admin',
      cognome: 'Profitera',
      ruolo: 'admin',
      isActive: true,
      twoFactorEnabled: false // Admin iniziale senza 2FA per primo accesso
    }
  })

  console.log(`✅ Admin creato: ${admin.email} (id: ${admin.id})`)

  // Crea utente direzione (Piero)
  const pieroPassword = await bcrypt.hash('Civeropiernatale.1', 12)
  const piero = await prisma.user.upsert({
    where: { email: 'direzione@smiledoc.it' },
    update: {},
    create: {
      email: 'direzione@smiledoc.it',
      passwordHash: pieroPassword,
      nome: 'Piero',
      cognome: 'Civero',
      ruolo: 'admin',
      isActive: true,
      twoFactorEnabled: true
    }
  })

  console.log(`✅ Utente creato: ${piero.email} (id: ${piero.id})`)

  console.log('🎉 Seed completato!')
}

main()
  .catch((e) => {
    console.error('❌ Errore seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
