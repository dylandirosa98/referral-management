import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building, Users, DollarSign, FileText } from 'lucide-react'
import Link from 'next/link'

// Mock stats for the landing page
const stats = [
  {
    icon: Building,
    title: '50+ Partners',
    description: 'Growing network of trusted businesses'
  },
  {
    icon: FileText,
    title: '500+ Referrals',
    description: 'Successfully processed this year'
  },
  {
    icon: DollarSign,
    title: '$150K+ Paid',
    description: 'In commissions to our partners'
  },
  {
    icon: Users,
    title: '98% Satisfaction',
    description: 'Customer satisfaction rate'
  }
]

export default function PartnerPortalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Roofing Referrals</h1>
              <span className="ml-2 text-sm text-gray-500">Partner Portal</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/partner-portal/register">Register</Link>
              </Button>
              <Button asChild>
                <Link href="/partner-portal/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Partner with Us for Roofing Referrals
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join our network of trusted partners and earn competitive commissions 
            by referring customers who need quality roofing services.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/partner-portal/register">
                Become a Partner
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/partner-portal/login">
                Partner Login
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{stat.title}</h3>
                  <p className="text-gray-600">{stat.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Partner with Us?
            </h2>
            <ul className="space-y-4 text-lg text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span>Competitive commission rates (5-7% based on tier)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span>Fast and reliable payment processing</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span>Real-time tracking of referral status</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span>Dedicated partner support team</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span>Tier-based rewards program</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span>Marketing materials and resources</span>
              </li>
            </ul>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Login</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
              <Button className="w-full">Login to Portal</Button>
              <div className="text-center">
                <Link href="/partner-portal/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot your password?
                </Link>
              </div>
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/partner-portal/register" className="text-blue-600 hover:underline">
                    Register here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Commission Tiers */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Commission Tiers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-orange-200">
              <CardHeader className="text-center bg-orange-50">
                <CardTitle className="text-orange-800">Bronze Partner</CardTitle>
                <div className="text-3xl font-bold text-orange-600">5%</div>
                <p className="text-orange-700">Commission Rate</p>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 0+ referrals required</li>
                  <li>• Monthly payments</li>
                  <li>• Basic support</li>
                  <li>• Portal access</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-medium">
                  MOST POPULAR
                </span>
              </div>
              <CardHeader className="text-center bg-gray-50">
                <CardTitle className="text-gray-800">Silver Partner</CardTitle>
                <div className="text-3xl font-bold text-gray-600">6%</div>
                <p className="text-gray-700">Commission Rate</p>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 5+ referrals required</li>
                  <li>• Bi-weekly payments</li>
                  <li>• Priority support</li>
                  <li>• Marketing materials</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-300">
              <CardHeader className="text-center bg-yellow-50">
                <CardTitle className="text-yellow-800">Gold Partner</CardTitle>
                <div className="text-3xl font-bold text-yellow-600">7%</div>
                <p className="text-yellow-700">Commission Rate</p>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 15+ referrals required</li>
                  <li>• Weekly payments</li>
                  <li>• Dedicated account manager</li>
                  <li>• Exclusive bonuses</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Roofing Referrals. All rights reserved.</p>
          <p className="mt-2 text-gray-400">
            Questions? Contact us at{' '}
            <a href="mailto:info@pythonwebsolutions.com" className="text-blue-400 hover:underline">
              info@pythonwebsolutions.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
} 