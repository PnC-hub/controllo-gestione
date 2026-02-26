import crypto from 'crypto'
import { prisma } from './prisma'

export function generateOtpCode(): string {
  return crypto.randomInt(100000, 999999).toString()
}

export async function createOtp(
  userId: number,
  type: 'login_2fa' | 'password_reset'
): Promise<string> {
  // Invalida OTP precedenti non usati dello stesso tipo
  await prisma.otpToken.updateMany({
    where: { userId, type, used: false },
    data: { used: true }
  })

  const code = generateOtpCode()
  const minutes = type === 'login_2fa' ? 10 : 15
  const expiresAt = new Date(Date.now() + minutes * 60 * 1000)

  await prisma.otpToken.create({
    data: { userId, code, type, expiresAt }
  })

  return code
}

export async function verifyOtp(
  userId: number,
  code: string,
  type: 'login_2fa' | 'password_reset'
): Promise<boolean> {
  const otp = await prisma.otpToken.findFirst({
    where: {
      userId,
      code,
      type,
      used: false,
      expiresAt: { gt: new Date() }
    }
  })

  if (!otp) return false

  // Segna come usato
  await prisma.otpToken.update({
    where: { id: otp.id },
    data: { used: true }
  })

  return true
}

export async function getLastOtpTime(
  userId: number,
  type: 'login_2fa' | 'password_reset'
): Promise<Date | null> {
  const lastOtp = await prisma.otpToken.findFirst({
    where: { userId, type },
    orderBy: { createdAt: 'desc' }
  })
  return lastOtp?.createdAt ?? null
}
