'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PartnerForm } from '@/components/partners/PartnerForm'
import { type PartnerFormData } from '@/lib/validations'
import { ArrowLeft, Copy, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function NewPartnerPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdPartner, setCreatedPartner] = useState<any>(null)
  const router = useRouter()

  const handleSubmit = async (data: PartnerFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create partner')
      }
      
      const partner = await response.json()
      setCreatedPartner(partner)
    } catch (error) {
      console.error('Error creating partner:', error)
      alert('Failed to create partner: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyPortalUrl = () => {
    if (createdPartner) {
      const portalUrl = `${window.location.origin}/partner-portal/${createdPartner.portalSlug}`
      navigator.clipboard.writeText(portalUrl)
      alert('Portal URL copied to clipboard!')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/partners">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Partners
          </Link>
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Partner</h1>
          <p className="text-gray-600 mt-1">
            Create a new referral partner to start tracking leads and commissions.
          </p>
        </div>
      </div>

      {/* Success Message */}
      {createdPartner && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">✅ Partner Created Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-green-700 mb-2">
                <strong>{createdPartner.companyName}</strong> has been added as a {createdPartner.tier} partner.
              </p>
              <p className="text-green-600 text-sm mb-4">
                A welcome email has been sent to {createdPartner.email}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-sm font-medium text-gray-700 mb-2">Partner Portal URL:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm">
                  {typeof window !== 'undefined' ? `${window.location.origin}/partner-portal/${createdPartner.portalSlug}` : `/partner-portal/${createdPartner.portalSlug}`}
                </code>
                <Button onClick={copyPortalUrl} size="sm" variant="outline">
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/partner-portal/${createdPartner.portalSlug}`} target="_blank">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Visit
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => setCreatedPartner(null)} 
                variant="outline"
              >
                Create Another Partner
              </Button>
              <Button asChild>
                <Link href="/dashboard/partners">
                  View All Partners
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      {!createdPartner && (
        <PartnerForm 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
} 