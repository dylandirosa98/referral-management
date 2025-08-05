import { z } from 'zod'

// Partner validation schema
export const partnerSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().or(z.literal('')),
  businessType: z.enum([
    'hvac', 'solar', 'plumbing', 'electrical', 'siding', 'gutters',
    'landscaping', 'general_contractor', 'real_estate', 'insurance_adjuster'  
  ]),
  address: z.object({
    street: z.string().optional().or(z.literal('')),
    city: z.string().optional().or(z.literal('')),
    state: z.string().optional().or(z.literal('')),
    zip: z.string().optional().or(z.literal(''))
  }).optional(),
  serviceAreas: z.array(z.string()).optional().default([]),
  tier: z.enum(['bronze', 'silver', 'gold']).default('bronze'),
  commissionRate: z.number().min(0).max(100).default(5),
  notes: z.string().optional().or(z.literal(''))
})

// Referral validation schema
export const referralSchema = z.object({
  partnerId: z.string().min(1, 'Partner is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  customerPhone: z.string().optional(),
  customerAddress: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional()
  }).optional(),
  projectType: z.enum([
    'full_replacement', 'repair', 'maintenance', 'inspection',
    'emergency', 'gutter_work', 'siding', 'solar_prep'
  ]),
  roofType: z.enum([
    'asphalt_shingle', 'metal', 'tile', 'slate', 'flat', 'cedar_shake', 'other'
  ]).optional(),
  estimatedValue: z.number().min(0).optional(),
  urgency: z.enum(['low', 'normal', 'high', 'emergency']).default('normal'),
  description: z.string().optional(),
  notes: z.string().optional()
})

// Payment validation schema
export const paymentSchema = z.object({
  partner_id: z.string().uuid(),
  referral_ids: z.array(z.string().uuid()),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  payment_method: z.enum(['check', 'ach', 'stripe', 'manual']).default('check'),
  scheduled_date: z.string().optional(),
  notes: z.string().optional()
})

// System settings validation schema
export const systemSettingsSchema = z.object({
  commission_tiers: z.array(z.object({
    tier: z.string(),
    min_referrals: z.number(),
    commission_pct: z.number(),
    name: z.string()
  })),
  email_templates: z.record(z.object({
    subject: z.string(),
    body: z.string()
  })),
  notification_settings: z.object({
    email_notifications: z.boolean(),
    partner_status_updates: z.boolean(),
    tier_upgrades: z.boolean()
  })
})

export type PartnerFormData = z.infer<typeof partnerSchema>
export type ReferralFormData = z.infer<typeof referralSchema>
export type PaymentFormData = z.infer<typeof paymentSchema>
export type SystemSettingsData = z.infer<typeof systemSettingsSchema> 