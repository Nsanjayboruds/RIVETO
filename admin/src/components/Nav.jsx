import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import logo from '../assets/logof.png'
import axios from 'axios'
import { authDataContext } from '../Context/AuthProvider'
import { adminDataContext } from '../Context/AdminProvider'

function Nav() {
  let navigate = useNavigate()
  let { serverUrl } = useContext(authDataContext)
  let { getAdmin } = useContext(adminDataContext)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const logout = async () => {
    setIsLoggingOut(true)
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true
      })
      console.log(result.data)
      getAdmin() // refresh admin context
      navigate("/login")
    } catch (error) {
      console.log(error)
      setIsLoggingOut(false)
    }
  }

  return (
    <div className='w-full h-16 bg-white z-50 fixed top-0 flex items-center justify-between px-6 md:px-8 shadow-md shadow-gray-200'>
      <div 
        className='flex items-center justify-start gap-3 cursor-pointer transition-transform hover:scale-105' 
        onClick={() => navigate("/")}
      >
        {/* <img src={logo} alt="Riveto Logo" className='h-10 w-auto' /> */}
        <h1 className='text-2xl font-bold text-gray-800 font-sans'>Riveto</h1>
      </div>

      <button 
        className={`text-sm font-medium py-2 px-5 rounded-full transition-all duration-300 flex items-center justify-center
          ${isLoggingOut 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
        onClick={logout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            LOGGING OUT...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            LOGOUT
          </>
        )}
      </button>
    </div>
  )
}

export default Nav