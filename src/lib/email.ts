import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailTemplate {
  subject: string
  body: string
}

export interface EmailData {
  partner_name?: string
  customer_name?: string
  old_status?: string
  new_status?: string
  referral_url?: string
  new_tier?: string
  commission_rate?: number
  [key: string]: any
}

export async function sendEmail({
  to,
  subject,
  html,
  from = 'info@pythonwebsolutions.com'
}: {
  to: string | string[]
  subject: string
  html: string
  from?: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })

    if (error) {
      console.error('Email sending error:', error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Email service error:', error)
    throw error
  }
}

export async function sendTemplateEmail({
  to,
  template,
  data,
  from = 'info@pythonwebsolutions.com'
}: {
  to: string | string[]
  template: EmailTemplate
  data: EmailData
  from?: string
}) {
  // Replace template variables with actual data
  let subject = template.subject
  let body = template.body

  Object.entries(data).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`
    subject = subject.replace(new RegExp(placeholder, 'g'), String(value))
    body = body.replace(new RegExp(placeholder, 'g'), String(value))
  })

  return sendEmail({
    to,
    subject,
    html: body,
    from
  })
}

// Predefined email templates
export const EMAIL_TEMPLATES = {
  REFERRAL_STATUS_UPDATE: {
    subject: 'Referral Status Update - {{customer_name}}',
    body: `
      <h2>Referral Status Update</h2>
      <p>Hi {{partner_name}},</p>
      <p>Your referral for <strong>{{customer_name}}</strong> has been updated:</p>
      <p><strong>Previous Status:</strong> {{old_status}}</p>
      <p><strong>New Status:</strong> {{new_status}}</p>
      <p><a href="{{referral_url}}" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Referral Details</a></p>
      <br>
      <p>Thank you for your continued partnership!</p>
      <p>Best regards,<br>Roofing Team</p>
    `
  },
  TIER_UPGRADE: {
    subject: 'Congratulations! Partner Tier Upgrade',
    body: `
      <h2>🎉 Tier Upgrade Notification</h2>
      <p>Hi {{partner_name}},</p>
      <p>Congratulations! You have been upgraded to <strong>{{new_tier}}</strong> status.</p>
      <p>Your new commission rate is <strong>{{commission_rate}}%</strong>.</p>
      <p>Thank you for your excellent partnership and continued referrals!</p>
      <br>
      <p>Keep up the great work!</p>
      <p>Best regards,<br>Roofing Team</p>
    `
  },
  NEW_REFERRAL_CONFIRMATION: {
    subject: 'Referral Submitted Successfully - {{customer_name}}',
    body: `
      <h2>Referral Submitted Successfully</h2>
      <p>Hi {{partner_name}},</p>
      <p>Thank you for submitting a referral for <strong>{{customer_name}}</strong>.</p>
      <p>We have received your referral and will contact the customer within 24 hours.</p>
      <p><a href="{{referral_url}}" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Track Referral Status</a></p>
      <br>
      <p>We appreciate your partnership!</p>
      <p>Best regards,<br>Roofing Team</p>
    `
  },
  COMMISSION_PAYMENT: {
    subject: 'Commission Payment Processed - {{amount}}',
    body: `
      <h2>Commission Payment Processed</h2>
      <p>Hi {{partner_name}},</p>
      <p>Your commission payment of <strong>{{amount}}</strong> has been processed.</p>
      <p><strong>Payment Method:</strong> {{payment_method}}</p>
      <p><strong>Transaction ID:</strong> {{transaction_id}}</p>
      <p>You should receive the payment within 3-5 business days.</p>
      <br>
      <p>Thank you for your partnership!</p>
      <p>Best regards,<br>Roofing Team</p>
    `
  }
}

// Helper functions for specific email types
export async function sendReferralStatusUpdate({
  partnerEmail,
  partnerName,
  customerName,
  oldStatus,
  newStatus,
  referralUrl
}: {
  partnerEmail: string
  partnerName: string
  customerName: string
  oldStatus: string
  newStatus: string
  referralUrl: string
}) {
  return sendTemplateEmail({
    to: partnerEmail,
    template: EMAIL_TEMPLATES.REFERRAL_STATUS_UPDATE,
    data: {
      partner_name: partnerName,
      customer_name: customerName,
      old_status: oldStatus,
      new_status: newStatus,
      referral_url: referralUrl
    }
  })
}

export async function sendTierUpgradeNotification({
  partnerEmail,
  partnerName,
  newTier,
  commissionRate
}: {
  partnerEmail: string
  partnerName: string
  newTier: string
  commissionRate: number
}) {
  return sendTemplateEmail({
    to: partnerEmail,
    template: EMAIL_TEMPLATES.TIER_UPGRADE,
    data: {
      partner_name: partnerName,
      new_tier: newTier,
      commission_rate: commissionRate
    }
  })
}

export async function sendNewReferralConfirmation({
  partnerEmail,
  partnerName,
  customerName,
  referralUrl
}: {
  partnerEmail: string
  partnerName: string
  customerName: string
  referralUrl: string
}) {
  return sendTemplateEmail({
    to: partnerEmail,
    template: EMAIL_TEMPLATES.NEW_REFERRAL_CONFIRMATION,
    data: {
      partner_name: partnerName,
      customer_name: customerName,
      referral_url: referralUrl
    }
  })
} 