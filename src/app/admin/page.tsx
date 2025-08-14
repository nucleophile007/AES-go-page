"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Search, Users, Phone, Filter, CheckCircle, Loader2 } from "lucide-react"


interface WebinarRegistration {
  id: number
  email: string
  parentName: string
  parentEmail: string
  parentPhone: string
  studentName: string
  grade: string
  schoolName: string
  program: string
  preferredTime: string
  createdAt: string
  approved: boolean
}

export default function AdminPage() {
  const { status } = useSession()

  const [data, setData] = useState<WebinarRegistration[]>([])
  const [filteredData, setFilteredData] = useState<WebinarRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProgram, setSelectedProgram] = useState("all")
  const [approving, setApproving] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (status !== 'authenticated') return

    fetch("/api/admin/webinar-registrations")
      .then((res) => {
        if (res.status === 403) {
          throw new Error("Not authorized")
        }
        if (!res.ok) {
          throw new Error("Failed to load data")
        }
        return res.json()
      })
      .then((json) => {
        setData(json.registrations || [])
        setLoading(false)
      })
      .catch((e: Error) => {
        setError(e.message)
        setLoading(false)
      })
  }, [status])

  useEffect(() => {
    let filtered = data.filter(
      (reg) =>
        reg.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.schoolName.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (selectedProgram !== "all") {
      filtered = filtered.filter((reg) => reg.program === selectedProgram)
    }

    setFilteredData(filtered)
  }, [searchTerm, selectedProgram, data])

  const programs = [...new Set(data.map((reg) => reg.program))]

  const approve = async (id: number) => {
    setApproving(prev => new Set(prev).add(id))
    try {
      const res = await fetch(`/api/admin/registrations/${id}/approve`, { method: 'POST' })
      if (!res.ok) throw new Error('Approve failed')
      const json = await res.json()
      const updated = json.registration as WebinarRegistration
      setData(prev => prev.map(r => r.id === updated.id ? { ...r, approved: updated.approved } : r))
    } catch (e) {
      console.error(e)
      alert('Approve failed')
    } finally {
      setApproving(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  if (status === "loading" || loading) return <p>Loading...</p>
  if (error === "Not authorized") return <p className="p-6 text-red-600 font-medium">Not authorized to view this page.</p>
  if (error) return <p>{error}</p>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Webinar Registrations</h1>
                <p className="text-sm text-gray-500">Manage and view all registration data</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/availability"
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Manage Availability
              </Link>
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-blue-700">
                  Total Registrations: <span className="font-bold">{data.length}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="sm:w-48 relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Programs</option>
                {programs.map((program) => (
                  <option key={program} value={program}>
                    {program}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {filteredData.length !== data.length && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredData.length} of {data.length} registrations
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No registrations found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Info</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Program</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((reg, idx) => (
                    <tr key={reg.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">#{reg.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="font-medium">{reg.parentName}</div>
                          <div className="text-sm text-gray-500">{reg.parentEmail}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" /> {reg.parentPhone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="font-medium">{reg.studentName}</div>
                          <div className="text-sm text-gray-500">Grade {reg.grade}</div>
                          <div className="text-sm text-gray-500">{reg.schoolName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                          {reg.program}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{reg.preferredTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(reg.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {reg.approved ? (
                          <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded text-xs"><CheckCircle className="w-3 h-3"/> Approved</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className={`text-sm px-3 py-1 rounded inline-flex items-center gap-2 ${reg.approved || approving.has(reg.id) ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                          disabled={reg.approved || approving.has(reg.id)}
                          onClick={() => approve(reg.id)}
                        >
                          {approving.has(reg.id) ? (<><Loader2 className="h-4 w-4 animate-spin" /> Approving...</>) : 'Approve'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
