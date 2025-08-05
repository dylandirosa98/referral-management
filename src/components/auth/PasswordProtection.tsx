'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, Eye, EyeOff } from 'lucide-react'

const ADMIN_PASSWORD = 'Bubbies228!'
const AUTH_KEY = 'admin_authenticated'

interface PasswordProtectionProps {
  children: React.ReactNode
}

export function PasswordProtection({ children }: PasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const authenticated = sessionStorage.getItem(AUTH_KEY)
    if (authenticated === 'true') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem(AUTH_KEY, 'true')
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem(AUTH_KEY)
    setPassword('')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto bg-blue-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Access Required</CardTitle>
            <p className="text-gray-600">
              Please enter the admin password to access the dashboard
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Admin Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="pr-10"
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <Button type="submit" className="w-full">
                Access Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Add logout functionality to the authenticated view
  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogout}
          className="bg-white shadow-sm"
        >
          Logout
        </Button>
      </div>
      {children}
    </div>
  )
}