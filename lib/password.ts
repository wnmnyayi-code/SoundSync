import bcrypt from 'bcrypt'

export async function hashPassword(password: string) {
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12)
  return bcrypt.hash(password, saltRounds)
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

// Alias for comparePassword
export const verifyPassword = comparePassword
