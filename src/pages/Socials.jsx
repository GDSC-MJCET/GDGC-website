import React from 'react'
import { NavLink } from 'react-router-dom'

const Socials = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Socials
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Coming Soon
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>In Development</span>
        </div>
        <div className="pt-6 flex flex-col items-center">
          <p className="text-gray-500 text-sm mb-3">
            Until then, you can manage your QR redirection
          </p>
          <NavLink 
            to="/team/customization/qrchange" 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Change QR Redirect
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Socials