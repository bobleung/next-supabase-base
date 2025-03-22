'use client'

import { useState, useRef, useEffect } from 'react'
import { login, LoginActionResult } from './actions'
import Link from 'next/link'
import { emailSchema, passwordSchema } from '@/utils/validation/auth'
import { z } from 'zod'

export default function LoginPage() {
  const [errors, setErrors] = useState<Record<string, string> | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Refs for form elements
  const formRef = useRef<HTMLFormElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  // Client-side validation function
  const validateField = (field: string, value: string): string | null => {
    try {
      if (field === 'email') {
        emailSchema.parse(value)
      } else if (field === 'password') {
        passwordSchema.parse(value)
      }
      return null
    } catch (error) {
      if (error instanceof z.ZodError && error.errors.length > 0) {
        return error.errors[0].message
      }
      return 'Invalid input'
    }
  }

  // Handle input change for real-time validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Clear the specific error when the user starts typing
    if (errors && errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return Object.keys(newErrors).length > 0 ? newErrors : null
      })
    }
    
    // Only validate when the field loses focus or if it already had an error
    if (e.target.dataset.validated === 'true') {
      const error = validateField(name, value)
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }))
      }
    }
  }

  // Handle input blur for validation
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    e.target.dataset.validated = 'true'
    
    const error = validateField(name, value)
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  // Client action to handle form submission
  const handleSubmit = async (formData: FormData) => {
    // Validate all fields before submission
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    const clientErrors: Record<string, string> = {}
    
    const emailError = validateField('email', email)
    if (emailError) clientErrors.email = emailError
    
    const passwordError = validateField('password', password)
    if (passwordError) clientErrors.password = passwordError
    
    // If there are client-side validation errors, don't submit
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      return
    }
    
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
        
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label htmlFor="email" className="text-sm font-medium">Email:</label>
            <input 
              ref={emailRef}
              id="email" 
              name="email" 
              type="email" 
              required 
              className={`p-2 border ${errors?.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
            {errors?.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          
          <div className="flex flex-col space-y-1">
            <label htmlFor="password" className="text-sm font-medium">Password:</label>
            <input 
              ref={passwordRef}
              id="password" 
              name="password" 
              type="password" 
              required 
              className={`p-2 border ${errors?.password ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
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