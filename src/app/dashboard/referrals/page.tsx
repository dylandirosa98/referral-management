import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit } from 'lucide-react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const statusColumns = [
  { status: 'new', title: 'New Leads', color: 'bg-blue-50 border-blue-200' },
  { status: 'contacted', title: 'Contacted', color: 'bg-yellow-50 border-yellow-200' },
  { status: 'quoted', title: 'Quoted', color: 'bg-purple-50 border-purple-200' },
  { status: 'scheduled', title: 'Scheduled', color: 'bg-orange-50 border-orange-200' },
  { status: 'in_progress', title: 'In Progress', color: 'bg-indigo-50 border-indigo-200' },
  { status: 'completed', title: 'Completed', color: 'bg-green-50 border-green-200' },
  { status: 'won', title: 'Won', color: 'bg-emerald-50 border-emerald-200' },
  { status: 'lost', title: 'Lost', color: 'bg-red-50 border-red-200' }
]

const getStatusBadge = (status: string) => {
  const variants = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    quoted: 'bg-purple-100 text-purple-800',
    scheduled: 'bg-orange-100 text-orange-800',
    in_progress: 'bg-indigo-100 text-indigo-800',
    completed: 'bg-green-100 text-green-800',
    won: 'bg-emerald-100 text-emerald-800',
    lost: 'bg-red-100 text-red-800'
  }
  
  return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'
}

const getUrgencyBadge = (urgency: string) => {
  const variants = {
    low: 'bg-gray-100 text-gray-800',
    normal: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    emergency: 'bg-red-100 text-red-800'
  }
  
  return variants[urgency as keyof typeof variants] || 'bg-gray-100 text-gray-800'
}

const formatProjectType = (type: string) => {
  return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

async function getReferralsData() {
  const referrals = await prisma.referral.findMany({
    include: {
      partner: {
        select: {
          companyName: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return referrals.map((referral: any) => ({
    id: referral.id,
    customerName: referral.customerName,
    customerEmail: referral.customerEmail || '',
    customerPhone: referral.customerPhone || '',
    partnerName: referral.partner.companyName,
    projectType: referral.projectType,
    roofType: referral.roofType || '',
    estimatedValue: referral.estimatedValue.toNumber(),
    status: referral.status,
    urgency: referral.urgency,
    createdAt: referral.createdAt.toISOString()
  }))
}

export default async function ReferralsPage() {
  const referrals = await getReferralsData()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Referrals</h1>
          <p className="text-gray-600 mt-1">
            Track and manage all referrals from partners through the sales pipeline.
          </p>
        </div>
        
        <Button asChild>
          <Link href="/dashboard/referrals/new">
            <Plus className="mr-2 h-4 w-4" />
            New Referral
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
                placeholder="Search referrals..." 
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline">Export</Button>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-8 gap-4 overflow-x-auto">
        {statusColumns.map((column) => {
          const columnReferrals = referrals.filter((r: any) => r.status === column.status)
          
          return (
            <Card key={column.status} className={`${column.color} min-w-[280px]`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  {column.title}
                  <Badge variant="secondary" className="ml-2">
                    {columnReferrals.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {columnReferrals.map((referral: any) => (
                  <Card key={referral.id} className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm">{referral.customerName}</h4>
                          <Badge className={getUrgencyBadge(referral.urgency)}>
                            {referral.urgency}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-gray-600">
                          {formatProjectType(referral.projectType)} {referral.roofType ? `• ${referral.roofType.replace('_', ' ')}` : ''}
                        </p>
                        
                        <p className="text-xs text-gray-500">
                          from {referral.partnerName}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-600">
                            ${referral.estimatedValue.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(referral.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex gap-1 pt-1">
                          <Button size="sm" variant="outline" className="flex-1" asChild>
                            <Link href={`/dashboard/referrals/${referral.id}`}>
                              <Eye className="mr-1 h-3 w-3" />
                              View
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1" asChild>
                            <Link href={`/dashboard/referrals/${referral.id}/edit`}>
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {columnReferrals.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No referrals in this stage
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {referrals.filter((r: any) => r.status === 'new').length}
              </div>
              <div className="text-sm text-gray-600">New Leads</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {referrals.filter((r: any) => ['contacted', 'quoted', 'scheduled', 'in_progress'].includes(r.status)).length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {referrals.filter((r: any) => r.status === 'won').length}
              </div>
              <div className="text-sm text-gray-600">Won</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ${referrals.reduce((sum: number, r: any) => sum + r.estimatedValue, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Pipeline Value</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 