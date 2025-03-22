'use client'

import { useState, useRef, useEffect } from 'react'
import { deleteAccount } from './actions'

const CONFIRMATION_TEXT = "DELETE MY ACCOUNT"

type DeleteAccountModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function DeleteAccountModal({
  isOpen,
  onClose
}: DeleteAccountModalProps) {
  const [password, setPassword] = useState('')
  const [confirmationText, setConfirmationText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  
  const isConfirmationValid = confirmationText === CONFIRMATION_TEXT

  useEffect(() => {
    // Handle ESC key to close modal
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    
    // Handle clicking outside the modal
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.removeEventListener('mousedown', handleOutsideClick)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleDeleteAccount = async (formData: FormData) => {
    setError(null)
    setIsLoading(true)
    
    // Ensure the confirmation text is submitted with the form
    formData.append('confirmation-text', confirmationText);
    
    try {
      const result = await deleteAccount(formData)
      
      if ('error' in result) {
        setError(result.error)
        setIsLoading(false)
      }
      // If successful, redirect happens in the server action
    } catch (err) {
      setError('An unexpected error occurred')
      setIsLoading(false)
      console.error('Error deleting account:', err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-red-600 mb-4">Delete Account</h2>
        
        <div className="mb-6 space-y-2">
          <p className="text-gray-700">
            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
          </p>
          <p className="text-gray-700 font-semibold">
            Please enter your password to confirm.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form action={handleDeleteAccount} className="space-y-4">
          <div>
            <label htmlFor="confirmation-text" className="block text-sm font-medium text-gray-700 mb-1">
              To confirm deletion, type <span className="font-bold">DELETE MY ACCOUNT</span>
            </label>
            <input
              id="confirmation-text"
              name="confirmation-text"
              type="text"
              required
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
                ${!confirmationText ? 'border-gray-300' : 
                  isConfirmationValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}
              placeholder="Type DELETE MY ACCOUNT"
            />
            {confirmationText && !isConfirmationValid && (
              <p className="mt-1 text-sm text-red-600">
                Please type exactly "DELETE MY ACCOUNT" (case sensitive)
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your password"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !password || !isConfirmationValid}
              className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                (isLoading || !password || !isConfirmationValid) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Deleting...' : 'Delete My Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
