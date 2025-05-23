// pages/api/hello.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // simple test: fetch one profile
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)

  if (error) {
    return res.status(500).json({ error: error.message })
  }
  return res.status(200).json({ data })
}
