import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, ExternalLink, Trash2, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const getBusinessTypeLabel = (type: string) => {
  const labels = {
    hvac: 'HVAC',
    solar: 'Solar',
    plumbing: 'Plumbing',
    electrical: 'Electrical',
    siding: 'Siding',
    gutters: 'Gutters',
    landscaping: 'Landscaping',
    general_contractor: 'General Contractor',
    real_estate: 'Real Estate',
    insurance_adjuster: 'Insurance Adjuster'
  }
  return labels[type as keyof typeof labels] || type
}

const getTierBadge = (tier: string) => {
  const variants = {
    bronze: 'bg-orange-100 text-orange-800',
    silver: 'bg-gray-100 text-gray-800',
    gold: 'bg-yellow-100 text-yellow-800'
  }
  return variants[tier as keyof typeof variants] || 'bg-gray-100 text-gray-800'
}

const getStatusBadge = (status: string) => {
  const variants = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  }
  return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'
}

interface PartnerAddress {
  street?: string
  city?: string
  state?: string
  zip?: string
}

async function getPartnerData(id: string) {
  try {
    const partner = await prisma.partner.findUnique({
      where: { id },
      include: {
        referrals: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!partner) {
      return null
    }

    return {
      ...partner,
      commissionRate: partner.commissionRate.toNumber(),
      totalCommissionEarned: partner.totalCommissionEarned.toNumber(),
      address: partner.address as PartnerAddress | null,
      referrals: partner.referrals.map((referral: any) => ({
        ...referral,
        estimatedValue: referral.estimatedValue.toNumber(),
        commissionDue: referral.commissionDue?.toNumber() || 0
      }))
    }
  } catch (error) {
    console.error('Error fetching partner:', error)
    return null
  }
}

export default async function PartnerDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const partner = await getPartnerData(id)

  if (!partner) {
    notFound()
  }

  const portalUrl = partner.portalSlug 
    ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/partner-portal/${partner.portalSlug}`
    : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/partners">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Partners
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{partner.companyName}</h1>
            <p className="text-gray-600 mt-1">Partner Details</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          {portalUrl && (
            <Button variant="outline" onClick={() => window.open(portalUrl, '_blank')}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Portal
            </Button>
          )}
          <Button asChild>
            <Link href={`/dashboard/partners/${partner.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Partner
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Partner Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Partner Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">Contact Person</h4>
                  <p className="text-gray-600">{partner.contactName}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Business Type</h4>
                  <Badge variant="outline">{getBusinessTypeLabel(partner.businessType)}</Badge>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Email</h4>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href={`mailto:${partner.email}`} className="text-blue-600 hover:underline">
                      {partner.email}
                    </a>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Phone</h4>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{partner.phone || 'Not provided'}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Tier</h4>
                  <Badge className={getTierBadge(partner.tier)}>
                    {partner.tier.charAt(0).toUpperCase() + partner.tier.slice(1)}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Status</h4>
                  <Badge className={getStatusBadge(partner.status)}>
                    {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                  </Badge>
                </div>
              </div>
              
              {partner.address && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Address</h4>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div className="text-gray-600">
                      {partner.address.street && <div>{partner.address.street}</div>}
                      <div>
                        {partner.address.city && `${partner.address.city}, `}
                        {partner.address.state} {partner.address.zip}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {partner.serviceAreas && partner.serviceAreas.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Service Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {partner.serviceAreas.map((area, index) => (
                      <Badge key={index} variant="outline">{area}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {partner.notes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                  <p className="text-gray-600">{partner.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Referrals */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              {partner.referrals.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No referrals yet</p>
              ) : (
                <div className="space-y-4">
                  {partner.referrals.map((referral: any) => (
                    <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{referral.customerName}</h4>
                        <p className="text-sm text-gray-600">{referral.projectType.replace('_', ' ')}</p>
                        <p className="text-sm text-gray-500">
                          Est. Value: ${referral.estimatedValue.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className="mb-2">{referral.status.replace('_', ' ')}</Badge>
                        <p className="text-xs text-gray-500">
                          {new Date(referral.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Total Referrals</h4>
                <p className="text-2xl font-bold text-blue-600">{partner.referralCount}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Commission Rate</h4>
                <p className="text-2xl font-bold text-green-600">{partner.commissionRate}%</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Total Earned</h4>
                <p className="text-2xl font-bold text-green-600">
                  ${partner.totalCommissionEarned.toLocaleString()}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Member Since</h4>
                <p className="text-gray-600">
                  {new Date(partner.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {portalUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Partner Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Share this URL with {partner.contactName} to access their referral portal:
                  </p>
                  <div className="bg-gray-50 p-3 rounded border text-sm font-mono break-all">
                    {portalUrl}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigator.clipboard.writeText(portalUrl)}
                    >
                      Copy URL
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(portalUrl, '_blank')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}