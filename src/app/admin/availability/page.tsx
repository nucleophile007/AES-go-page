"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import Link from "next/link"

const hours = Array.from({ length: 24 }, (_, i) => i) // 0..23
function toLabel(h: number) {
  const hr = ((h + 11) % 12) + 1
  const ampm = h < 12 ? 'AM' : 'PM'
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(hr)}:00 ${ampm}`
}

export default function AdminAvailabilityPage() {
  const selectedProgram = "College Prep" // Fixed to College Prep only
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [days, setDays] = useState<Record<string, string[]>>({})
  const [draftDays, setDraftDays] = useState<Record<string, string[]>>({})
  const [dirtyDates, setDirtyDates] = useState<Set<string>>(new Set())

  // Calendar state & helpers
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"]
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    const days: Array<number | null> = []
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null)
    for (let day = 1; day <= daysInMonth; day++) days.push(day)
    return days
  }
  const navigateMonth = (direction: "prev" | "next", e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    setCurrentMonth((prev) => {
      const n = new Date(prev)
      n.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1))
      return n
    })
  }
  const formatDate = (day: number) => {
    const month = currentMonth.getMonth() + 1
    const year = currentMonth.getFullYear()
    return `${month}/${day}/${year}`
  }
  const isSelectedDate = (day: number) => selectedDate === formatDate(day)
  const dayHasAvailability = (day: number) => {
    const key = formatDate(day)
    const arr = draftDays[key] || []
    return Array.isArray(arr) && arr.length > 0
  }
  const calendarDays = getDaysInMonth(currentMonth)

  // Load availability for College Prep program
  const loadAvailabilityForProgram = async (program: string) => {
    setInitialLoading(true)
    try {
      const res = await fetch(`/api/admin/availability?program=${encodeURIComponent(program)}`)
      if (!res.ok) throw new Error('Failed to load availability')
      const json = await res.json()
      const map: Record<string, string[]> = {}
      for (const d of json.days || []) map[d.date] = d.times || []
      setDays(map)
      setDraftDays(map)
      setDirtyDates(new Set())
    } catch (error) {
      console.error('Failed to load availability:', error)
      setDays({})
      setDraftDays({})
    } finally {
      setInitialLoading(false)
    }
  }

  // Initial load for College Prep
  useEffect(() => {
    loadAvailabilityForProgram(selectedProgram)
  }, [selectedProgram])

  // When changing selectedDate, show draft values
  useEffect(() => {
    setSelectedTimes(selectedDate ? (draftDays[selectedDate] || []) : [])
  }, [selectedDate, draftDays])

  const markDirty = (date: string) => {
    setDirtyDates(prev => new Set(prev).add(date))
  }

  const toggleTime = (t: string) => {
    if (!selectedDate) return
    setSelectedTimes((prev) => {
      const next = prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
      setDraftDays((d) => ({ ...d, [selectedDate]: next }))
      markDirty(selectedDate)
      return next
    })
  }

  const saveAll = async () => {
    if (dirtyDates.size === 0) return
    setLoading(true)
    try {
      const payload = Array.from(dirtyDates).map(date => ({
        date,
        times: (draftDays[date] || []).slice().sort((a: string, b: string) => a.localeCompare(b)),
        program: selectedProgram
      }))
      const res = await fetch('/api/admin/availability', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Save failed')
      const json = await res.json()
      const saved: Record<string, string[]> = {}
      for (const d of json.days || []) saved[d.date] = d.times || []
      const deleted: string[] = json.deletedDates || []
      setDays(prev => {
        const next = { ...prev, ...saved }
        for (const dd of deleted) delete (next as any)[dd]
        return next
      })
      setDraftDays(prev => {
        const next = { ...prev, ...saved }
        for (const dd of deleted) delete (next as any)[dd]
        return next
      })
      setDirtyDates(new Set())
      if (selectedDate && (json.deletedDates || []).includes(selectedDate)) {
        setSelectedTimes([])
      }
    } catch (e) {
      console.error(e)
      alert('Failed to save availability')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) return <div className="max-w-7xl mx-auto p-6">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Navigation Breadcrumb */}
      <div className="mb-6">
        <Link 
          href="/admin" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Registrations
        </Link>
        <h1 className="text-3xl font-bold mb-2">Manage College Prep Availability</h1>
        <p className="text-gray-600">Set available time slots for College Prep program</p>
      </div>

      {/* Current Program Indicator */}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900">Managing: {selectedProgram}</h3>
            <p className="text-sm text-blue-700">Set available time slots for College Prep sessions</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-blue-600">
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"/> has slots
            </span>
            {dirtyDates.size > 0 && (
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"/> unsaved changes
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar column */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <button 
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              type="button" 
              onClick={(e: React.MouseEvent)=>navigateMonth('prev', e)}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h4 className="text-xl font-semibold">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h4>
            <button 
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              type="button" 
              onClick={(e: React.MouseEvent)=>navigateMonth('next', e)}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-3">
            {daysOfWeek.map(d => (
              <div key={d} className="text-center text-sm font-medium text-gray-500 py-2">
                {d}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => (
              <div key={idx} className="aspect-square flex items-center justify-center">
                {day && (
                  <button
                    type="button"
                    onClick={() => setSelectedDate(formatDate(day))}
                    className={`w-12 h-12 rounded-full text-sm font-semibold transition-all ${
                      isSelectedDate(day)
                        ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    <span className="relative">
                      {day}
                      {dayHasAvailability(day) && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Times column */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Time Slots</h2>
              <p className="text-sm text-gray-600">
                {selectedDate ? `Selected: ${selectedDate}` : 'Select a date from calendar'}
              </p>
            </div>
            <button 
              onClick={saveAll} 
              disabled={loading || dirtyDates.size === 0}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : `Save All ${dirtyDates.size > 0 ? `(${dirtyDates.size})` : ''}`}
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {hours.map(h => {
              const label = toLabel(h)
              const active = selectedTimes.includes(label)
              return (
                <button
                  key={h}
                  type="button"
                  onClick={()=>toggleTime(label)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                    active 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-400'
                  }`}
                  disabled={!selectedDate}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {selectedDate && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3">
                Selected Times for {selectedDate}
                <span className="ml-2 text-sm font-normal text-blue-600">
                  ({selectedProgram})
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedTimes.length > 0 ? (
                  selectedTimes.sort((a,b)=>a.localeCompare(b)).map(t => (
                    <span 
                      key={t} 
                      className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 font-medium"
                    >
                      {t}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No times selected</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
