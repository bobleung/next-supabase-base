import { signup } from './actions'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <form className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label htmlFor="firstName" className="text-sm font-medium">First Name:</label>
            <input 
              id="firstName" 
              name="firstName" 
              type="text" 
              required 
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="lastName" className="text-sm font-medium">Last Name:</label>
            <input 
              id="lastName" 
              name="lastName" 
              type="text" 
              required 
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>
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
            formAction={signup}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Sign up
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
