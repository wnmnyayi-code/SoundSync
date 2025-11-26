const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Manually load .env file to verify content on disk
const envPath = path.join(__dirname, '..', '.env');

console.log('🔍 DIAGNOSTIC START');
console.log('-------------------');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env file NOT found at:', envPath);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = envContent.match(/DATABASE_URL=["']?([^"'\n]+)["']?/);

if (!dbUrlMatch) {
  console.error('❌ DATABASE_URL not found in .env file!');
} else {
  const dbUrl = dbUrlMatch[1];
  console.log('✅ Found DATABASE_URL in .env');
  
  // Mask password for display
  const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');
  console.log('   Value:', maskedUrl);

  if (dbUrl.includes('localhost')) {
    console.error('❌ ERROR: DATABASE_URL is still pointing to localhost!');
    console.error('   Please update .env with your Supabase connection string.');
  } else if (dbUrl.includes('supabase.co')) {
    console.log('✅ URL points to Supabase');
  }
}

console.log('\n🔄 Testing Connection...');
const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Successfully connected to database!');
    
    const userCount = await prisma.user.count();
    console.log(`✅ Database query successful (User count: ${userCount})`);
    
  } catch (error) {
    console.error('❌ Connection FAILED:');
    console.error(error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
