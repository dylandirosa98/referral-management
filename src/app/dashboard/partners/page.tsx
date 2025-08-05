import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { PartnersTable } from '@/components/partners/PartnersTable'

// Force dynamic rendering
export const dynamic = 'force-dynamic'


async function getPartnersData() {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return partners.map((partner: any) => ({
      id: partner.id,
      companyName: partner.companyName,
      contactName: partner.contactName,
      email: partner.email,
      phone: partner.phone || '',
      businessType: partner.businessType,
      tier: partner.tier,
      commissionRate: partner.commissionRate.toNumber(),
      referralCount: partner.referralCount,
      totalCommissionEarned: partner.totalCommissionEarned.toNumber(),
      status: partner.status,
      createdAt: partner.createdAt.toISOString()
    }))
  } catch (error) {
    console.error('Database error in getPartnersData:', error)
    return []
  }
}

export default async function PartnersPage() {
  const partners = await getPartnersData()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partners</h1>
          <p className="text-gray-600 mt-1">
            Manage your referral partners and track their performance.
          </p>
        </div>
        
        <Button asChild>
          <Link href="/dashboard/partners/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Partner
          </Link>
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search partners..." 
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter</Button>
            <Button variant="outline">Export</Button>
          </div>
        </CardContent>
      </Card>

      {/* Partners Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Partners ({partners.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {partners.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No partners yet</p>
              <Button asChild>
                <Link href="/dashboard/partners/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Partner
                </Link>
              </Button>
            </div>
          ) : (
            <PartnersTable partners={partners} />
          )}
        </CardContent>
      </Card>
    </div>
  )
} 