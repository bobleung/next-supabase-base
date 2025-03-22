'use client'

import { useEffect, useState } from 'react'
import { signup, SignupActionResult } from './actions'
import Link from 'next/link'

export default function SignupPage() {
  const [errors, setErrors] = useState<Record<string, string> | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Client action to handle form submission
  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setErrors(null)

    try {
      // Call the server action and handle response
      const result = await signup(formData) as SignupActionResult
      
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
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        
        {/* Show form-level errors */}
        {errors?._form && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 mb-4 rounded">
            {errors._form}
          </div>
        )}
        
        <form action={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label htmlFor="firstName" className="text-sm font-medium">First Name:</label>
            <input 
              id="firstName" 
              name="firstName" 
              type="text" 
              required 
              className={`p-2 border ${errors?.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors?.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          
          <div className="flex flex-col space-y-1">
            <label htmlFor="lastName" className="text-sm font-medium">Last Name:</label>
            <input 
              id="lastName" 
              name="lastName" 
              type="text" 
              required 
              className={`p-2 border ${errors?.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors?.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
          
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
              minLength={6}
            />
            <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
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
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-500 hover:text-blue-600">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}