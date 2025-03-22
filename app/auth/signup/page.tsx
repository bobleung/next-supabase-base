'use client'

import { useState, useRef } from 'react'
import { signup, SignupActionResult } from './actions'
import Link from 'next/link'
import { emailSchema, passwordSchema, signupSchema } from '@/utils/validation/auth'
import { z } from 'zod'

export default function SignupPage() {
  const [errors, setErrors] = useState<Record<string, string> | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Refs for form elements
  const formRef = useRef<HTMLFormElement>(null)
  const firstNameRef = useRef<HTMLInputElement>(null)
  const lastNameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  // Client-side validation function
  const validateField = (field: string, value: string): string | null => {
    try {
      switch (field) {
        case 'email':
          emailSchema.parse(value)
          break
        case 'password':
          passwordSchema.parse(value)
          break
        case 'firstName':
        case 'lastName':
          if (!value.trim()) {
            throw new Error(`${field === 'firstName' ? 'First' : 'Last'} name is required`)
          }
          break
      }
      return null
    } catch (error) {
      if (error instanceof z.ZodError && error.errors.length > 0) {
        return error.errors[0].message
      }
      return error instanceof Error ? error.message : 'Invalid input'
    }
  }

  // Handle input change for real-time validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Clear the specific error when the user starts typing
    if (errors && errors[name]) {
      setErrors(prev => {
        if (!prev) return null
        const newErrors = { ...prev }
        delete newErrors[name]
        return Object.keys(newErrors).length > 0 ? newErrors : null
      })
    }
    
    // Only validate when the field loses focus or if it already had an error
    if (e.target.dataset.validated === 'true') {
      const error = validateField(name, value)
      if (error) {
        setErrors(prev => ({ ...(prev || {}), [name]: error }))
      }
    }
  }

  // Handle input blur for validation
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    e.target.dataset.validated = 'true'
    
    const error = validateField(name, value)
    if (error) {
      setErrors(prev => ({ ...(prev || {}), [name]: error }))
    }
  }

  // Function to validate the entire form
  const validateForm = (formData: FormData): Record<string, string> | null => {
    const clientErrors: Record<string, string> = {}
    
    // Validate each field
    const fields = ['firstName', 'lastName', 'email', 'password']
    fields.forEach(field => {
      const value = formData.get(field) as string
      const error = validateField(field, value)
      if (error) clientErrors[field] = error
    })
    
    return Object.keys(clientErrors).length > 0 ? clientErrors : null
  }

  // Client action to handle form submission
  const handleSubmit = async (formData: FormData) => {
    // Validate all fields before submission
    const clientErrors = validateForm(formData)
    
    if (clientErrors) {
      setErrors(clientErrors)
      return
    }
    
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
        
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label htmlFor="firstName" className="text-sm font-medium">First Name:</label>
            <input 
              ref={firstNameRef}
              id="firstName" 
              name="firstName" 
              type="text" 
              required 
              className={`p-2 border ${errors?.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
            {errors?.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          
          <div className="flex flex-col space-y-1">
            <label htmlFor="lastName" className="text-sm font-medium">Last Name:</label>
            <input 
              ref={lastNameRef}
              id="lastName" 
              name="lastName" 
              type="text" 
              required 
              className={`p-2 border ${errors?.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
            {errors?.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
          
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