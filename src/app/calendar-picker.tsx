"use client"

import type React from "react"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CalendarPickerProps {
  selectedDate: string
  selectedTime: string
  onDateSelect: (date: string) => void
  onTimeSelect: (time: string) => void
  dateTimeMapping: Record<string, string[]>
}

export function CalendarPicker({ selectedDate, selectedTime, onDateSelect, onTimeSelect, dateTimeMapping }: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: Array<number | null> = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next", e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

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
  const isDateAvailable = (day: number) => Object.prototype.hasOwnProperty.call(dateTimeMapping, formatDate(day))
  const getAvailableTimesForDate = (date: string) => dateTimeMapping[date] || []

  // Parse a time string like "9:00 AM" or "12:30 pm" to minutes since midnight
  const timeStringToMinutes = (input: string) => {
    const s = input.trim()
    // If a range like "9:00 AM - 9:30 AM" is ever provided, take the first part
    const firstPart = s.split(/[–-]/)[0].trim()
    const match = firstPart.match(/^(\d{1,2})(?::(\d{2}))?\s*([AaPp][Mm])$/)
    if (!match) return Number.MAX_SAFE_INTEGER
    let hours = parseInt(match[1], 10)
    const minutes = parseInt(match[2] || "0", 10)
    const meridiem = match[3].toUpperCase()
    if (hours === 12) hours = 0
    if (meridiem === "PM") hours += 12
    return hours * 60 + minutes
  }

  const days = getDaysInMonth(currentMonth)
  const availableTimesForSelectedDate = getAvailableTimesForDate(selectedDate)
  const sortedTimesForSelectedDate = [...availableTimesForSelectedDate].sort(
    (a, b) => timeStringToMinutes(a) - timeStringToMinutes(b)
  )

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Select Date & Time</h3>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" type="button" onClick={(e) => navigateMonth("prev", e)} className="p-3 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-all duration-200">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h4 className="text-xl font-bold text-gray-800">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h4>
            <Button variant="ghost" size="sm" type="button" onClick={(e) => navigateMonth("next", e)} className="p-3 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-all duration-200">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-gray-500 py-3">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
              <div key={index} className="aspect-square flex items-center justify-center">
                {day && (
                  <button
                    type="button"
                    onClick={() => { if (isDateAvailable(day)) { onDateSelect(formatDate(day)); onTimeSelect("") } }}
                    disabled={!isDateAvailable(day)}
                    className={`w-12 h-12 flex items-center justify-center text-sm font-semibold rounded-full transition-all duration-300 transform hover:scale-105 ${
                      isSelectedDate(day)
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 scale-110"
                        : isDateAvailable(day)
                          ? "text-gray-700 cursor-pointer hover:bg-blue-50 hover:text-blue-600 shadow-md shadow-blue-200/50 bg-white border-2 border-blue-200 hover:border-blue-300"
                          : "text-gray-300 cursor-not-allowed bg-gray-50 border border-gray-200"
                    }`}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h5 className="font-bold text-gray-800 mb-4 text-lg">Available Times</h5>
          {selectedDate ? (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {sortedTimesForSelectedDate.length > 0 ? (
                sortedTimesForSelectedDate.map((time) => (
                  <button key={time} type="button" onClick={() => onTimeSelect(time)} className={`w-full px-5 py-4 text-sm font-semibold rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      selectedTime === time
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg shadow-blue-500/30"
                        : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 cursor-pointer shadow-sm hover:shadow-md"
                    }`}>
                    {time}
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No available times for this date</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Please select a date first</p>
          )}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">All times shown are in Silicon Valley timezone (PST/PDT)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
