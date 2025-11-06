import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.create({
    data: {
      email: 'admin@soundsync.co.za',
      password: bcrypt.hashSync('admin123', 10),
      role: 'ADMIN',
    }
  })
}

main()