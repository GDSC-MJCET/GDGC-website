import { useState,useEffect } from 'react'
import { NavLink,useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
const Socials = () => {
  const [checkingAuth,setCheckingAuth] = useState(true)
  const nav = useNavigate()
  const server = import.meta.env.VITE_SERVER
  const auth = JSON.parse(localStorage.getItem("AuthState"))
  useEffect(() => {
    if (!auth?.token) {
    nav("/login");
    return;
  }
  axios
    .get(`${server}/api/v1/auth/simple-verify`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })
    .then((res) => {
      if (!res.data.success){
        nav("/login")
      }
      else if(res.data.success){
        setCheckingAuth(false)
      }
    })
    .catch((err) => {
      nav("/login")
    });
}, [auth?.token]);
if(checkingAuth){
    return <div className="bg-black"></div>
}
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