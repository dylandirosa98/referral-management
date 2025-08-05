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

// Mock partner data - in real app this would come from database
const partnerData = {
  id: '1',
  company_name: 'HVAC Pro Solutions',
  contact_name: 'John Martinez',
  email: 'john@hvacpro.com',
  tier: 'gold',
  commission_rate: 7,
  referral_count: 18,
  total_commission_earned: 12500,
  pending_commission: 2800,
  this_month_referrals: 5,
  conversion_rate: 68
}

// Mock referrals data
const recentReferrals = [
  {
    id: '1',
    customer_name: 'John Smith',
    project_type: 'full_replacement',
    estimated_value: 8500,
    status: 'quoted',
    commission_due: 595,
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    customer_name: 'Sarah Johnson',
    project_type: 'repair',
    estimated_value: 3200,
    status: 'won',
    commission_due: 224,
    created_at: '2024-01-12T14:20:00Z'
  },
  {
    id: '3',
    customer_name: 'Mike Brown',
    project_type: 'maintenance',
    estimated_value: 1500,
    status: 'in_progress',
    commission_due: 105,
    created_at: '2024-01-10T16:45:00Z'
  }
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

export default function PartnerDashboardPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Partner Portal</h1>
              <span className="ml-2 text-sm text-gray-500">• {partnerData.company_name}</span>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={getTierBadge(partnerData.tier)}>
                {partnerData.tier.charAt(0).toUpperCase() + partnerData.tier.slice(1)} Partner
              </Badge>
              <Button asChild>
                <Link href={`/partner-portal/${params.slug}/referrals/new`}>
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
            Welcome back, {partnerData.contact_name}!
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
              <div className="text-2xl font-bold">{partnerData.referral_count}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {partnerData.this_month_referrals} this month
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
                ${partnerData.total_commission_earned.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {partnerData.commission_rate}% commission rate
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
                ${partnerData.pending_commission.toLocaleString()}
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
                {partnerData.conversion_rate}%
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
                <Link href={`/partner-portal/${params.slug}/referrals`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View All
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentReferrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{referral.customer_name}</h4>
                      <Badge className={getStatusBadge(referral.status)}>
                        {referral.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatProjectType(referral.project_type)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Est. Value: ${referral.estimated_value.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">
                      ${referral.commission_due}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" size="lg" asChild>
                <Link href={`/partner-portal/${params.slug}/referrals/new`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Submit New Referral
                </Link>
              </Button>
              
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href={`/partner-portal/${params.slug}/referrals`}>
                  <FileText className="mr-2 h-4 w-4" />
                  View All Referrals
                </Link>
              </Button>
              
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href={`/partner-portal/${params.slug}/earnings`}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  View Earnings History
                </Link>
              </Button>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Commission Tier Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current: {partnerData.tier.charAt(0).toUpperCase() + partnerData.tier.slice(1)}</span>
                    <span>{partnerData.referral_count} referrals</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (partnerData.referral_count / 20) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {partnerData.tier === 'gold' 
                      ? 'You\'ve reached the highest tier!' 
                      : `${20 - partnerData.referral_count} more referrals to next tier`
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