'use client'
import { ReactNode } from 'react'
import useAuth from '@/hooks/useAuth'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { loading } = useAuth()  // any logged-in role is OK; pages will re-check role

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading…</div>
  }

  return (
    <div className="min-h-full">
      <header className="bg-indigo-600 text-white p-4 flex justify-between">
        <h1 className="text-xl">Dashboard</h1>
        <button
          onClick={() => supabase.auth.signOut()}
          className="px-3 py-1 bg-indigo-500 hover:bg-indigo-400 rounded"
        >
          Logout
        </button>
      </header>
      <nav className="p-4 space-x-4">
        <Link href="/dashboard/user" className="underline">User</Link>
        <Link href="/dashboard/admin" className="underline">Admin</Link>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  )
}
