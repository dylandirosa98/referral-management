'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { partnerSchema, type PartnerFormData } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface PartnerFormProps {
  initialData?: Partial<PartnerFormData>
  onSubmit: (data: PartnerFormData) => Promise<void>
  isSubmitting?: boolean
  submitButtonText?: React.ReactNode
}

const businessTypes = [
  { value: 'hvac', label: 'HVAC' },
  { value: 'solar', label: 'Solar' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'siding', label: 'Siding' },
  { value: 'gutters', label: 'Gutters' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'general_contractor', label: 'General Contractor' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'insurance_adjuster', label: 'Insurance Adjuster' }
]

const partnerTiers = [
  { value: 'bronze', label: 'Bronze (5%)', color: 'bg-orange-100 text-orange-800' },
  { value: 'silver', label: 'Silver (6%)', color: 'bg-gray-100 text-gray-800' },
  { value: 'gold', label: 'Gold (7%)', color: 'bg-yellow-100 text-yellow-800' }
]

export function PartnerForm({ initialData, onSubmit, isSubmitting = false, submitButtonText }: PartnerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      tier: 'bronze' as const,
      commissionRate: 5,
      businessType: 'hvac' as const,
      ...initialData
    }
  })

  const selectedTier = watch('tier')

  const handleFormSubmit = async (data: PartnerFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                {...register('companyName')}
                className={errors.companyName ? 'border-red-500' : ''}
              />
              {errors.companyName && (
                <p className="text-sm text-red-600 mt-1">{errors.companyName.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="contactName">Contact Name *</Label>
              <Input
                id="contactName"
                {...register('contactName')}
                className={errors.contactName ? 'border-red-500' : ''}
              />
              {errors.contactName && (
                <p className="text-sm text-red-600 mt-1">{errors.contactName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                {...register('phone')}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="businessType">Business Type *</Label>
            <Select
              onValueChange={(value) => setValue('businessType', value as any)}
              defaultValue={initialData?.businessType || 'hvac'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.businessType && (
              <p className="text-sm text-red-600 mt-1">{errors.businessType.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address & Service Areas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address.street">Street Address</Label>
              <Input
                id="address.street"
                {...register('address.street')}
              />
            </div>
            
            <div>
              <Label htmlFor="address.city">City</Label>
              <Input
                id="address.city"
                {...register('address.city')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address.state">State</Label>
              <Input
                id="address.state"
                {...register('address.state')}
              />
            </div>
            
            <div>
              <Label htmlFor="address.zip">ZIP Code</Label>
              <Input
                id="address.zip"
                {...register('address.zip')}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="serviceAreas">Service Areas (comma-separated)</Label>
            <Input
              id="serviceAreas"
              placeholder="e.g., Dallas, Fort Worth, Arlington"
              {...register('serviceAreas')}
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter the cities or areas this partner serves
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Partnership Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tier">Partner Tier</Label>
              <Select
                onValueChange={(value) => {
                  setValue('tier', value as any)
                  // Update commission rate based on tier
                  const rates = { bronze: 5, silver: 6, gold: 7 }
                  setValue('commissionRate', rates[value as keyof typeof rates])
                }}
                defaultValue={initialData?.tier || 'bronze'}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {partnerTiers.map((tier) => (
                    <SelectItem key={tier.value} value={tier.value}>
                      <div className="flex items-center gap-2">
                        <Badge className={tier.color}>
                          {tier.label}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="commissionRate">Commission Rate (%)</Label>
              <Input
                id="commissionRate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                {...register('commissionRate', { valueAsNumber: true })}
                className={errors.commissionRate ? 'border-red-500' : ''}
              />
              {errors.commissionRate && (
                <p className="text-sm text-red-600 mt-1">{errors.commissionRate.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="Any additional notes about this partner..."
              {...register('notes')}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
                    <Button type="submit" disabled={isSubmitting}>
              {submitButtonText || (isSubmitting ? 'Saving...' : initialData ? 'Update Partner' : 'Create Partner')}
        </Button>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  )
} 