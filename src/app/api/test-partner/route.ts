import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('=== SIMPLE PARTNER CREATION TEST ===')
    
    const body = await request.json()
    console.log('Received data:', body)
    
    // Create partner with minimal required data
    const partner = await prisma.partner.create({
      data: {
        companyName: body.companyName || 'Default Company',
        contactName: body.contactName || 'Default Contact', 
        email: body.email || `default-${Date.now()}@example.com`,
        businessType: 'hvac', // hardcoded
        tier: 'bronze', // hardcoded
        commissionRate: 5, // hardcoded
        portalSlug: `partner-${Date.now()}`, // simple slug
        status: 'active' // hardcoded
      }
    })
    
    console.log('✅ Partner created:', partner.id)
    
    return NextResponse.json({
      success: true,
      partner: {
        id: partner.id,
        companyName: partner.companyName,
        contactName: partner.contactName,
        email: partner.email,
        portalSlug: partner.portalSlug,
        portalUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/partner-portal/${partner.portalSlug}`
      }
    })
    
  } catch (error) {
    console.error('=== SIMPLE PARTNER CREATION FAILED ===')
    console.error('Error:', error)
    console.error('Error details:', {
      name: (error as any)?.name,
      message: (error as any)?.message,
      code: (error as any)?.code,
      stack: (error as any)?.stack
    })
    
    return NextResponse.json({
      success: false,
      error: (error as any)?.message || 'Unknown error',
      details: error
    }, { status: 500 })
  }
} 