import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DollarSign, 
  FileText, 
  TrendingUp, 
  Clock,
  Plus,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

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

const getTierBadge = (tier: string) => {
  const variants = {
    bronze: 'bg-orange-100 text-orange-800',
    silver: 'bg-gray-100 text-gray-800',
    gold: 'bg-yellow-100 text-yellow-800'
  }
  
  return variants[tier as keyof typeof variants] || 'bg-gray-100 text-gray-800'
}

const formatProjectType = (type: string) => {
  return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

async function getPartnerData(slug: string) {
  try {
    const partner = await prisma.partner.findUnique({
      where: { 
        portalSlug: slug,
        status: 'active'
      },
      include: {
        referrals: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })

    if (!partner) {
      return null
    }

    // Calculate this month's referrals
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)
    
    const thisMonthReferrals = await prisma.referral.count({
      where: {
        partnerId: partner.id,
        createdAt: {
          gte: currentMonth
        }
      }
    })

    // Calculate pending commission
    const pendingCommission = await prisma.referral.aggregate({
      where: {
        partnerId: partner.id,
        status: {
          in: ['new', 'contacted', 'quoted', 'scheduled', 'in_progress']
        }
      },
      _sum: {
        commissionDue: true
      }
    })

    // Calculate conversion rate
    const totalReferrals = partner.referralCount
    const wonReferrals = await prisma.referral.count({
      where: {
        partnerId: partner.id,
        status: 'won'
      }
    })
    
    const conversionRate = totalReferrals > 0 ? Math.round((wonReferrals / totalReferrals) * 100) : 0

    return {
      ...partner,
      thisMonthReferrals,
      pendingCommission: pendingCommission._sum.commissionDue || 0,
      conversionRate
    }
  } catch (error) {
    console.error('Database error in getPartnerData:', error)
    return null
  }
}

export default async function PartnerDashboardPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  const partnerData = await getPartnerData(slug)
  
  if (!partnerData) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Partner Portal</h1>
              <span className="ml-2 text-sm text-gray-500">• {partnerData.companyName}</span>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={getTierBadge(partnerData.tier)}>
                {partnerData.tier.charAt(0).toUpperCase() + partnerData.tier.slice(1)} Partner
              </Badge>
              <Button asChild>
                <Link href={`/partner-portal/${slug}/referrals/new`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Submit Referral
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {partnerData.contactName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's an overview of your referral performance and earnings.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Referrals
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{partnerData.referralCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {partnerData.thisMonthReferrals} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Earned
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${partnerData.totalCommissionEarned.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {partnerData.commissionRate.toNumber()}% commission rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Commission
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                ${partnerData.pendingCommission.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting payment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Conversion Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {partnerData.conversionRate}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Referrals to jobs
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Referrals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Referrals</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/partner-portal/${slug}/referrals`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View All
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {partnerData.referrals.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No referrals yet. Submit your first referral to get started!
                </p>
              ) : (
                partnerData.referrals.map((referral: any) => (
                  <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{referral.customerName}</h4>
                        <Badge className={getStatusBadge(referral.status)}>
                          {referral.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatProjectType(referral.projectType)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Est. Value: ${referral.estimatedValue.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">
                        ${referral.commissionDue.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {referral.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" size="lg" asChild>
                <Link href={`/partner-portal/${slug}/referrals/new`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Submit New Referral
                </Link>
              </Button>
              
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href={`/partner-portal/${slug}/referrals`}>
                  <FileText className="mr-2 h-4 w-4" />
                  View All Referrals
                </Link>
              </Button>
              
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href={`/partner-portal/${slug}/earnings`}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  View Earnings History
                </Link>
              </Button>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Commission Tier Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current: {partnerData.tier.charAt(0).toUpperCase() + partnerData.tier.slice(1)}</span>
                    <span>{partnerData.referralCount} referrals</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (partnerData.referralCount / 20) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {partnerData.tier === 'gold' 
                      ? 'You\'ve reached the highest tier!' 
                      : `${20 - partnerData.referralCount} more referrals to next tier`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 