import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Get admin credentials from environment variables
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@soundsync.co.za'
  const adminPassword = process.env.ADMIN_PASSWORD || 'SoundSync@Admin2025!'
  const adminName = process.env.ADMIN_NAME || 'SoundSync Administrator'

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (existingAdmin) {
    console.log('✅ Admin account already exists:', adminEmail)
    console.log('📧 Email:', adminEmail)
    console.log('👤 Artist Name:', existingAdmin.artistName || adminName)
    console.log('🎭 Role:', existingAdmin.role)
    console.log('🪙 Coin Balance:', existingAdmin.coinBalance)
    return
  }

  // Hash the admin password
  const hashedPassword = bcrypt.hashSync(adminPassword, 10)

  // Create the admin user with full privileges
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN', // Set role to ADMIN
      artistName: 'SoundSync Official',
      coinBalance: 10000, // Give admin 10,000 coins
      verificationStatus: 'APPROVED', // Auto-approve admin
    },
  })

  console.log('✅ Admin account created successfully!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📧 Email:', adminEmail)
  console.log('🔑 Password:', adminPassword)
  console.log('👤 Artist Name:', admin.artistName || adminName)
  console.log('🎭 Role:', admin.role)
  console.log('🪙 Coin Balance:', admin.coinBalance)
  console.log('✅ Verification Status:', admin.verificationStatus)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('⚠️  IMPORTANT: Change the admin password after first login!')
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })