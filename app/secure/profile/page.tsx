import { logout } from './actions'

export default function Profile() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-2">User information will be displayed here.</p>
        </div>
        
        <form action={logout}>
          <button 
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
          >
            Log Out
          </button>
        </form>
      </div>
    </div>
  );
}