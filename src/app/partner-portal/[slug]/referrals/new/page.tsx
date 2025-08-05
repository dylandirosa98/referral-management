'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { ReferralForm } from '@/components/referrals/ReferralForm'
import { type ReferralFormData } from '@/lib/validations'

interface PartnerData {
  id: string
  companyName: string
  contactName: string
  email: string
}

export default function NewReferralPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const [slug, setSlug] = useState<string>('')
  const [partner, setPartner] = useState<PartnerData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function getSlug() {
      const resolvedParams = await params
      setSlug(resolvedParams.slug)
    }
    getSlug()
  }, [params])

  useEffect(() => {
    if (!slug) return

    async function fetchPartner() {
      try {
        const response = await fetch(`/api/partners?slug=${slug}`)
        if (!response.ok) {
          throw new Error('Partner not found')
        }
        const data = await response.json()
        if (data.partners && data.partners.length > 0) {
          const partnerData = data.partners[0]
          setPartner({
            id: partnerData.id,
            companyName: partnerData.companyName,
            contactName: partnerData.contactName,
            email: partnerData.email
          })
        } else {
          setError('Partner not found')
        }
      } catch (err) {
        setError('Failed to load partner information')
        console.error('Error fetching partner:', err)
      }
    }

    fetchPartner()
  }, [slug])

  const handleSubmit = async (data: ReferralFormData) => {
    if (!partner) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          partnerId: partner.id
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit referral')
      }

      setIsSuccess(true)
      
      // Redirect back to partner dashboard after 2 seconds
      setTimeout(() => {
        router.push(`/partner-portal/${slug}`)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit referral')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900">Referral Submitted!</h2>
              <p className="text-gray-600">
                Thank you for your referral. We'll contact the customer within 24 hours and keep you updated on the progress.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting you back to your dashboard...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-2xl">⚠</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Error</h2>
              <p className="text-gray-600">{error}</p>
              <Button asChild>
                <Link href={`/partner-portal/${slug}`}>
                  Return to Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href={`/partner-portal/${slug}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-bold text-gray-900">Submit New Referral</h1>
            </div>
            <div className="text-sm text-gray-500">
              {partner.companyName}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>New Referral</CardTitle>
            <p className="text-gray-600">
              Submit a new customer referral. We'll contact them within 24 hours and keep you updated on the progress.
            </p>
          </CardHeader>
          <CardContent>
            <ReferralForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              partners={[{
                id: partner.id,
                company_name: partner.companyName,
                contact_name: partner.contactName
              }]}
              initialData={{ partnerId: partner.id }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}