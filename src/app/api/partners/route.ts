import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { partnerSchema } from '@/lib/validations'
import { sendEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    
    const where: any = {}
    
    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { contactName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status) {
      where.status = status
    }

    const [partners, total] = await Promise.all([
      prisma.partner.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.partner.count({ where })
    ])

    return NextResponse.json({
      partners,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  let body: any
  try {
    body = await request.json()
    console.log('Received partner data:', JSON.stringify(body, null, 2))
    
    // Validate the data
    const validatedData = partnerSchema.parse(body)
    console.log('Validated partner data:', JSON.stringify(validatedData, null, 2))
    
    // Generate portal slug from company name
    const portalSlug = validatedData.companyName
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    
    const partner = await prisma.partner.create({
      data: {
        ...validatedData,
        portalSlug: portalSlug + '-' + Math.random().toString(36).substring(2, 7)
      }
    })

    // Send welcome email to new partner
    try {
      await sendEmail({
        to: partner.email,
        subject: 'Welcome to Our Partner Program!',
        html: `
          <h2>Welcome ${partner.contactName}!</h2>
          <p>Thank you for joining our referral partner program. Your account has been created successfully.</p>
          <p><strong>Company:</strong> ${partner.companyName}</p>
          <p><strong>Partner Tier:</strong> ${partner.tier.charAt(0).toUpperCase() + partner.tier.slice(1)}</p>
          <p><strong>Commission Rate:</strong> ${partner.commissionRate}%</p>
          <p>You can access your partner portal at: <a href="${process.env.NEXT_PUBLIC_APP_URL}/partner-portal/${partner.portalSlug}">Partner Portal</a></p>
          <p>Best regards,<br>The Roofing Team</p>
        `
      })
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json(partner, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    console.error('Error type:', typeof error)
    console.error('Error name:', (error as any)?.name)
    console.error('Error message:', (error as any)?.message)
    
    if (error instanceof Error && error.name === 'ZodError') {
      console.error('Zod validation error details:', JSON.stringify((error as any).issues, null, 2))
      return NextResponse.json({ 
        error: 'Invalid data provided', 
        details: error.message,
        issues: (error as any).issues,
        receivedData: body
      }, { status: 400 })
    }
    
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json({ error: 'Partner with this email already exists' }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 