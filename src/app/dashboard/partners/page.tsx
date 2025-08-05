import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

const getBusinessTypeLabel = (type: string) => {
  const labels = {
    hvac: 'HVAC',
    solar: 'Solar',
    plumbing: 'Plumbing',
    electrical: 'Electrical',
    siding: 'Siding',
    gutters: 'Gutters',
    landscaping: 'Landscaping',
    general_contractor: 'General Contractor',
    real_estate: 'Real Estate',
    insurance_adjuster: 'Insurance Adjuster'
  }
  return labels[type as keyof typeof labels] || type
}

const getTierBadge = (tier: string) => {
  const variants = {
    bronze: 'bg-orange-100 text-orange-800',
    silver: 'bg-gray-100 text-gray-800',
    gold: 'bg-yellow-100 text-yellow-800'
  }
  
  const colors = variants[tier as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  
  return (
    <Badge className={colors}>
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </Badge>
  )
}

const getStatusBadge = (status: string) => {
  const variants = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    suspended: 'bg-red-100 text-red-800'
  }
  
  const colors = variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  
  return (
    <Badge className={colors}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

async function getPartnersData() {
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Business Type</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Referrals</TableHead>
                  <TableHead>Commission Earned</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.map((partner: any) => (
                  <TableRow key={partner.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{partner.companyName}</div>
                        <div className="text-sm text-gray-500">{partner.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{partner.contactName}</div>
                        <div className="text-sm text-gray-500">{partner.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getBusinessTypeLabel(partner.businessType)}
                    </TableCell>
                    <TableCell>
                      {getTierBadge(partner.tier)}
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{partner.referralCount}</div>
                        <div className="text-sm text-gray-500">referrals</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-right">
                        <div className="font-medium">
                          ${partner.totalCommissionEarned.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {partner.commissionRate}% rate
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(partner.status)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/partners/${partner.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/partners/${partner.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Partner
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Partner
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 