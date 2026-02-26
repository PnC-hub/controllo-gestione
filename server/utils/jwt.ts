import { SignJWT, jwtVerify } from 'jose'

interface JwtPayload {
  userId: number
  email: string
  role: string
}

export async function signToken(payload: JwtPayload): Promise<string> {
  const secret = getJwtSecret()
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  const secret = getJwtSecret()
  const { payload } = await jwtVerify(token, secret)
  return {
    userId: payload.userId as number,
    email: payload.email as string,
    role: payload.role as string
  }
}

function getJwtSecret(): Uint8Array {
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    throw new Error('JWT_SECRET non configurato')
  }
  return new TextEncoder().encode(jwtSecret)
}
