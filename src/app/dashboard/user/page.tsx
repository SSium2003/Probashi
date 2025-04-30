// 'use client'
// import useAuth from '@/hooks/useAuth'
// import { supabase } from '@/lib/supabaseClient'
// import { useRouter } from 'next/navigation'

// export default function UserDashboardPage() {
//   const { loading } = useAuth(['user'])
//   const router = useRouter()

//   if (loading) {
//     return <div className="flex items-center justify-center h-full">Loading…</div>
//   }

//   return (
//     <div className="min-h-full">
//       {/* Header with Logout */}
//       <header className="bg-white px-6 py-4 flex justify-between items-center shadow">
//         <h1 className="text-2xl font-bold">User Dashboard</h1>
//         <button
//           onClick={async () => {
//             await supabase.auth.signOut()
//             router.push('/login')
//           }}
//           className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-500"
//         >
//           Logout
//         </button>
//       </header>

//       {/* Main Content */}
//       <main className="p-6">
//         {/* Your dashboard content goes here */}
//         <p>Welcome to your dashboard! Here you can view your applied jobs, courses, etc.</p>
//       </main>
//     </div>
//   )
// }


'use client'

import useAuth from '@/hooks/useAuth'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function UserDashboardPage() {
  const { loading } = useAuth(['user'])
  const router = useRouter()

  const [jobs, setJobs] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [countryFilter, setCountryFilter] = useState('')
  const [salaryFilter, setSalaryFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    const { data, error } = await supabase.from('jobs').select('*')
    if (error) {
      console.error('Error fetching jobs:', error)
    } else {
      setJobs(data || [])
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCountry = countryFilter
      ? job.country.toLowerCase() === countryFilter.toLowerCase()
      : true

    const matchesRole = roleFilter
      ? job.title.toLowerCase().includes(roleFilter.toLowerCase())
      : true

    const matchesSalary = salaryFilter
      ? checkSalaryMatch(job.salary_range, salaryFilter)
      : true

    return matchesSearch && matchesCountry && matchesRole && matchesSalary
  })

  function checkSalaryMatch(salaryText: string, selectedRange: string) {
    if (!salaryText) return false
    const numbers = salaryText.match(/\d+/g)
    if (!numbers) return false
    const salaryFrom = parseInt(numbers[0], 10)
    if (selectedRange === '0-20000') return salaryFrom <= 20000
    if (selectedRange === '20000-50000') return salaryFrom > 20000 && salaryFrom <= 50000
    if (selectedRange === '50000-100000') return salaryFrom > 50000 && salaryFrom <= 100000
    if (selectedRange === '100000+') return salaryFrom > 100000
    return false
  }

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
        <p className="mb-8">Welcome to your dashboard! Here you can view your applied jobs, courses, etc.</p>

        {/* Job Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <input
            type="text"
            placeholder="Search job title or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Filter by Country"
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            value={salaryFilter}
            onChange={(e) => setSalaryFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Filter by Salary</option>
            <option value="0-20000">0–20k</option>
            <option value="20000-50000">20k–50k</option>
            <option value="50000-100000">50k–100k</option>
            <option value="100000+">100k+</option>
          </select>
          <input
            type="text"
            placeholder="Filter by Role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        {/* Job Results */}
        {filteredJobs.length === 0 ? (
          <p>No jobs found matching your criteria.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <li key={job.id} className="border p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-2">{job.title}</h2>
                <p className="text-gray-700 mb-2">{job.description}</p>
                <p className="text-gray-600">Country: {job.country}</p>
                <p className="text-gray-600">Salary: {job.salary_range}</p>
                <p className="text-gray-600">
                  Qualifications:{' '}
                  {Array.isArray(job.qualifications)
                    ? job.qualifications.join(', ')
                    : job.qualifications}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
