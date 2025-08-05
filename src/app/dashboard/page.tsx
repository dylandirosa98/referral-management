import { StatsCards } from '@/components/dashboard/StatsCards'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Eye, Calendar, FileText, DollarSign, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

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

async function getDashboardData() {
  // Get partner stats
  const totalPartners = await prisma.partner.count()
  const activePartners = await prisma.partner.count({
    where: { status: 'active' }
  })

  // Get referral stats
  const totalReferrals = await prisma.referral.count()
  const activeReferrals = await prisma.referral.count({
    where: {
      status: {
        in: ['new', 'contacted', 'quoted', 'scheduled', 'in_progress']
      }
    }
  })

  // Get commission stats
  const pendingCommissions = await prisma.referral.aggregate({
    where: {
      status: {
        in: ['new', 'contacted', 'quoted', 'scheduled', 'in_progress']
      }
    },
    _sum: {
      commissionDue: true
    }
  })

  const paidCommissions = await prisma.referral.aggregate({
    where: {
      status: 'won'
    },
    _sum: {
      commissionDue: true
    }
  })

  // Get conversion rate
  const wonReferrals = await prisma.referral.count({
    where: { status: 'won' }
  })
  const conversionRate = totalReferrals > 0 ? Math.round((wonReferrals / totalReferrals) * 100) : 0

  // Get monthly growth (current month vs last month)
  const currentMonth = new Date()
  currentMonth.setDate(1)
  currentMonth.setHours(0, 0, 0, 0)
  
  const lastMonth = new Date(currentMonth)
  lastMonth.setMonth(lastMonth.getMonth() - 1)

  const currentMonthReferrals = await prisma.referral.count({
    where: {
      createdAt: {
        gte: currentMonth
      }
    }
  })

  const lastMonthReferrals = await prisma.referral.count({
    where: {
      createdAt: {
        gte: lastMonth,
        lt: currentMonth
      }
    }
  })

  const monthlyGrowth = lastMonthReferrals > 0 
    ? Math.round(((currentMonthReferrals - lastMonthReferrals) / lastMonthReferrals) * 100)
    : currentMonthReferrals > 0 ? 100 : 0

  // Get recent referrals
  const recentReferrals = await prisma.referral.findMany({
    include: {
      partner: {
        select: {
          companyName: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5
  })

  return {
    stats: {
      totalPartners,
      activePartners,
      totalReferrals,
      activeReferrals,
      pendingCommissions: pendingCommissions._sum.commissionDue?.toNumber() || 0,
      paidCommissions: paidCommissions._sum.commissionDue?.toNumber() || 0,
      conversionRate,
      monthlyGrowth
    },
    recentReferrals: recentReferrals.map((referral: any) => ({
      id: referral.id,
      customerName: referral.customerName,
      partnerName: referral.partner.companyName,
      status: referral.status,
      estimatedValue: referral.estimatedValue.toNumber(),
      createdAt: referral.createdAt.toISOString()
    }))
  }
}

export default async function DashboardPage() {
  const { stats, recentReferrals } = await getDashboardData()

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
      <StatsCards stats={stats} />

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
            {recentReferrals.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No referrals yet. Add your first partner and start tracking referrals!
              </p>
            ) : (
              recentReferrals.map((referral: any) => (
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
              ))
            )}
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
                Review New Referrals ({stats.activeReferrals})
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