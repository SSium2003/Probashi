'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function useAuth(allowedRoles: string[] = []) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // const checkAuth = async () => {
    //   const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    //   if (sessionError) {
    //     console.error('Session Error:', sessionError)
    //     router.replace('/login')
    //     return
    //   }
    const checkAuth = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    
      console.log('Session Data:', sessionData)
      console.log('Session Error:', sessionError)
    
      if (sessionError || !sessionData?.session) {
        console.error('No session found. Redirecting to login.')
        router.replace('/login')
        return
      }
    

      const user = sessionData.session?.user
      console.log('Logged-in User:', user)

      if (!user) {
        router.replace('/login')
        return
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      console.log('Profile Data:', profileData)
      console.log('Profile Error:', profileError)

      if (profileError || !profileData) {
        supabase.auth.signOut().then(() => router.replace('/login'))
        return
      }

      if (allowedRoles.length && !allowedRoles.includes(profileData.role)) {
        router.replace('/dashboard/user')
        return
      }

      setLoading(false)
    }

    checkAuth()
  }, [router, allowedRoles])

  return { loading }
}
