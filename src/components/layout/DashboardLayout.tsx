import { Sidebar } from './Sidebar'
import { PasswordProtection } from '@/components/auth/PasswordProtection'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <PasswordProtection>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </PasswordProtection>
  )
} 