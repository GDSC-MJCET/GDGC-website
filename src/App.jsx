import { useState,useContext } from 'react'
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
import ForgotPassword from './pages/ForgotPassword.jsx';
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
import ChangePassword from './pages/ChangePassword.jsx';
import HomePage from './pages/HomePage.jsx';
import TechDebatePage from './pages/TechDebatePage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import TeamPage from './pages/TeamPage.jsx';
import GalleryPage from './pages/GalleryPage.jsx';
import ContactUsPage from './pages/ContactUsPage.jsx';
import NotFound from './pages/NotFound.jsx';
import SuperAdminDashboard from './pages/SuperAdminDashboard.jsx';
import SuperAdminUsers from './pages/SuperAdminUsers.jsx';
import BlogPosts from './pages/BlogPosts.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import ScorePage from './pages/ScorePage.jsx';
import HrInterface from './pages/HrInterface.jsx';
import HrControlInterface from './pages/HrControlInterface.jsx';
import TDForm from './pages/TDForm.jsx';
import { Navigate } from 'react-router-dom';

function App() {
  const [isVerified, setIsVerified] = useState(null);
  const auth = JSON.parse(localStorage.getItem("AuthState"));
  const nav = useNavigate();
  useEffect(() => {
  const verifyUser = async () => {
    try {
      const res = await axios.get(
        (import.meta.env.VITE_SERVER) +
          "/api/v1/auth/simple-verify",
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      setIsVerified(res.data.success);
    } catch {
      setIsVerified(false);
    }
  };
  verifyUser();
}, [auth?.token]);
  if(isVerified==null){
    return <div className='bg-black'></div>
  }

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

function PopUpMenu({name , email,closePopup}) {
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
    closePopup()
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
        <div onClick={()=>handleNavigate("/team/customization/changepassword")} className="mt-2 space-y-1 border-t pt-2">
          <MenuItem label="Change Password"/>
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
      const response = await axios.get(import.meta.env.VITE_SERVER + '/api/v1/dashboard/get-dashboard' , {headers:{
      Authorization: `Bearer ${auth?.token}`
      }})
    setUserEmail(response.data.user.email)
    setUserName(response.data.user.name)
  }
  useEffect(()=>{
    getDataAboutUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              {openPopup && <PopUpMenu name={userName} email={userEmail} closePopup={() => setopenPopup(false)}/>}
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
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="initialsetup/:id" element={<InitialSetup />} />
            <Route path="techfaceoff" element={<TechDebatePage />} />
            <Route path='score' element={<ScorePage/>}/>
            <Route path="events" element={<EventsPage />} />
            <Route path="team-page" element={<TeamPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="contact" element={<ContactUsPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="forgotpassword" element={<ForgotPassword />} />
            <Route path='techdebate/form' element={<TDForm/>}/>

            {/* Team area (layout route) */}
            <Route path="team" element={<TeamLayout />}>
              {/* <Route path="hr-interface" element={<HrInterface/>}/>
              <Route path="hr-control" element={<HrControlInterface/>}/> */}
              <Route index element={<Navigate to="/*"/>} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="customization">
                <Route path="qrchange" element={<QrChange />} />
                <Route path="socials" element={<Socials />} />
                <Route path="changepassword" element={<ChangePassword />} />
              </Route>

              <Route path="admin">
                <Route path="users" element={<AdminUsers />} />
                <Route path="hr-interface" element={<HrInterface/>}/>
              </Route>

              <Route path="superadmin">
                <Route index element={<SuperAdminDashboard />} />
                <Route path="users" element={<SuperAdminUsers />} />
              </Route>
            </Route>

            {/* Blog routes (optional, currently unused)
            <Route path="blog" element={<BlogLand />}>
              <Route path="home" element={<BlogHome />} />
              <Route path="editor" element={<BlogWrite />} />
              <Route path="posts" element={<BlogPosts />} />
              <Route path="posts/:postId" element={<SpecificBlog />} />
              <Route path="help" element={<BlogHelp />} />
            </Route>
            */}

            {/* Catch-all 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthContext.Provider>
  )
}

export default AppWithRouter
