import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Users, FileText, DollarSign, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Referral Management System</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Roofing Referral Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Streamline your partner referrals, track commissions, and manage your roofing business relationships all in one place.
          </p>
        </div>

        {/* Access Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Admin Dashboard */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full mr-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Admin Dashboard</CardTitle>
                  <p className="text-gray-600 mt-1">For roofing company staff and administrators</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="h-4 w-4 mr-2" />
                  Manage partners and referrals
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Track commissions and payments
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Building2 className="h-4 w-4 mr-2" />
                  Monitor business performance
                </div>
              </div>
              <Button asChild className="w-full" size="lg">
                <Link href="/dashboard">
                  Access Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Partner Portal */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full mr-4">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Partner Portal</CardTitle>
                  <p className="text-gray-600 mt-1">For referral partners and contractors</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="h-4 w-4 mr-2" />
                  Submit new referrals
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Track your commissions
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  Monitor referral status
                </div>
              </div>
              <Button asChild variant="outline" className="w-full" size="lg">
                <Link href="/partner-portal">
                  Partner Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">System Status</p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/api/health">Health Check</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/api/db-status">Database Status</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
