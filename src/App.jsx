import { useState } from 'react'
import './App.css'
import {Navibar} from './components/Navbar'
import { HiringPage } from './pages/HiringPage'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import { ThemeProvider } from './components/theme-provider';

function App() {
  return (
      <div className="min-h-screen bg-repeat min-w-full bg-center bg-auto"> 
        <div className="fixed top-5 left-0 w-full z-50">
          <Navibar/>
        </div>
        <div className="pt-20">
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
          <Route index element={<HomePage/>} />
          <Route path="hiring" element={<HiringPage/>} />
          <Route path="about" element={<AboutPage/>} />
        </Route>
      </Routes>
    </Router>

    </ThemeProvider>

  )
}

export default AppWithRouter
