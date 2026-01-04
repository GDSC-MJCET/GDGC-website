import { useState,useContext,createContext } from 'react'
import './App.css'
// import {Navibar} from './components/Navbar'
// import { HiringPage } from './pages/HiringPage'
// import { ApplicationFormPage } from './pages/ApplicationFormPage'
import { BrowserRouter as Router, Routes, Route, Outlet, useNavigate } from 'react-router-dom';
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
import Portfolio from './pages/Portfolio.jsx'
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


function App() {
  return (
    <div className="min-h-screen w-full" style={{ position: 'relative' }}>
      {/* Background canvas */}
      <LiquidEther
        colors={['#5227FF', '#FF9FFC', '#84db9f']}
        mouseForce={20}
        cursorSize={100}
        isViscous={false}
        viscous={30}
        iterationsViscous={32}
        iterationsPoisson={32}
        resolution={0.5}
        isBounce={false}
        autoDemo={true}
        autoSpeed={0.5}
        autoIntensity={2.2}
        takeoverDuration={0.25}
        autoResumeDelay={3000}
        autoRampDuration={0.6}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />

      {/* Foreground content */}
      <div className="w-full " style={{ position: 'relative', zIndex: 1 }}>
        <HeadingSection />
        {/* <Navibar /> */}
        {/* <Outlet /> */}
        <Footer />
      </div>
    </div>
  );
}

function PopUpMenu() {
  const {authState,setAuthState} = useContext(AuthContext)
  const nav = useNavigate()
  useEffect(()=>{
    localStorage.setItem("AuthState",JSON.stringify(authState))

  },[authState])
  const handleLogout = () =>{
    setAuthState({token:" ",loggedIn:false})
    nav("/login")
  }
  return (
    <div className="absolute right-7 top-11 lg:w-50 lg:h-60">
      <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-[#1E1E1E] shadow-lg p-2 text-sm text-gray-200">
        <div className="px-3 py-2">
          <p className="font-semibold">shadcn</p>
          <p className="text-gray-400 text-xs">m@example.com</p>
        </div>

        <div className="mt-2 space-y-1 border-t pt-2">
          <MenuItem label="Portfolio" shortcut="⌘S" />
          {/* <MenuItem label="New Team" /> */}
        </div>

        <div onClick={handleLogout} className="mt-2 border-t border-gray-700 pt-2">
          <MenuItem label="Log out" shortcut="⌘Q" danger  />
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
  const handleOpenPopup = () => {
    console.log("This is the boommmmm")
    setopenPopup(!openPopup)
  }
  return (
    <div className='relative noto-sans-mono flex flex-row'>
        <SideBae />
        <div className='h-screen w-full bg-black  border-white'>
            {/* this will be out nav bar with the account stuff and all */}
            <div className='flex h-15 items-end w-full justify-end px-5 flex-row p-2 border-b bottom-1border-stone-700 text-black text-md'>
              {/* we have very little height here  */}
              <p>lolo</p>
              <span className='rounded-full bg-red-50 cursor-pointer'  onClick={handleOpenPopup}>
                <img src={gdg} className='h-9 w-9 rounded-full' alt="" />
              </span>
              {/* this is the popup component */}
              {openPopup && <PopUpMenu/>}
            </div>
            
            <Outlet/>
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
                {/* <Route path='portfolio' element={<Portfolio/>} /> */}
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
