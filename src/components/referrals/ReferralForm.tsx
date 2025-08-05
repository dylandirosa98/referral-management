'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { referralSchema, type ReferralFormData } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ReferralFormProps {
  initialData?: Partial<ReferralFormData>
  onSubmit: (data: ReferralFormData) => Promise<void>
  isSubmitting?: boolean
  partners: Array<{ id: string; company_name: string; contact_name: string }>
}

const projectTypes = [
  { value: 'full_replacement', label: 'Full Roof Replacement' },
  { value: 'repair', label: 'Roof Repair' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'emergency', label: 'Emergency Repair' },
  { value: 'gutter_work', label: 'Gutter Work' },
  { value: 'siding', label: 'Siding' },
  { value: 'solar_prep', label: 'Solar Preparation' }
]

const roofTypes = [
  { value: 'asphalt_shingle', label: 'Asphalt Shingle' },
  { value: 'metal', label: 'Metal' },
  { value: 'tile', label: 'Tile' },
  { value: 'slate', label: 'Slate' },
  { value: 'flat', label: 'Flat Roof' },
  { value: 'cedar_shake', label: 'Cedar Shake' },
  { value: 'other', label: 'Other' }
]

const urgencyLevels = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'emergency', label: 'Emergency' }
]

export function ReferralForm({ 
  initialData, 
  onSubmit, 
  isSubmitting = false,
  partners = []
}: ReferralFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ReferralFormData>({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      urgency: 'normal' as const,
      ...initialData
    }
  })

  const handleFormSubmit = async (data: ReferralFormData) => {
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
          <CardTitle>Partner & Project Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="partnerId">Referring Partner *</Label>
              <Select
                onValueChange={(value) => setValue('partnerId', value)}
                defaultValue={initialData?.partnerId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select partner" />
                </SelectTrigger>
                <SelectContent>
                  {partners.map((partner) => (
                    <SelectItem key={partner.id} value={partner.id}>
                      {partner.company_name} ({partner.contact_name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.partnerId && (
                <p className="text-sm text-red-600 mt-1">{errors.partnerId.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="projectType">Project Type *</Label>
              <Select
                onValueChange={(value) => setValue('projectType', value as any)}
                defaultValue={initialData?.projectType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.projectType && (
                <p className="text-sm text-red-600 mt-1">{errors.projectType.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roofType">Roof Type</Label>
              <Select
                onValueChange={(value) => setValue('roofType', value as any)}
                defaultValue={initialData?.roofType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select roof type" />
                </SelectTrigger>
                <SelectContent>
                  {roofTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="urgency">Urgency Level</Label>
              <Select
                onValueChange={(value) => setValue('urgency', value as any)}
                defaultValue={initialData?.urgency || 'normal'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  {urgencyLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="estimatedValue">Estimated Project Value ($)</Label>
            <Input
              id="estimatedValue"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register('estimatedValue', { valueAsNumber: true })}
              className={errors.estimatedValue ? 'border-red-500' : ''}
            />
            {errors.estimatedValue && (
              <p className="text-sm text-red-600 mt-1">{errors.estimatedValue.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the roofing project, issues found, or work needed..."
              {...register('description')}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                {...register('customerName')}
                className={errors.customerName ? 'border-red-500' : ''}
              />
              {errors.customerName && (
                <p className="text-sm text-red-600 mt-1">{errors.customerName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="customerEmail">Email Address</Label>
              <Input
                id="customerEmail"
                type="email"
                {...register('customerEmail')}
                className={errors.customerEmail ? 'border-red-500' : ''}
              />
              {errors.customerEmail && (
                <p className="text-sm text-red-600 mt-1">{errors.customerEmail.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="customerPhone">Phone Number</Label>
            <Input
              id="customerPhone"
              type="tel"
              {...register('customerPhone')}
              className={errors.customerPhone ? 'border-red-500' : ''}
            />
            {errors.customerPhone && (
              <p className="text-sm text-red-600 mt-1">{errors.customerPhone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Customer Address</Label>
            <div className="grid grid-cols-1 gap-4">
              <Input
                placeholder="Street Address"
                {...register('customerAddress.street')}
              />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Input
                  placeholder="City"
                  {...register('customerAddress.city')}
                />
                <Input
                  placeholder="State"
                  {...register('customerAddress.state')}
                />
                <Input
                  placeholder="ZIP Code"
                  {...register('customerAddress.zip')}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about this referral..."
              {...register('notes')}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Submitting...' : 'Submit Referral'}
        </Button>
        <Button type="button" variant="outline" className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  )
} 