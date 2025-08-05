'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PartnerForm } from '@/components/partners/PartnerForm'
import { type PartnerFormData } from '@/lib/validations'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NewPartnerPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (data: PartnerFormData) => {
    setIsSubmitting(true)
    
    try {
      // In a real app, this would call your API
      console.log('Creating partner:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to partners list
      router.push('/dashboard/partners')
    } catch (error) {
      console.error('Error creating partner:', error)
    } finally {
      setIsSubmitting(false)
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

      {/* Form */}
      <PartnerForm 
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
} 