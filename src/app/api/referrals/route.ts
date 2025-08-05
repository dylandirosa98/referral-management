import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { referralSchema } from '@/lib/validations'
import { sendNewReferralConfirmation, sendReferralStatusUpdate, sendEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || ''
    const partnerId = searchParams.get('partner_id') || ''
    
    const where: any = {}
    
    if (status) {
      where.status = status
    }

    if (partnerId) {
      where.partnerId = partnerId
    }

    const [referrals, total] = await Promise.all([
      prisma.referral.findMany({
        where,
        include: {
          partner: {
            select: {
              companyName: true,
              contactName: true,
              email: true
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.referral.count({ where })
    ])

    return NextResponse.json({
      referrals,
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
  try {
    const body = await request.json()
    
    // Validate the data
    const validatedData = referralSchema.parse(body)
    
    // Get partner details for commission rate
    const partner = await prisma.partner.findUnique({
      where: { id: validatedData.partnerId },
      select: { 
        commissionRate: true, 
        contactName: true, 
        email: true, 
        portalSlug: true 
      }
    })

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    // Calculate commission due based on estimated value
    const commissionDue = validatedData.estimatedValue 
      ? (validatedData.estimatedValue * (partner.commissionRate.toNumber() / 100))
      : 0

    // Create referral with commission percentage from partner
    const referral = await prisma.referral.create({
      data: {
        ...validatedData,
        commissionPct: partner.commissionRate,
        commissionDue: commissionDue,
        status: 'new'
      }
    })

    // Send confirmation email to partner
    try {
      await sendNewReferralConfirmation({
        partnerEmail: partner.email,
        partnerName: partner.contactName,
        customerName: referral.customerName,
        referralUrl: `${process.env.NEXT_PUBLIC_APP_URL}/partner-portal/${partner.portalSlug}/referrals/${referral.id}`
      })
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
    }

    // Send internal notification for high-value referrals
    if (referral.estimatedValue && referral.estimatedValue.toNumber() > 10000) {
      try {
        await sendEmail({
          to: 'info@pythonwebsolutions.com',
          subject: `High-Value Referral Alert - $${referral.estimatedValue.toLocaleString()}`,
          html: `
            <h2>High-Value Referral Received</h2>
            <p><strong>Customer:</strong> ${referral.customerName}</p>
            <p><strong>Partner:</strong> ${partner.contactName}</p>
            <p><strong>Estimated Value:</strong> $${referral.estimatedValue.toLocaleString()}</p>
            <p><strong>Project Type:</strong> ${referral.projectType}</p>
            <p><strong>Urgency:</strong> ${referral.urgency}</p>
            <p>Please review this referral promptly in the dashboard.</p>
          `
        })
      } catch (emailError) {
        console.error('Internal alert email failed:', emailError)
      }
    }

    return NextResponse.json(referral, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid data provided' }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, actualJobValue, notes } = body
    
    if (!id) {
      return NextResponse.json({ error: 'Referral ID is required' }, { status: 400 })
    }

    // Get current referral data
    const currentReferral = await prisma.referral.findUnique({
      where: { id },
      include: {
        partner: {
          select: {
            contactName: true,
            email: true,
            portalSlug: true
          }
        }
      }
    })

    if (!currentReferral) {
      return NextResponse.json({ error: 'Referral not found' }, { status: 404 })
    }

    const oldStatus = currentReferral.status
    const updateData: any = {}
    
    if (status && status !== oldStatus) {
      updateData.status = status
    }
    
    if (actualJobValue !== undefined) {
      updateData.actualJobValue = actualJobValue
    }
    
    if (notes !== undefined) {
      updateData.notes = notes
    }

    const updatedReferral = await prisma.referral.update({
      where: { id },
      data: updateData
    })

    // Send status update email if status changed
    if (status && status !== oldStatus && currentReferral.partner) {
      try {
        await sendReferralStatusUpdate({
          partnerEmail: currentReferral.partner.email,
          partnerName: currentReferral.partner.contactName,
          customerName: currentReferral.customerName,
          oldStatus: oldStatus || 'new',
          newStatus: status,
          referralUrl: `${process.env.NEXT_PUBLIC_APP_URL}/partner-portal/${currentReferral.partner.portalSlug}/referrals/${id}`
        })
      } catch (emailError) {
        console.error('Status update email failed:', emailError)
      }
    }

    return NextResponse.json(updatedReferral)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 