'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import useAuth from '@/hooks/useAuth'

export default function AgencyDashboard() {
  const { loading } = useAuth(['agency']) // Only allow agencies

  const [jobs, setJobs] = useState<any[]>([])
  const [profileId, setProfileId] = useState<string | null>(null)
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    salary_range: '',
    country: '',
    qualifications: '',
  })

  // Fetch agency's profile id first
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (profile) {
          setProfileId(profile.id)
        } else {
          console.error('Profile not found', error)
        }
      }
    })
  }, [])

  // When profileId is ready, fetch jobs
  useEffect(() => {
    if (profileId) {
      fetchJobs(profileId)
    }
  }, [profileId])

  const fetchJobs = async (agencyProfileId: string) => {
    console.log('Fetching jobs for agency profile ID:', agencyProfileId)

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('agency_id', agencyProfileId)
      // .order('created_at', { ascending: false }) // Uncomment this only if you have 'created_at' column!

    if (!error && data) {
      console.log('Fetched Jobs:', data)
      setJobs(data)
    } else {
      console.error('Error fetching jobs', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value })
  }

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!profileId) {
      alert('Profile not loaded yet. Please wait.')
      return
    }

    const { error } = await supabase.from('jobs').insert({
      agency_id: profileId,
      title: newJob.title,
      description: newJob.description,
      salary_range: newJob.salary_range,
      country: newJob.country,
      qualifications: newJob.qualifications.split(',').map((q) => q.trim()),
    })

    if (error) {
      console.error('Insert Error:', error)
      alert('Failed to post job.')
    } else {
      alert('Job posted successfully!')
      setNewJob({
        title: '',
        description: '',
        salary_range: '',
        country: '',
        qualifications: '',
      })
      fetchJobs(profileId)
    }
  }

  const handleDeleteJob = async (id: string) => {
    const { error } = await supabase.from('jobs').delete().eq('id', id)
    if (error) {
      console.error('Delete Error:', error)
      alert('Failed to delete job.')
    } else {
      alert('Job deleted successfully.')
      if (profileId) {
        fetchJobs(profileId)
      }
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Agency Dashboard</h1>

      {/* Post a New Job */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Post a New Job</h2>
        <form onSubmit={handlePostJob} className="grid grid-cols-1 gap-4 max-w-2xl">
          <input
            className="border p-2 rounded"
            type="text"
            name="title"
            placeholder="Job Title"
            value={newJob.title}
            onChange={handleChange}
            required
          />
          <textarea
            className="border p-2 rounded"
            name="description"
            placeholder="Job Description"
            value={newJob.description}
            onChange={handleChange}
            required
          />
          <input
            className="border p-2 rounded"
            type="text"
            name="salary_range"
            placeholder="Salary Range"
            value={newJob.salary_range}
            onChange={handleChange}
          />
          <input
            className="border p-2 rounded"
            type="text"
            name="country"
            placeholder="Country"
            value={newJob.country}
            onChange={handleChange}
            required
          />
          <input
            className="border p-2 rounded"
            type="text"
            name="qualifications"
            placeholder="Required Qualifications (comma separated)"
            value={newJob.qualifications}
            onChange={handleChange}
          />
          <button className="bg-blue-500 text-white p-2 rounded" type="submit">
            Post Job
          </button>
        </form>
      </div>

      {/* Manage Posted Jobs */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Manage My Jobs</h2>
        {jobs.length === 0 ? (
          <p>No jobs posted yet.</p>
        ) : (
          <ul className="space-y-4">
            {jobs.map((job) => (
              <li key={job.id} className="border p-4 rounded flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">{job.title}</h3>
                  <p>Country: {job.country}</p>
                  <p>Salary: {job.salary_range}</p>
                  {/* 👇 FIX: Qualifications print correctly */}
                  <p>
                    Qualifications:{' '}
                    {Array.isArray(job.qualifications)
                      ? job.qualifications.join(', ')
                      : job.qualifications}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteJob(job.id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
