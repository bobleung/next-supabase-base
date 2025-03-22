import { login } from './actions'
import Link from 'next/link'
import { getCsrfFormField } from '@/utils/csrf'

export default async function LoginPage() {
  // Get CSRF token
  const csrfField = await getCsrfFormField();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Log In</h1>
        <form className="space-y-4">
          {/* Hidden CSRF token field */}
          <input 
            type="hidden" 
            name={csrfField.name} 
            value={csrfField.value}
          />
          
          <div className="flex flex-col space-y-1">
            <label htmlFor="email" className="text-sm font-medium">Email:</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="password" className="text-sm font-medium">Password:</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button 
            formAction={login}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Log in
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