"use client"
import Image from "next/image"
import type React from "react"

import { useState,useEffect } from "react"

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-[#1a2b4d] text-slate-200 scroll-smooth">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        // style={{
        //   backgroundImage:
        //     "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-H3z1E0pXONaInVX8B9QLf50IkriJh7.png')",
        // }}
      />

      <div className="relative z-10 min-h-screen">
        <BannerSection />

        <main className="relative">
          <HeroSection />
          <VideoSection />
          <WebinarSection />
          <TestimonialsSection />
          <FooterSection />
        </main>
      </div>
    </div>
  )
}

function BannerSection() {
  return (
    <section className="w-full h-[30vh] relative overflow-hidden">
      <Image
        src="/images/acharya-banner.png"
        alt="Acharya Educational Services"
        fill
       className="object-cover [object-position:50%_30%]"
        priority
      />
    </section>
  )
}

function HeroSection() {
  return (
    <section className="w-full py-6 md:py-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <div className="animate-fade-in-up space-y-5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            <span className="text-white font-black">U</span>
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent font-black">
              ACHIEVE
            </span>
          </h1>

          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-300 mb-4 mx-auto leading-tight font-sans px-4">
            Turn Your Dreams Into{" "}
            <span className="text-transparent bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text">
              Acceptance
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base md:text-lg lg:text-xl max-w-7xl mx-auto leading-relaxed font-light px-4">
            A guided journey of self-discovery and strategic planning to unlock your true potential and gain
            admission to your dream college.
          </p>
        </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl mx-auto mt-6">
            <div
              className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-slate-400 text-xs">Customize Roadmap</p>
                  <p className="text-white text-lg font-bold">Profile Enrichment</p>
                </div>
              </div>
            </div>

            <div
              className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-slate-400 text-xs">Essay revisions</p>
                  <p className="text-white text-lg font-bold">Unlimited</p>
                </div>
              </div>
            </div>

            <div
              className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-slate-400 text-xs">Mentor check-ins</p>
                  <p className="text-white text-lg font-bold">Weekly</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

function VideoSection() {
  const scrollToForm = () => {
    const formSection = document.getElementById("webinar-form")
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" })
    }
  }
  const [isJumping, setIsJumping] = useState(true)
   useEffect(() => {
    const timer = setTimeout(() => {
      setIsJumping(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="w-full relative py-8">
      <div className="container mx-auto px-4 space-y-4">
      <div className="flex justify-center">
          <button
            onClick={scrollToForm}
            className={`relative group bg-[#00ff00] hover:bg-[#33ff33] text-black font-bold px-8 py-4 rounded-full text-sm transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_#00ff00] hover:shadow-[0_0_30px_#00ff00] border border-[#00ff00] ${
              isJumping ? "animate-bounce" : ""
            }`}
          >
            <span className="relative z-10 inline-flex items-center gap-2 font-bold">
              Book Free 60 Min Session - Limited Seats!
              <span className="text-lg">🎓</span>
            </span>

            <div className="absolute inset-0 rounded-full bg-[#00ff00]/30 opacity-75 group-hover:opacity-100 blur-lg transition-all duration-300 -z-10" />

            <div className="absolute inset-0 -m-2 rounded-full bg-[#00ff00]/20 animate-ping opacity-75 -z-20" />
          </button>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-1">
            <video
              className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-xl shadow-2xl border-2 border-slate-600/50"
              autoPlay
              loop
              playsInline
              muted
              controls
            >
              <source src="/video/video1.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  )
}

function WebinarSection() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    studentName: "",
    grade: "",
    schoolName: "",
    programInterested: "College Prep", // Default to College Prep as required
    selectedDay: "",
    selectedTime: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          parentName: formData.parentName,
          parentEmail: formData.parentEmail,
          parentContact: formData.parentPhone,
          studentName: formData.studentName,
          studentGrade: formData.grade,
          schoolName: formData.schoolName,
          program: formData.programInterested,
          preferredTime: `${formData.selectedDay} at ${formData.selectedTime}`,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setShowSuccessModal(true)
        setTimeout(() => {
          setShowSuccessModal(false)
          setCurrentStep(1)
          setFormData({
            email: "",
            parentName: "",
            parentEmail: "",
            parentPhone: "",
            studentName: "",
            grade: "",
            schoolName: "",
            programInterested: "College Prep",
            selectedDay: "",
            selectedTime: "",
          })
        }, 10000)
      } else {
        alert(result.error || "Registration failed. Please try again.")
      }
    } catch (error) {
      console.error("Submission error:", error)
      alert("Network error. Please check your connection and try again.")
    }

    setIsSubmitting(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const nextStep = () => setCurrentStep(2)
  const prevStep = () => setCurrentStep(1)

  const canProceedStep1 =
    formData.email &&
    formData.parentName &&
    formData.parentEmail &&
    formData.parentPhone &&
    formData.studentName &&
    formData.grade &&
    formData.schoolName
  const canSubmit = canProceedStep1 && formData.selectedDay && formData.selectedTime

  return (
    <section id="webinar-form" className="w-full py-16 relative overflow-hidden">
      <style jsx global>{`
        @keyframes scale-up {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-amber-300/50 shadow-2xl">
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-4">
                {[1, 2].map((step) => (
                  <div
                    key={step}
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                      step <= currentStep
                        ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black"
                        : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 2) * 100}%` }}
                />
              </div>
            </div>

            {showSuccessModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl p-4 sm:p-8 max-w-md mx-4 relative animate-[scale-up_0.3s_ease-out] w-[90%] sm:w-auto">
                  <div className="text-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                      Registration Successful!
                    </h3>
                    <div className="my-4 sm:my-6">
                      <span className="text-5xl sm:text-6xl">🎓</span>
                    </div>
                    <p className="text-gray-600 mb-6">
                      Thank you for your interest! We will review your application and contact you shortly.
                    </p>
                    <div className="space-y-2 text-left bg-blue-50 p-4 rounded-lg">
                      <p className="text-blue-800 flex items-center gap-2">
                        <span className="text-lg">📅</span> Requested for {formData.selectedDay} at {formData.selectedTime}
                      </p>
                      <p className="text-blue-800 flex items-center gap-2">
                        <span className="text-lg">📞</span> Our team will contact you soon
                      </p>
                    </div>
                    <div className="mt-6">
                      <span className="inline-block px-4 py-2 bg-[#00ff00]/10 text-[#00aa00] rounded-full text-sm animate-pulse">
                        Redirecting in a few seconds...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Webinar Registration</h3>
                    <p className="text-slate-600">Please fill in the required information</p>
                  </div>

                 

                  <div>
                    <label className="block text-slate-800 font-medium mb-2">Parent&apos;s Name *</label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-amber-300 rounded-lg text-slate-800 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/30 shadow-sm"
                      placeholder="Parent&apos;s full name"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-medium mb-2">Parent&apos;s Email *</label>
                    <input
                      type="email"
                      name="parentEmail"
                      value={formData.parentEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-amber-300 rounded-lg text-slate-800 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/30 shadow-sm"
                      placeholder="parent.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-medium mb-2">Parent&apos;s Contact Number *</label>
                    <input
                      type="tel"
                      name="parentPhone"
                      value={formData.parentPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-amber-300 rounded-lg text-slate-800 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/30 shadow-sm"
                      placeholder="(209) 920-7147"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-medium mb-2">Student&apos;s Name *</label>
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-amber-300 rounded-lg text-slate-800 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/30 shadow-sm"
                      placeholder="Student&apos;s full name"
                    />
                  </div>

                   <div>
                    <label className="block text-slate-800 font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-amber-300 rounded-lg text-slate-800 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/30 shadow-sm"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-medium mb-2">Grade *</label>
                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-amber-300 rounded-lg text-slate-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/30 shadow-sm"
                    >
                      <option value="">Select grade</option>
                      <option value="9th Grade">7th Grade</option>
                      <option value="9th Grade">8th Grade</option>
                      <option value="9th Grade">9th Grade</option>
                      <option value="10th Grade">10th Grade</option>
                      <option value="11th Grade">11th Grade</option>
                      <option value="12th Grade">12th Grade</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-medium mb-2">School&apos;s Name *</label>
                    <input
                      type="text"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-amber-300 rounded-lg text-slate-800 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/30 shadow-sm"
                      placeholder="Name of student&apos;s school"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!canProceedStep1}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Program & Schedule</h3>
                    <p className="text-slate-600">Select your program and preferred time</p>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-medium mb-2">Programs Interested In *</label>
                    <select
                      name="programInterested"
                      value={formData.programInterested}
                      onChange={handleInputChange}
                      required
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed shadow-sm"
                    >
                      <option value="College Prep">College Prep</option>
                    </select>
                    <p className="text-slate-500 text-sm mt-1">College Prep program is required for all students</p>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-medium mb-2">Choose a day *</label>
                    <div className="grid grid-cols-2 gap-4">
                      {["Saturday", "Sunday"].map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, selectedDay: day }))}
                          className={`px-6 py-4 rounded-lg font-medium transition-all duration-200 ${
                            formData.selectedDay === day
                              ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black"
                              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-medium mb-2">Select a time *</label>
                    <div className="grid grid-cols-2 gap-4">
                      {["11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM"].map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, selectedTime: time }))}
                          className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                            formData.selectedTime === time
                              ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black"
                              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-100/50 p-4 rounded-lg border border-amber-200">
                    <p className="text-slate-700 text-sm">
                      I understand that the material shown in the event is copyrighted to ACHARYA. (Any screenshots or
                      pictures of the material is a violation) *
                    </p>
                    <p className="text-amber-700 text-sm mt-2 font-medium">We&apos;ll confirm within 24 hours.</p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !canSubmit}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? "Submitting..." : "Book now"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      name: "Sarah Chen",
      grade: "12th Grade",
      college: "Stanford University",
      text: "Acharya&apos;s college prep program transformed my application. The personalized essay guidance and SAT prep helped me increase my score by 200 points. I got into my dream school!",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      grade: "11th Grade",
      college: "MIT",
      text: "The mentorship program is incredible. My mentor helped me discover my passion for engineering and guided me through building a portfolio that stood out to admissions officers.",
      rating: 5,
    },
    {
      name: "Emily Johnson",
      grade: "12th Grade",
      college: "Harvard University",
      text: "I was struggling with my personal statement until I joined Acharya. The unlimited essay revisions and expert feedback made all the difference. Highly recommend!",
      rating: 5,
    },
    {
      name: "David Park",
      grade: "12th Grade",
      college: "UC Berkeley",
      text: "The weekly check-ins kept me on track throughout the entire application process. The structured approach and timeline management were game-changers for me.",
      rating: 5,
    },
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }
  
  const scrollToForm = () => {
    const formSection = document.getElementById("webinar-form")
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    
    <section className="w-full py-16">
    <div className="container mx-auto px-4 flex justify-center mb-6 z-10">
    <button
      onClick={scrollToForm}
      className="relative group bg-[#00ff00] hover:bg-[#33ff33] text-white font-bold py-3 sm:py-3.5 px-4 sm:px-8 rounded-full text-xs sm:text-sm 
        transition-all duration-300 transform hover:scale-105
        animate-[bounce_1s_ease-in-out_infinite] hover:animate-none
        border border-[#00ff00] shadow-[0_0_15px_#00ff00,0_0_30px_#00ff00]
        before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-[#00ff00]/30 before:animate-[ping_2s_ease-in-out_infinite]
        w-[90%] sm:w-auto"
    >
      <span className="relative z-10 inline-flex items-center mix-blend-difference">
        Book Free 60 Min Session - Limited Seats!
        <span className="ml-1 animate-[pulse_1.5s_ease-in-out_infinite]">🎓</span>
      </span>
      <div className="absolute inset-0 -m-1 bg-gradient-to-r from-[#00ff00] via-[#33ff33] to-[#00ff00] rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-all duration-300"></div>
    </button>
  </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">What Our Students Say</h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Real success stories from students who achieved their college dreams
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 min-h-[300px] flex items-center">
            <div className="w-full text-center">
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="text-xl md:text-2xl text-slate-200 mb-6 leading-relaxed">
                &ldquo;{testimonials[currentTestimonial].text}&rdquo;
              </blockquote>

              <div className="space-y-2">
                <p className="text-amber-400 font-bold text-lg">{testimonials[currentTestimonial].name}</p>
                <p className="text-slate-300">
                  {testimonials[currentTestimonial].grade} • Accepted to {testimonials[currentTestimonial].college}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-slate-700/80 hover:bg-slate-600 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-slate-700/80 hover:bg-slate-600 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial ? "bg-amber-400 scale-125" : "bg-slate-600 hover:bg-slate-500"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FooterSection() {
  return (
    <footer className="bg-slate-900 py-8 px-4 text-center border-t border-slate-700">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm">
          <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
            Privacy Policy
          </a>
          <span className="text-slate-500">|</span>
          <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
            Terms &amp; Conditions
          </a>
        </div>
        <div className="text-xs text-slate-400 space-y-2">
          <p>Copyright 2024 - New York, New York, NY, All Rights Reserved</p>
          <p>
            This site is not a part of the Facebook website or Facebook Inc. Additionally, This site is NOT endorsed by
            Facebook in any way.
          </p>
          <p>FACEBOOK is a trademark of FACEBOOK, Inc.</p>
        </div>
      </div>
    </footer>
  )
}
