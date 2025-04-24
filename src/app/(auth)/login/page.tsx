'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string|null>(null)
  const [loading, setLoading]   = useState(false)

  // If already signed in, send straight to dashboard
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user
      if (user) {
        supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single()
          .then(({ data: prof }) => {
            router.replace(
              prof?.role === 'admin' ? '/dashboard/admin' : '/dashboard/user'
            )
          })
      }
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // 1) Sign in
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email, password
    })
    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    // 2) Get role and redirect
    const userId = data.user?.id!
    const { data: prof, error: profError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', userId)
      .single()

    setLoading(false)
    if (profError || !prof) {
      setError('Could not load your profile.')
      return
    }
    router.push(prof.role === 'admin' ? '/dashboard/admin' : '/dashboard/user')
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email address
            </label>
            <input
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email" required autoComplete="email"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                         focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <input
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password" required autoComplete="current-password"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                         focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-500
                       focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Not a member?{' '}
          <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Create an account
          </a>
        </p>
      </div>
    </div>
  )
}
