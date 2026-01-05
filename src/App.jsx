import { useState,useContext,createContext } from 'react'
import './App.css'
// import {Navibar} from './components/Navbar'
// import { HiringPage } from './pages/HiringPage'
// import { ApplicationFormPage } from './pages/ApplicationFormPage'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
// import HomePage from './pages/HomePage';
// import AboutPage from './pages/AboutPage';
import { ThemeProvider } from './components/theme-provider';
import gdg from "./assets/silkbg.png"
import LiquidEther from './components/LiquidEther.jsx';




import Footer from './components/footer/footer.jsx';
import HeadingSection from './components/heading-section'
import LoginPage from './pages/LoginPage.jsx'

import InitialSetup from './pages/InitialSetup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import QrChange from './pages/QrChange.jsx'
import Portfolio from './pages/Socials.jsx'
import SideBae from './components/SideBae.jsx'
import BlogWrite from './pages/BlogWrite.jsx'
import { Card, CardHeader } from './components/ui/card.jsx'
import BlogHome from './pages/BlogHomePage.jsx';
import WelcomeBlog from './pages/WelcomeBlogPage.jsx';
import { SpecificBlog } from './pages/SpecificBlogPage.jsx';
import BlogHelp from './pages/BlogHelp.jsx';
import BlogLand from './pages/BlogLand.jsx';
import { useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './context/AuthContext.js';
import Socials from './pages/Socials.jsx';
import { NavLink,useNavigate } from 'react-router-dom'


function App() {
  const [isVerified, setIsVerified] = useState(null);
  const auth = JSON.parse(localStorage.getItem("AuthState"));
  const nav = useNavigate();
  useEffect(() => {
  const verifyUser = async () => {
    try {
      const res = await axios.get(
        (import.meta.env.VITE_SERVER) +
          "/api/v1/dashboard/landing-page",
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      setIsVerified(res.data.success);
    } catch (err) {
      setIsVerified(false);
    }
  };
  verifyUser();
}, [auth?.token]);

  return (
    <div className=" min-h-screen w-full bg-black flex flex-col items-center justify-center px-4">
      <div className="fixed top-4 right-4 z-10">
        {isVerified ?
        <button className="border-none text-white px-2 py-1 shadow text-base md:text-lg hover:bg-white hover:text-black hover:border hover:rounded-xl" onClick={()=>{nav("/team/dashboard")}}>Dashboard</button>
        :<button className="border-none text-white px-2 py-1 shadow text-base md:text-lg hover:bg-white hover:text-black hover:border hover:rounded-xl" onClick={()=>{nav("/login")}}>Login</button>
        }
      </div>
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white">
          Coming Soon
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-md mx-auto">
          We're working on something exciting. Stay tuned!
        </p>
      </div>
    </div>
  );
}

function PopUpMenu({name , email}) {
  const {authState,setAuthState} = useContext(AuthContext)
  const nav = useNavigate()
  useEffect(()=>{
    localStorage.setItem("AuthState",JSON.stringify(authState))

  },[authState])
  
  const handleLogout = () => {
    setAuthState({token:" ",loggedIn:false})
    nav("/login")
  }
  
  const handleNavigate = (route) => {
    nav(route)
  }
  
  return (
    <div className="absolute right-7 top-11 lg:w-50 lg:h-60">
      <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-[#1E1E1E] shadow-lg p-2 text-sm text-gray-200">
        <div className="px-3 py-2">
          <p className="font-semibold">{name}</p>
          <p className="text-gray-400 text-xs">{email}</p>
        </div>

        <div onClick={()=>handleNavigate("/team/customization/qrchange")} className="mt-2 space-y-1 border-t pt-2">
          <MenuItem label="Change Qr"/>
          {/* <MenuItem label="New Team" /> */}
        </div>

        <div onClick={handleLogout} className="mt-2 border-t border-gray-700 pt-2">
          <MenuItem label="Log out"  danger  />
        </div>
      </div>
    </div>
  );
}
function MenuItem({ label, shortcut, active, danger }) {
  return (
    <div
      className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer 
      ${active ? "bg-gray-700" : "hover:bg-gray-700"} 
      ${danger ? "text-red-400 hover:bg-red-950 hover:text-red-300" : ""}`}
    >
      <span>{label}</span>
      {shortcut && <span className="text-xs text-gray-400">{shortcut}</span>}
    </div>
  );
}

function TeamLayout() {
  const [openPopup , setopenPopup] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userEmail , setUserEmail] = useState("")
  const [userName , setUserName] = useState("")
  const handleOpenPopup = () => {
    setopenPopup(!openPopup)
  }
  const auth =  JSON.parse(localStorage.getItem("AuthState"))

  const getDataAboutUser = async () => {
    console.log("this is the serer url and stuff")
      const response = await axios.get(import.meta.env.VITE_SERVER + '/api/v1/auth/about' , {headers:{
      Authorization: `Bearer ${auth?.token}`
      }})
    console.log(response , "this is the user response")
    setUserEmail(response.data.email)
    setUserName(response.data.name)
  }
  useEffect(()=>{
    console.log("Hello from use effect")
    getDataAboutUser()
  },[])
  return (
    <div className='relative noto-sans-mono flex flex-row h-screen overflow-hidden bg-background'>
        <SideBae isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className='flex-1 flex flex-col bg-background border-white overflow-hidden'>
            {/* this will be out nav bar with the account stuff and all */}
            <div className='flex h-15 items-center w-full justify-between px-5 flex-row p-2 border-b border-border text-foreground text-md flex-shrink-0'>
              {/* Hamburger menu button for mobile */}
              <button 
                onClick={() => setSidebarOpen(true)}
                className='md:hidden p-2 hover:bg-gray-800 rounded-lg'
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Spacer for desktop */}
              <div className='hidden md:block'></div>
              
              <span className='rounded-full bg-red-50 cursor-pointer'  onClick={handleOpenPopup}>
                <img src={gdg} className='h-9 w-9 rounded-full' alt="" />
              </span>
              {/* this is the popup component */}
              {openPopup && <PopUpMenu name={userName} email={userEmail}/>}
            </div>
            
            <div className='flex-1 overflow-y-auto'>
              <Outlet/>
            </div>
        </div>
    </div>
  )
}


function AppWithRouter() {
  const initialAuthContext={
    loggedIn:false,
    token:"nothing"
  }
  useEffect(()=>{
    const initLogged = JSON.parse(localStorage.getItem("AuthState"))
    if(initLogged && initLogged.loggedIn){
      setAuthState(initLogged)
    }
  },[])
  const [authState,setAuthState] = useState(initialAuthContext);
  
  return (
  
    <AuthContext.Provider value={{authState,setAuthState}}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

    <Router>
      <Routes>
        <Route path="/">
          {/* <Route index element={<HomePage/>} /> */}
          <Route index element={<App />} />
          {/* <Route path="apply" element={<DyeFormPage/>} /> */}
          <Route path='initialsetup/:id' element={<InitialSetup/>}/>
          <Route path="login" element={<LoginPage/>} />
          {/* <Route path="blog/welcome" element={<WelcomeBlog/>}/> */}
          

          <Route path='team' element={<TeamLayout/>}>
              <Route path='dashboard' element={<Dashboard/>} />
              {/* <Route path="blog/" element ={<BlogLand/>}>
            <Route path='home' element={<BlogHome/>} />
            <Route path="editor" element={<BlogWrite/>} />
            <Route path="posts/:postId" element={<SpecificBlog/>} />
            <Route path ="help" element = {<BlogHelp/>} />
            

          </Route> */}
              <Route path='customization' >
                <Route path='qrchange' element={<QrChange/>} />
                <Route path='socials' element={<Socials/>} />
              </Route>
          </Route>
          
        </Route>
      </Routes>
    </Router>

    </ThemeProvider>
    </AuthContext.Provider>
  
  )
}

export default AppWithRouter
