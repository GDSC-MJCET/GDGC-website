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


import LiquidEther from './components/LiquidEther.jsx';




import Footer from './components/footer/footer.jsx';
import HeadingSection from './components/heading-section'

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
      <div className="w-full mt-5" style={{ position: 'relative', zIndex: 1 }}>
        <HeadingSection />

        {/* <Navibar /> */}
        {/* <Outlet /> */}
        <Footer />
      </div>
    </div>
  );
}


function AppWithRouter() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          {/* <Route index element={<HomePage/>} /> */}
          <Route index element={<HiringPage/>} />
          <Route path="apply" element={<ClosedPage/>} />
          {/* <Route path="about" element={<AboutPage/>} /> */}
        </Route>
      </Routes>
    </Router>

    </ThemeProvider>

  )
}

export default AppWithRouter
