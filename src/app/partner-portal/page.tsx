import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2, Mail, Phone, MapPin, Users, DollarSign } from 'lucide-react'
import Link from 'next/link'

export default function PartnerPortalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Partner Portal</h1>
            </div>
            <Button asChild>
              <Link href="/dashboard">Admin Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Our Partner Portal
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access your personalized dashboard, submit referrals, track commissions, and manage your partnership with our roofing company.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Partner Access */}
          <Card className="lg:sticky lg:top-8">
            <CardHeader>
              <CardTitle className="text-2xl">Partner Access</CardTitle>
              <p className="text-gray-600">
                Enter your unique partner portal URL to access your dashboard.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="portal-url">Your Partner Portal URL</Label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    /partner-portal/
                  </span>
                  <Input
                    id="portal-url"
                    type="text"
                    placeholder="your-company-slug"
                    className="rounded-l-none"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Use the unique slug provided when your partnership was created.
                </p>
              </div>

              <Button className="w-full" size="lg" disabled>
                Access Portal
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have access yet?{' '}
                  <Link href="/contact" className="text-blue-600 hover:text-blue-500">
                    Contact us
                  </Link>{' '}
                  to become a partner.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Program Benefits */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Partner Program Benefits
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <DollarSign className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Earn Commissions</h3>
                    <p className="text-gray-600 text-sm">
                      Competitive commission rates with tier-based increases
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Easy Referrals</h3>
                    <p className="text-gray-600 text-sm">
                      Simple online forms to submit new referrals
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="h-6 w-6 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Real-time Updates</h3>
                    <p className="text-gray-600 text-sm">
                      Get notified about referral status changes
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-6 w-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Local Focus</h3>
                    <p className="text-gray-600 text-sm">
                      Serve customers in your specific service areas
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Commission Tiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <div>
                      <span className="font-semibold text-orange-800">Bronze Partner</span>
                      <p className="text-sm text-orange-600">0-4 referrals</p>
                    </div>
                    <span className="text-orange-800 font-bold">5% Commission</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-semibold text-gray-800">Silver Partner</span>
                      <p className="text-sm text-gray-600">5-14 referrals</p>
                    </div>
                    <span className="text-gray-800 font-bold">6% Commission</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <span className="font-semibold text-yellow-800">Gold Partner</span>
                      <p className="text-sm text-yellow-600">15+ referrals</p>
                    </div>
                    <span className="text-yellow-800 font-bold">7% Commission</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                Ready to Partner With Us?
              </h3>
              <p className="text-blue-700 mb-4">
                Join our network of trusted partners and start earning commissions on quality roofing referrals.
              </p>
              <Button asChild variant="outline">
                <Link href="/contact">
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 