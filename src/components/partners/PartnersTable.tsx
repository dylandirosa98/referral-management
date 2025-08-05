'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MoreHorizontal, Eye, Edit, Trash2, AlertTriangle, ExternalLink, Copy } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
  createdAt: string
  portalSlug?: string
}

interface PartnersTableProps {
  partners: Partner[]
}

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

export function PartnersTable({ partners: initialPartners }: PartnersTableProps) {
  const [partners, setPartners] = useState(initialPartners)
  const [deletePartner, setDeletePartner] = useState<Partner | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const router = useRouter()

  const handleDeleteClick = (partner: Partner) => {
    setDeletePartner(partner)
    setDeleteError(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deletePartner) return

    setIsDeleting(true)
    setDeleteError(null)

    try {
      const response = await fetch(`/api/partners/${deletePartner.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete partner')
      }

      // Remove partner from local state
      setPartners(partners.filter(p => p.id !== deletePartner.id))
      setDeletePartner(null)
      
      // Refresh the page to update any other data
      router.refresh()
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete partner')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeletePartner(null)
    setDeleteError(null)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Business Type</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Commission</TableHead>
            <TableHead>Referrals</TableHead>
            <TableHead>Total Earned</TableHead>
            <TableHead>Portal URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.map((partner) => (
            <TableRow key={partner.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{partner.companyName}</div>
                  <div className="text-sm text-gray-500">{partner.email}</div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{partner.contactName}</div>
                  <div className="text-sm text-gray-500">{partner.phone}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {getBusinessTypeLabel(partner.businessType)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getTierBadge(partner.tier)}>
                  {partner.tier.charAt(0).toUpperCase() + partner.tier.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{partner.commissionRate}%</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{partner.referralCount}</span>
                  <span className="text-sm text-gray-500">referrals</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-medium">
                  ${partner.totalCommissionEarned.toLocaleString()}
                </span>
              </TableCell>
              <TableCell>
                {partner.portalSlug ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 p-0 text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        const url = `${window.location.origin}/partner-portal/${partner.portalSlug}`
                        window.open(url, '_blank')
                      }}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visit Portal
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        const url = `${window.location.origin}/partner-portal/${partner.portalSlug}`
                        navigator.clipboard.writeText(url)
                      }}
                      title="Copy URL"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">No portal</span>
                )}
              </TableCell>
              <TableCell>
                <Badge className={getStatusBadge(partner.status)}>
                  {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/partners/${partner.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/partners/${partner.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Partner
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleDeleteClick(partner)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Partner
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletePartner} onOpenChange={(open) => !open && handleDeleteCancel()}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="bg-red-100 rounded-full p-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <DialogTitle>Delete Partner</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this partner?
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {deletePartner && (
            <div className="bg-gray-50 rounded-lg p-4 my-4">
              <h4 className="font-medium">{deletePartner.companyName}</h4>
              <p className="text-sm text-gray-600">{deletePartner.contactName} • {deletePartner.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                {deletePartner.referralCount} referrals • ${deletePartner.totalCommissionEarned.toLocaleString()} earned
              </p>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> This action cannot be undone. The partner and all their referral history will be permanently deleted.
            </p>
          </div>

          {deleteError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{deleteError}</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteCancel} disabled={isDeleting}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Partner'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}