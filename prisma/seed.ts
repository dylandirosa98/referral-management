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

  // Create sample partners
  const partner1 = await prisma.partner.upsert({
    where: { email: 'john@hvacpro.com' },
    update: {},
    create: {
      companyName: 'HVAC Pro Solutions',
      contactName: 'John Martinez',
      email: 'john@hvacpro.com',
      phone: '(555) 123-4567',
      businessType: 'hvac',
      address: {
        street: '123 Business Ave',
        city: 'Dallas',
        state: 'TX',
        zip: '75201'
      },
      serviceAreas: ['Dallas', 'Fort Worth', 'Plano'],
      tier: 'gold',
      commissionRate: 7,
      referralCount: 18,
      totalCommissionEarned: 12500,
      status: 'active',
      portalSlug: 'hvac-pro-solutions',
      notes: 'Top performing partner with excellent quality referrals'
    }
  })

  const partner2 = await prisma.partner.upsert({
    where: { email: 'sarah@solarenergy.com' },
    update: {},
    create: {
      companyName: 'Solar Energy Inc',
      contactName: 'Sarah Chen',
      email: 'sarah@solarenergy.com',
      phone: '(555) 234-5678',
      businessType: 'solar',
      address: {
        street: '456 Green St',
        city: 'Austin',
        state: 'TX',
        zip: '78701'
      },
      serviceAreas: ['Austin', 'San Antonio', 'Houston'],
      tier: 'silver',
      commissionRate: 6,
      referralCount: 8,
      totalCommissionEarned: 4800,
      status: 'active',
      portalSlug: 'solar-energy-inc',
      notes: 'Growing partnership with focus on residential solar projects'
    }
  })

  // Create sample referrals
  const referral1 = await prisma.referral.create({
    data: {
      partnerId: partner1.id,
      customerName: 'John Smith',
      customerEmail: 'john.smith@email.com',
      customerPhone: '(555) 987-6543',
      customerAddress: {
        street: '789 Homeowner Ln',
        city: 'Dallas',
        state: 'TX',
        zip: '75202'
      },
      projectType: 'full_replacement',
      roofType: 'asphalt_shingle',
      estimatedValue: 8500,
      urgency: 'normal',
      description: 'Full roof replacement needed due to storm damage',
      status: 'quoted',
      commissionPct: 7,
      commissionDue: 0,
      notes: 'Customer interested in premium materials'
    }
  })

  const referral2 = await prisma.referral.create({
    data: {
      partnerId: partner2.id,
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.j@email.com',
      customerPhone: '(555) 456-7890',
      customerAddress: {
        street: '321 Solar Ave',
        city: 'Austin',
        state: 'TX',
        zip: '78702'
      },
      projectType: 'repair',
      roofType: 'metal',
      estimatedValue: 3200,
      urgency: 'high',
      description: 'Roof preparation needed for solar panel installation',
      status: 'new',
      commissionPct: 6,
      commissionDue: 0,
      notes: 'Time sensitive - solar installation scheduled next month'
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log(`📋 Created system settings`)
  console.log(`👥 Created ${2} partners`)
  console.log(`📄 Created ${2} referrals`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 