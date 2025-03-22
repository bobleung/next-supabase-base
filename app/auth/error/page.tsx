'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const errorMessage = searchParams.get('message')
  
  // Convert error message to user-friendly text
  let displayMessage = 'Sorry, something went wrong with authentication.'
  
  if (errorMessage === 'invalid_request') {
    displayMessage = 'Invalid request. Please try again from the login page.'
  } else if (errorMessage === 'invalid_credentials') {
    displayMessage = 'Invalid email or password. Please try again.'
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-red-600">Authentication Error</h1>
        <p className="text-center mb-6">{displayMessage}</p>
        <div className="flex justify-center">
          <Link 
            href="/auth/login" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  )
}