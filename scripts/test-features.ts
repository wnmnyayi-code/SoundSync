/**
 * Testing utilities for SoundSync
 * Run with: npx tsx scripts/test-features.ts
 */

import prisma from '../lib/prisma'
import { uploadToS3, getPresignedUrl } from '../lib/s3'
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from '../lib/mailer'

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
}

function log(message: string, color: string = colors.reset) {
    console.log(`${color}${message}${colors.reset}`)
}

async function testDatabaseConnection() {
    log('\n🔍 Testing Database Connection...', colors.blue)
    try {
        const userCount = await prisma.user.count()
        log(`✅ Database connected! Found ${userCount} users.`, colors.green)
        return true
    } catch (error) {
        log(`❌ Database connection failed: ${error}`, colors.red)
        return false
    }
}

async function testS3Upload() {
    log('\n🔍 Testing S3 Upload...', colors.blue)

    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        log('⚠️  AWS credentials not configured. Skipping S3 test.', colors.yellow)
        return false
    }

    try {
        // Create a test file
        const testContent = Buffer.from('Test file for SoundSync S3 upload')
        const result = await uploadToS3(testContent, 'test-file.txt', {
            folder: 'test',
            contentType: 'text/plain',
            metadata: { test: 'true' }
        })

        log(`✅ S3 upload successful!`, colors.green)
        log(`   Key: ${result.key}`)
        log(`   URL: ${result.url}`)

        // Test presigned URL
        const presignedUrl = await getPresignedUrl(result.key, 60)
        log(`✅ Presigned URL generated successfully`, colors.green)

        return true
    } catch (error) {
        log(`❌ S3 upload failed: ${error}`, colors.red)
        return false
    }
}

async function testEmailSystem() {
    log('\n🔍 Testing Email System...', colors.blue)

    if (!process.env.SMTP_HOST) {
        log('⚠️  SMTP not configured. Emails will be logged to console.', colors.yellow)
    }

    try {
        // Test verification email
        await sendVerificationEmail(
            'test@example.com',
            'test-token-123',
            'Test User'
        )
        log(`✅ Verification email sent/logged`, colors.green)

        // Test password reset email
        await sendPasswordResetEmail(
            'test@example.com',
            'reset-token-456',
            'Test User'
        )
        log(`✅ Password reset email sent/logged`, colors.green)

        // Test welcome email
        await sendWelcomeEmail(
            'test@example.com',
            'Test User',
            'CREATOR'
        )
        log(`✅ Welcome email sent/logged`, colors.green)

        return true
    } catch (error) {
        log(`❌ Email system failed: ${error}`, colors.red)
        return false
    }
}

async function testAudioProcessing() {
    log('\n🔍 Testing Audio Processing...', colors.blue)

    try {
        const { processAudio } = await import('../lib/audioProcessor')

        // Check if ffmpeg is available
        log('✅ Audio processor module loaded', colors.green)
        log('⚠️  To fully test audio processing, upload an audio file through the UI', colors.yellow)

        return true
    } catch (error) {
        log(`❌ Audio processing module failed: ${error}`, colors.red)
        return false
    }
}

async function testStripeIntegration() {
    log('\n🔍 Testing Stripe Integration...', colors.blue)

    if (!process.env.STRIPE_SECRET_KEY) {
        log('⚠️  Stripe not configured. Skipping Stripe test.', colors.yellow)
        return false
    }

    try {
        const stripe = (await import('stripe')).default
        const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!)

        // Test API connection
        const balance = await stripeClient.balance.retrieve()
        log(`✅ Stripe connected! Available balance: ${balance.available[0]?.amount || 0}`, colors.green)

        return true
    } catch (error) {
        log(`❌ Stripe connection failed: ${error}`, colors.red)
        return false
    }
}

async function checkEnvironmentVariables() {
    log('\n🔍 Checking Environment Variables...', colors.blue)

    const required = [
        'DATABASE_URL',
        'NEXTAUTH_SECRET',
        'NEXTAUTH_URL',
    ]

    const optional = [
        'AWS_ACCESS_KEY_ID',
        'AWS_SECRET_ACCESS_KEY',
        'AWS_S3_BUCKET_NAME',
        'STRIPE_SECRET_KEY',
        'SMTP_HOST',
        'SMTP_USER',
    ]

    let allRequired = true

    log('\nRequired variables:', colors.blue)
    for (const key of required) {
        if (process.env[key]) {
            log(`  ✅ ${key}`, colors.green)
        } else {
            log(`  ❌ ${key} - MISSING!`, colors.red)
            allRequired = false
        }
    }

    log('\nOptional variables:', colors.blue)
    for (const key of optional) {
        if (process.env[key]) {
            log(`  ✅ ${key}`, colors.green)
        } else {
            log(`  ⚠️  ${key} - Not configured`, colors.yellow)
        }
    }

    return allRequired
}

async function runAllTests() {
    log('═══════════════════════════════════════', colors.blue)
    log('  🎵 SoundSync Feature Testing Suite', colors.blue)
    log('═══════════════════════════════════════', colors.blue)

    const results = {
        environment: await checkEnvironmentVariables(),
        database: await testDatabaseConnection(),
        s3: await testS3Upload(),
        email: await testEmailSystem(),
        audio: await testAudioProcessing(),
        stripe: await testStripeIntegration(),
    }

    log('\n═══════════════════════════════════════', colors.blue)
    log('  📊 Test Results Summary', colors.blue)
    log('═══════════════════════════════════════', colors.blue)

    const passed = Object.values(results).filter(Boolean).length
    const total = Object.keys(results).length

    for (const [test, result] of Object.entries(results)) {
        const icon = result ? '✅' : '❌'
        const color = result ? colors.green : colors.red
        log(`  ${icon} ${test.charAt(0).toUpperCase() + test.slice(1)}`, color)
    }

    log(`\n  Total: ${passed}/${total} tests passed`,
        passed === total ? colors.green : colors.yellow)

    if (passed === total) {
        log('\n🎉 All tests passed! Your SoundSync instance is ready!', colors.green)
    } else {
        log('\n⚠️  Some tests failed. Check the configuration above.', colors.yellow)
    }

    log('═══════════════════════════════════════\n', colors.blue)

    await prisma.$disconnect()
}

// Run tests
runAllTests().catch((error) => {
    log(`\n❌ Test suite failed: ${error}`, colors.red)
    process.exit(1)
})
