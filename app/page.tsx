"use client"

import { useState } from 'react'

interface HomePageProps {
  searchParams: { success?: string; error?: string }
}

export default function Home({ searchParams }: HomePageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [aiProcessing, setAiProcessing] = useState(false)
  const showSuccess = searchParams.success === 'true'
  const showError = searchParams.error === 'true'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Application</h1>
        <p className="text-gray-600">Please fill out the form below to apply for a position.</p>
      </div>

      {/* AI Processing Message */}
      {aiProcessing && (
        <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg className="animate-spin w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="font-medium">AI Analysis in Progress...</span>
          </div>
          <p className="mt-1 text-sm">Our AI is analyzing your resume against all job openings. This may take a few moments.</p>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Application submitted successfully!</span>
          </div>
          <p className="mt-1 text-sm">Thank you for your application. AI matching has been completed and your profile is now visible to recruiters.</p>
        </div>
      )}

      {/* Error Message */}
      {showError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Failed to submit application</span>
          </div>
          <p className="mt-1 text-sm">Please try again or contact support if the problem persists.</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="bg-blue-50 px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-blue-900">Personal Information</h2>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setIsSubmitting(true)
            setAiProcessing(true)

            const formData = new FormData(e.target as HTMLFormElement)

            try {
              const response = await fetch('/api/applications', {
                method: 'POST',
                body: formData
              })

              if (response.ok) {
                setAiProcessing(false)
                window.location.href = '/?success=true'
              } else {
                setAiProcessing(false)
                window.location.href = '/?error=true'
              }
            } catch (error) {
              setAiProcessing(false)
              window.location.href = '/?error=true'
            } finally {
              setIsSubmitting(false)
            }
          }}
          className="p-6"
        >
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your last name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-8">
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                Resume *
              </label>
              <textarea
                id="resume"
                name="resume"
                rows={8}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please provide your work experience, education, skills, and any other relevant information..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter your resume details including work experience, education, and skills
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={isSubmitting || aiProcessing}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting || aiProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {aiProcessing ? 'AI Analyzing Resume...' : 'Submitting...'}
                </>
              ) : (
                'Submit Application'
              )}
            </button>
            <button
              type="reset"
              disabled={isSubmitting || aiProcessing}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
