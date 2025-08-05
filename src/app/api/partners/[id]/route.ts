import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if partner exists
    const partner = await prisma.partner.findUnique({
      where: { id },
      include: {
        referrals: true,
        payments: true
      }
    })

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    // Check if partner has active referrals or payments
    const hasActiveReferrals = partner.referrals.some(referral => 
      ['new', 'contacted', 'quoted', 'scheduled', 'in_progress'].includes(referral.status)
    )

    const hasPendingPayments = partner.payments.some(payment => 
      payment.status === 'pending'
    )

    if (hasActiveReferrals || hasPendingPayments) {
      return NextResponse.json({
        error: 'Cannot delete partner with active referrals or pending payments. Please complete or cancel them first.'
      }, { status: 400 })
    }

    // Delete the partner (this will cascade delete referrals and payments due to Prisma relations)
    await prisma.partner.delete({
      where: { id }
    })

    return NextResponse.json({ 
      message: 'Partner deleted successfully',
      deletedPartner: {
        id: partner.id,
        companyName: partner.companyName,
        contactName: partner.contactName
      }
    })
  } catch (error) {
    console.error('Partner deletion error:', error)
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json({
          error: 'Cannot delete partner due to existing referrals or payments'
        }, { status: 400 })
      }
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const partner = await prisma.partner.findUnique({
      where: { id },
      include: {
        referrals: {
          orderBy: { createdAt: 'desc' }
        },
        payments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    return NextResponse.json(partner)
  } catch (error) {
    console.error('Partner fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}