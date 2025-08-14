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
}

export function CalendarPicker({ selectedDate, selectedTime, onDateSelect, onTimeSelect }: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 7)) // August 2025

  const dateTimeMapping: { [key: string]: string[] } = {
    "8/16/2025": ["11:00 AM", "12:00 AM", "01:00 PM", "02:00 PM"],
    "8/17/2025": ["04:00 PM", "05:00 PM", "06:00 PM"],
  }

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

    const days = []

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
      const newMonth = new Date(prev)
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const formatDate = (day: number) => {
    const month = currentMonth.getMonth() + 1
    const year = currentMonth.getFullYear()
    return `${month}/${day}/${year}`
  }

  const isSelectedDate = (day: number) => {
    return selectedDate === formatDate(day)
  }

  const isDateAvailable = (day: number) => {
    const dateKey = formatDate(day)
    return dateTimeMapping.hasOwnProperty(dateKey)
  }

  const getAvailableTimesForDate = (date: string) => {
    return dateTimeMapping[date] || []
  }

  const days = getDaysInMonth(currentMonth)
  const availableTimesForSelectedDate = getAvailableTimesForDate(selectedDate)

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Select Date & Time</h3>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Section */}
        <div className="lg:col-span-2">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={(e) => navigateMonth("prev", e)}
              className="p-3 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-all duration-200"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h4 className="text-xl font-bold text-gray-800">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h4>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={(e) => navigateMonth("next", e)}
              className="p-3 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-all duration-200"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-gray-500 py-3">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
              <div key={index} className="aspect-square flex items-center justify-center">
                {day && (
                  <button
                    type="button"
                    onClick={() => {
                      if (isDateAvailable(day)) {
                        onDateSelect(formatDate(day))
                        onTimeSelect("") // Clear time when selecting a new date
                      }
                    }}
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
              {availableTimesForSelectedDate.length > 0 ? (
                availableTimesForSelectedDate.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => onTimeSelect(time)}
                    className={`w-full px-5 py-4 text-sm font-semibold rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      selectedTime === time
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg shadow-blue-500/30"
                        : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 cursor-pointer shadow-sm hover:shadow-md"
                    }`}
                  >
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

          {/* Timezone Note */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              All times shown are in Silicon Valley timezone (PST/PDT)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
