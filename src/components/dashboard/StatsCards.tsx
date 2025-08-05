import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react'

interface StatsCardsProps {
  stats: {
    totalPartners: number
    activePartners: number
    totalReferrals: number
    activeReferrals: number
    pendingCommissions: number
    paidCommissions: number
    conversionRate: number
    monthlyGrowth: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Partners',
      value: stats.totalPartners,
      subtitle: `${stats.activePartners} active`,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Referrals',
      value: stats.totalReferrals,
      subtitle: `${stats.activeReferrals} in progress`,
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      title: 'Pending Commissions',
      value: `$${stats.pendingCommissions.toLocaleString()}`,
      subtitle: 'Awaiting payment',
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Paid Commissions',
      value: `$${stats.paidCommissions.toLocaleString()}`,
      subtitle: 'This month',
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      subtitle: 'Referrals to jobs',
      icon: CheckCircle,
      color: 'bg-emerald-500'
    },
    {
      title: 'Monthly Growth',
      value: `${stats.monthlyGrowth > 0 ? '+' : ''}${stats.monthlyGrowth}%`,
      subtitle: 'vs last month',
      icon: TrendingUp,
      color: stats.monthlyGrowth > 0 ? 'bg-green-500' : 'bg-red-500'
    }
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.color}`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.subtitle}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// Default stats for development/demo
export const defaultStats = {
  totalPartners: 24,
  activePartners: 21,
  totalReferrals: 156,
  activeReferrals: 23,
  pendingCommissions: 12500,
  paidCommissions: 8750,
  conversionRate: 68,
  monthlyGrowth: 12
} 