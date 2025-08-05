import { StatsCards, defaultStats } from '@/components/dashboard/StatsCards'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Eye, Calendar, FileText, DollarSign, BarChart3 } from 'lucide-react'
import Link from 'next/link'

// Mock data for recent activity
const recentReferrals = [
  {
    id: '1',
    customerName: 'John Smith',
    partnerName: 'HVAC Pro Solutions',
    status: 'new',
    estimatedValue: 8500,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    customerName: 'Sarah Johnson',
    partnerName: 'Solar Energy Inc',
    status: 'quoted',
    estimatedValue: 15000,
    createdAt: '2024-01-15T09:15:00Z'
  },
  {
    id: '3',
    customerName: 'Mike Brown',
    partnerName: 'Elite Plumbing',
    status: 'scheduled',
    estimatedValue: 6200,
    createdAt: '2024-01-14T16:45:00Z'
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

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your referrals.</p>
        </div>
        
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/dashboard/partners/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Partner
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/referrals/new">
              <Plus className="mr-2 h-4 w-4" />
              New Referral
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={defaultStats} />

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Referrals</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/referrals">
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
                    <h4 className="font-medium">{referral.customerName}</h4>
                    <Badge className={getStatusBadge(referral.status)}>
                      {referral.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    from {referral.partnerName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Est. Value: ${referral.estimatedValue.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(referral.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/dashboard/referrals?status=new">
                <FileText className="mr-2 h-4 w-4" />
                Review New Referrals ({defaultStats.activeReferrals})
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/dashboard/payments?status=pending">
                <DollarSign className="mr-2 h-4 w-4" />
                Process Pending Payments
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/dashboard/referrals?follow_up=today">
                <Calendar className="mr-2 h-4 w-4" />
                Today's Follow-ups
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/dashboard/analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics Report
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 