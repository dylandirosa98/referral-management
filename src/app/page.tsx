import { redirect } from 'next/navigation'

export default function HomePage() {
  // For now, redirect to dashboard
  // Later we'll add proper authentication and landing page
  redirect('/dashboard')
}
