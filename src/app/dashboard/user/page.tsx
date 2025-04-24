'use client'
import useAuth from '@/hooks/useAuth'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function UserDashboardPage() {
  const { loading } = useAuth(['user'])
  const router = useRouter()

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading…</div>
  }

  return (
    <div className="min-h-full">
      {/* Header with Logout */}
      <header className="bg-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            router.push('/login')
          }}
          className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-500"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Your dashboard content goes here */}
        <p>Welcome to your dashboard! Here you can view your applied jobs, courses, etc.</p>
      </main>
    </div>
  )
}
