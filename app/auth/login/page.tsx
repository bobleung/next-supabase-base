'use client'

import { useEffect, useState } from 'react'
import { login, LoginActionResult } from './actions'
import Link from 'next/link'

export default function LoginPage() {
  const [errors, setErrors] = useState<Record<string, string> | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Client action to handle form submission
  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setErrors(null)

    try {
      // Call the server action and handle response
      const result = await login(formData) as LoginActionResult
      
      if (!result.success && result.errors) {
        setErrors(result.errors)
      }
      // Successful submissions will redirect via the server action
    } catch (e) {
      setErrors({ _form: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Log In</h1>
        
        {/* Show form-level errors */}
        {errors?._form && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 mb-4 rounded">
            {errors._form}
          </div>
        )}
        
        <form action={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label htmlFor="email" className="text-sm font-medium">Email:</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className={`p-2 border ${errors?.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors?.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          
          <div className="flex flex-col space-y-1">
            <label htmlFor="password" className="text-sm font-medium">Password:</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className={`p-2 border ${errors?.password ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors?.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-blue-500 hover:text-blue-600">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}