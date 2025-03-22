import { signup } from './actions'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-card-header">Sign Up</h1>
        <form className="auth-form">
          <div className="auth-form-group">
            <label htmlFor="firstName" className="auth-label">First Name:</label>
            <input 
              id="firstName" 
              name="firstName" 
              type="text" 
              required 
              className="auth-input"
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="lastName" className="auth-label">Last Name:</label>
            <input 
              id="lastName" 
              name="lastName" 
              type="text" 
              required 
              className="auth-input"
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="email" className="auth-label">Email:</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="auth-input"
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="password" className="auth-label">Password:</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="auth-input"
              minLength={6}
            />
            <p className="auth-help-text">Password must be at least 6 characters long</p>
          </div>
          <button 
            formAction={signup}
            className="auth-button-primary"
          >
            Sign up
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="auth-link">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
