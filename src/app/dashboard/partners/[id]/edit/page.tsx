'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { PartnerForm } from '@/components/partners/PartnerForm'
import { type PartnerFormData } from '@/lib/validations'

interface Partner {
  id: string
  companyName: string
  contactName: string
  email: string
  phone: string
  businessType: string
  tier: string
  commissionRate: number
  referralCount: number
  totalCommissionEarned: number
  status: string
  portalSlug: string
  address?: {
    street?: string
    city?: string
    state?: string
    zip?: string
  }
  serviceAreas?: string[]
  notes?: string
}

export default function EditPartnerPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const [partnerId, setPartnerId] = useState<string>('')
  const [partner, setPartner] = useState<Partner | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function getPartnerId() {
      const resolvedParams = await params
      setPartnerId(resolvedParams.id)
    }
    getPartnerId()
  }, [params])

  useEffect(() => {
    if (!partnerId) return

    async function fetchPartner() {
      try {
        const response = await fetch(`/api/partners/${partnerId}`)
        if (!response.ok) {
          throw new Error('Partner not found')
        }
        const partnerData = await response.json()
        setPartner(partnerData)
      } catch (err) {
        setError('Failed to load partner information')
        console.error('Error fetching partner:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPartner()
  }, [partnerId])

  const handleSubmit = async (data: PartnerFormData) => {
    if (!partner) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/partners/${partner.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update partner')
      }

      // Redirect back to partner detail page
      router.push(`/dashboard/partners/${partner.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update partner')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading partner information...</p>
        </div>
      </div>
    )
  }

  if (error && !partner) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/partners">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Partners
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Error</h1>
            <p className="text-gray-600 mt-1">Failed to load partner</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600">{error}</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/partners">Return to Partners</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!partner) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/partners">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Partners
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Partner Not Found</h1>
            <p className="text-gray-600 mt-1">The requested partner could not be found</p>
          </div>
        </div>
      </div>
    )
  }

  // Transform partner data to match form data structure
  const initialData: Partial<PartnerFormData> = {
    companyName: partner.companyName,
    contactName: partner.contactName,
    email: partner.email,
    phone: partner.phone || undefined,
    businessType: partner.businessType as any,
    address: partner.address,
    serviceAreas: partner.serviceAreas || [],
    tier: partner.tier as any,
    commissionRate: partner.commissionRate,
    notes: partner.notes || undefined
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href={`/dashboard/partners/${partner.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Partner
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Partner</h1>
            <p className="text-gray-600 mt-1">{partner.companyName}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Partner Information</CardTitle>
          <p className="text-gray-600">
            Update the partner's information below. Changes will be saved immediately.
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <PartnerForm
            initialData={initialData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitButtonText={
              <>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </>
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}