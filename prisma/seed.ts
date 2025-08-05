import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create system settings
  const systemSettings = await prisma.systemSettings.upsert({
    where: { id: 'system-settings-1' },
    update: {},
    create: {
      id: 'system-settings-1',
      commissionTiers: [
        { tier: 'bronze', min_referrals: 0, commission_pct: 5, name: 'Bronze Partner' },
        { tier: 'silver', min_referrals: 5, commission_pct: 6, name: 'Silver Partner' },
        { tier: 'gold', min_referrals: 15, commission_pct: 7, name: 'Gold Partner' }
      ],
      emailTemplates: {
        welcome: {
          subject: 'Welcome to Our Partner Program!',
          body: 'Welcome {{partner_name}}! Your account has been created.'
        },
        status_update: {
          subject: 'Referral Status Update - {{customer_name}}',
          body: 'Hi {{partner_name}}, your referral for {{customer_name}} has been updated.'
        }
      },
      notificationSettings: {
        email_notifications: true,
        partner_status_updates: true,
        tier_upgrades: true
      }
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log(`📋 Created system settings`)
  console.log(`👥 No fake partners created - partners should be created through the admin dashboard`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 