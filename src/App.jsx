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
import { DyeFormPage } from './pages/DyeFormPage'


import Footer from './components/footer/footer.jsx';
import HeadingSection from './components/heading-section'

function App() {
  return (
      <div className=" min-h-screen bg-repeat  w-full bg-center bg-auto"> 
        <div className=" top-5 w-full mt-5 ">
          <HeadingSection/>
          {/* <Navibar/>
        </div>
        <div className="pt-10 w-full">
          <Outlet /> */}
          <Footer />
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
          <Route path="apply" element={<DyeFormPage/>} />
          {/* <Route path="about" element={<AboutPage/>} /> */}
        </Route>
      </Routes>
    </Router>

    </ThemeProvider>

  )
}

export default AppWithRouter
