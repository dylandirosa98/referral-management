import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('=== TESTING DATABASE CONNECTION ===')
    
    // Test 1: Basic connection
    console.log('Testing basic connection...')
    await prisma.$connect()
    console.log('✅ Database connected')
    
    // Test 2: Simple query
    console.log('Testing simple query...')
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Query successful:', result)
    
    // Test 3: Check if partners table exists
    console.log('Testing partners table...')
    const count = await prisma.partner.count()
    console.log('✅ Partners table accessible, count:', count)
    
    // Test 4: Try to create a simple partner
    console.log('Testing partner creation...')
    const testPartner = await prisma.partner.create({
      data: {
        companyName: 'Test Company',
        contactName: 'Test Contact',
        email: `test-${Date.now()}@example.com`,
        businessType: 'hvac',
        tier: 'bronze',
        commissionRate: 5,
        portalSlug: `test-${Date.now()}`,
        status: 'active'
      }
    })
    console.log('✅ Partner created successfully:', testPartner.id)
    
    return NextResponse.json({
      success: true,
      message: 'All database tests passed',
      partnerId: testPartner.id,
      partnerSlug: testPartner.portalSlug
    })
    
  } catch (error) {
    console.error('=== DATABASE TEST FAILED ===')
    console.error('Error:', error)
    console.error('Error type:', typeof error)
    console.error('Error name:', (error as any)?.name)
    console.error('Error message:', (error as any)?.message)
    console.error('Error code:', (error as any)?.code)
    console.error('Error stack:', (error as any)?.stack)
    
    return NextResponse.json({
      success: false,
      error: (error as any)?.message,
      details: error
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 