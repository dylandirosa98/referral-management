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
  } = useForm({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      urgency: 'normal',
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
              <Label htmlFor="partner_id">Referring Partner *</Label>
              <Select
                onValueChange={(value) => setValue('partner_id', value)}
                defaultValue={initialData?.partner_id}
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
              {errors.partner_id && (
                <p className="text-sm text-red-600 mt-1">{errors.partner_id.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="project_type">Project Type *</Label>
              <Select
                onValueChange={(value) => setValue('project_type', value as any)}
                defaultValue={initialData?.project_type}
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
              {errors.project_type && (
                <p className="text-sm text-red-600 mt-1">{errors.project_type.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roof_type">Roof Type</Label>
              <Select
                onValueChange={(value) => setValue('roof_type', value as any)}
                defaultValue={initialData?.roof_type}
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
                  <SelectValue />
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
            <Label htmlFor="estimated_value">Estimated Project Value ($)</Label>
            <Input
              id="estimated_value"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register('estimated_value', { valueAsNumber: true })}
              className={errors.estimated_value ? 'border-red-500' : ''}
            />
          </div>

          <div>
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="Describe the roofing project details..."
              {...register('description')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="customer_name">Customer Name *</Label>
            <Input
              id="customer_name"
              {...register('customer_name')}
                              className={errors.customer_name ? 'border-red-500' : ''}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer_email">Email Address</Label>
              <Input
                id="customer_email"
                type="email"
                {...register('customer_email')}
                className={errors.customer_email ? 'border-red-500' : ''}
              />
            </div>
            
            <div>
              <Label htmlFor="customer_phone">Phone Number</Label>
              <Input
                id="customer_phone"
                {...register('customer_phone')}
                className={errors.customer_phone ? 'border-red-500' : ''}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer_address.street">Street Address</Label>
              <Input
                id="customer_address.street"
                {...register('customer_address.street')}
              />
            </div>
            
            <div>
              <Label htmlFor="customer_address.city">City</Label>
              <Input
                id="customer_address.city"
                {...register('customer_address.city')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer_address.state">State</Label>
              <Input
                id="customer_address.state"
                {...register('customer_address.state')}
              />
            </div>
            
            <div>
              <Label htmlFor="customer_address.zip">ZIP Code</Label>
              <Input
                id="customer_address.zip"
                {...register('customer_address.zip')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="Any internal notes about this referral..."
              {...register('notes')}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Referral' : 'Create Referral'}
        </Button>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  )
} 