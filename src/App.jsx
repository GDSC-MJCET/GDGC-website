import { useState } from 'react'
import './App.css'
import {Navibar} from './components/Navbar'
import { HiringPage } from './pages/HiringPage'
import { ApplicationFormPage } from './pages/ApplicationFormPage'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import { ThemeProvider } from './components/theme-provider';
import ClosedPage from './pages/closedPage';
import { DyeFormPage1 } from './pages/DyeFormPage1'

function App() {
  return (
      <div className=" min-h-screen bg-repeat  w-full bg-center bg-auto"> 
        <div className=" top-5 w-full mt-5 ">
          <Navibar/>
        </div>
        <div className="pt-10 w-full">
          <Outlet />
        </div>
      </div>
  )
}

function AppWithRouter() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          {/* <Route index element={<HomePage/>} /> */}
          <Route index element={<HiringPage/>} />
          <Route path="apply" element={<DyeFormPage1/>} />
          {/* <Route path="about" element={<AboutPage/>} /> */}
        </Route>
      </Routes>
    </Router>

    </ThemeProvider>

  )
}

export default AppWithRouter
