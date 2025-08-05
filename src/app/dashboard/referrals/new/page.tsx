'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'
import { ReferralForm } from '@/components/referrals/ReferralForm'
import { type ReferralFormData } from '@/lib/validations'

interface Partner {
  id: string
  company_name: string
  contact_name: string
}

export default function NewReferralPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchPartners() {
      try {
        const response = await fetch('/api/partners?limit=100')
        if (!response.ok) {
          throw new Error('Failed to fetch partners')
        }
        const data = await response.json()
        
        // Transform partner data to match expected format
        const partnersData = data.partners.map((partner: any) => ({
          id: partner.id,
          company_name: partner.companyName,
          contact_name: partner.contactName
        }))
        
        setPartners(partnersData)
      } catch (err) {
        setError('Failed to load partners')
        console.error('Error fetching partners:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPartners()
  }, [])

  const handleSubmit = async (data: ReferralFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create referral')
      }

      // Redirect back to referrals page
      router.push('/dashboard/referrals')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create referral')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading partners...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/referrals">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Referrals
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Referral</h1>
            <p className="text-gray-600 mt-1">Add a new customer referral to the system</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Referral Information</CardTitle>
          <p className="text-gray-600">
            Create a new referral and assign it to a partner. The partner will be notified via email.
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          {partners.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No partners available</p>
              <p className="text-sm text-gray-400 mb-4">
                You need to create at least one partner before adding referrals.
              </p>
              <Button asChild>
                <Link href="/dashboard/partners/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Partner
                </Link>
              </Button>
            </div>
          ) : (
            <ReferralForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              partners={partners}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}