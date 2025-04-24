'use client'
import useAuth from '@/hooks/useAuth'

export default function UserDashboardPage() {
  const { loading } = useAuth(['user'])
  if (loading) return <div>Loading…</div>
  return <h2 className="text-2xl font-bold">User Dashboard</h2>
}
