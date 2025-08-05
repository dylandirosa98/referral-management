import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit } from 'lucide-react'
import Link from 'next/link'

// Mock data for development
const mockReferrals = [
  {
    id: '1',
    customer_name: 'John Smith',
    customer_email: 'john@example.com',
    customer_phone: '(555) 123-4567',
    partner_name: 'HVAC Pro Solutions',
    project_type: 'full_replacement',
    roof_type: 'asphalt_shingle',
    estimated_value: 8500,
    status: 'new',
    urgency: 'normal',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    customer_name: 'Sarah Johnson',
    customer_email: 'sarah@example.com',
    customer_phone: '(555) 234-5678',
    partner_name: 'Solar Energy Inc',
    project_type: 'repair',
    roof_type: 'metal',
    estimated_value: 15000,
    status: 'quoted',
    urgency: 'high',
    created_at: '2024-01-15T09:15:00Z'
  },
  {
    id: '3',
    customer_name: 'Mike Brown',
    customer_email: 'mike@example.com',
    customer_phone: '(555) 345-6789',
    partner_name: 'Elite Plumbing',
    project_type: 'maintenance',
    roof_type: 'tile',
    estimated_value: 6200,
    status: 'scheduled',
    urgency: 'normal',
    created_at: '2024-01-14T16:45:00Z'
  },
  {
    id: '4',
    customer_name: 'Lisa Wilson',
    customer_email: 'lisa@example.com',
    customer_phone: '(555) 456-7890',
    partner_name: 'HVAC Pro Solutions',
    project_type: 'full_replacement',
    roof_type: 'asphalt_shingle',
    estimated_value: 12000,
    status: 'won',
    urgency: 'normal',
    created_at: '2024-01-12T14:20:00Z'
  }
]

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

export default function ReferralsPage() {
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
          const columnReferrals = mockReferrals.filter(r => r.status === column.status)
          
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
                {columnReferrals.map((referral) => (
                  <Card key={referral.id} className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm">{referral.customer_name}</h4>
                          <Badge className={getUrgencyBadge(referral.urgency)}>
                            {referral.urgency}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-gray-600">
                          {formatProjectType(referral.project_type)} • {referral.roof_type?.replace('_', ' ')}
                        </p>
                        
                        <p className="text-xs text-gray-500">
                          from {referral.partner_name}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-600">
                            ${referral.estimated_value.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(referral.created_at).toLocaleDateString()}
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
              <div className="text-2xl font-bold text-blue-600">{mockReferrals.filter(r => r.status === 'new').length}</div>
              <div className="text-sm text-gray-600">New Leads</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {mockReferrals.filter(r => ['contacted', 'quoted', 'scheduled', 'in_progress'].includes(r.status)).length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{mockReferrals.filter(r => r.status === 'won').length}</div>
              <div className="text-sm text-gray-600">Won</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ${mockReferrals.reduce((sum, r) => sum + r.estimated_value, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Pipeline Value</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 