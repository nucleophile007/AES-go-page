"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const hours = Array.from({ length: 24 }, (_, i) => i) // 0..23
function toLabel(h: number) {
  const hr = ((h + 11) % 12) + 1
  const ampm = h < 12 ? 'AM' : 'PM'
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(hr)}:00 ${ampm}`
}

export default function AdminAvailabilityPage() {
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

  // Initial load of availability (auth is gated by server layout & middleware)
  useEffect(() => {
    let cancelled = false
    setInitialLoading(true)
    fetch('/api/admin/availability')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load availability')
        return r.json()
      })
      .then(json => {
        if (cancelled) return
        const map: Record<string, string[]> = {}
        for (const d of json.days || []) map[d.date] = d.times || []
        setDays(map)
        setDraftDays(map)
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setInitialLoading(false) })
    return () => { cancelled = true }
  }, [])

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
        times: (draftDays[date] || []).slice().sort((a,b)=>a.localeCompare(b))
      }))
      const res = await fetch('/api/admin/availability', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
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
      alert('Failed to save some availability')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) return <div className="max-w-5xl mx-auto p-6">Loading...</div>

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Availability</h1>

      <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
        <span className="inline-flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"/> has slots</span>
        {dirtyDates.size > 0 && <span className="inline-flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"/> unsaved changes</span>}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendar column */}
        <div className="bg-white rounded-2xl border p-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" type="button" onClick={(e)=>navigateMonth('prev', e)} className="p-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h4 className="text-lg font-semibold">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h4>
            <Button variant="ghost" size="sm" type="button" onClick={(e)=>navigateMonth('next', e)} className="p-2">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-2">
            {daysOfWeek.map(d => (
              <div key={d} className="text-center text-xs font-medium text-gray-500 py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => (
              <div key={idx} className="aspect-square flex items-center justify-center">
                {day && (
                  <button
                    type="button"
                    onClick={() => setSelectedDate(formatDate(day))}
                    className={`w-10 h-10 rounded-full text-sm font-semibold transition-all ${
                      isSelectedDate(day)
                        ? 'bg-blue-600 text-white shadow'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-blue-50'
                    }`}
                  >
                    <span className="relative">
                      {day}
                      {dayHasAvailability(day) && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full" />
                      )}
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Times column */}
        <div className="bg-white rounded-2xl border p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold">Selected date</h2>
              <p className="text-sm text-gray-600">{selectedDate || 'None'}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={saveAll} disabled={loading || dirtyDates.size === 0}>Save All</Button>
            </div>
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
                  className={`px-3 py-2 rounded border text-sm ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`}
                  disabled={!selectedDate}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {selectedDate && (
            <div className="mt-6">
              <h3 className="font-medium">Selected for {selectedDate}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedTimes.sort((a,b)=>a.localeCompare(b)).map(t => (
                  <span key={t} className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
