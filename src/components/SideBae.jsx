import { IconArticle, IconBrandLine } from '@tabler/icons-react'
import { ChevronDown, ChevronUp, Settings2, X } from 'lucide-react'
import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import gdg from "../assets/gdg-logo.png" 

const SettingSubPanel = ({handleClickRedirect , clicked}) => {
    return (
        <div className='text-[12px] flex flex-col gap-2 pl-6 pt-2'>
            {/* <span onClick={()=>handleClickRedirect("dash","/team/dashboard" )} className={`flex ${clicked == "dash" ? "bg-white text-black" : ""} p-2 rounded-md flex-row cursor-pointer gap-2 items-center`}> */}

            <span onClick={()=>handleClickRedirect("Qr","/team/customization/qrchange" )} className={`${clicked == "Qr" ? "bg-white text-black rounded-md" : ""} flex flex-row  gap-2 items-center`}>
                {/* <Settings2 className='w-4'/> */}
                <Link to="/team/customization/qrchange" className={` py-1 px-3 w-full rounded-md`} >Change Qr </Link> 
                {/* <ChevronUp onClick={handleClickSetting} className='w-4'/> */}
            </span>
            <span onClick={()=>handleClickRedirect("socials","/team/customization/socials" )} className={`${clicked == "socials" ? "bg-white text-black rounded-md" : ""} flex flex-row gap-2 items-center`}>
                {/* <Settings2 className='w-4'/> */}
                <Link to="/team/customization/socials" className=' py-1 px-3 w-full rounded-md' >Socials</Link> 
                {/* <ChevronUp onClick={handleClickSetting} className='w-4'/> */}
            </span>
        </div>
    )
}

const SideBae = ({ isOpen, onClose }) => {
    const [clicked , setClicked] = useState("blog")
    const [openSettingPanel , setOpenSettingPanel] = useState(false)
    const navigate = useNavigate();
    function handleClickSettings() {
        setOpenSettingPanel(!openSettingPanel)
    }
    function handleClickRedirect(item , redirect) {
        setClicked(item)
        navigate(redirect)
        // Close sidebar on mobile after navigation
        if (onClose) onClose()
    }
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed md:relative z-50 md:z-auto
        w-[250px] md:w-[18%] md:min-w-[180px] 
        h-screen flex-shrink-0 
        border-r border-r[0.1] 
        bg-black
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className='flex flex-col bottom-1 items-center'>
          <div className='p-2 border-b flex h-10 flex-row w-full justify-between items-center'>
            <img src={gdg} alt="" className='w-8 h-4' />
            {/* Close button for mobile */}
            <button 
              onClick={onClose}
              className='md:hidden p-1 hover:bg-gray-800 rounded'
            >
              <X className='w-5 h-5 text-gray-400' />
            </button>
          </div>
        </div>
        {/* in the dashboard section we can have announment and all */}
        <div className='flex flex-col text-[13px] p-5 gap-3'>
          <span onClick={()=>handleClickRedirect("dash","/team/dashboard" )} className={`flex ${clicked == "dash" ? "bg-white text-black" : ""} p-2 rounded-md flex-row cursor-pointer gap-2 items-center`}>
            <IconBrandLine color='grey' className='w-4'/>
            <p>Dashboard</p> 
          </span>
          {/* <span onClick={()=>handleClickRedirect("blog","/team/blog/editor" )} className={`flex ${clicked == "blog" ? "bg-white text-black" : ""} p-2  flex-row gap-2 items-center cursor-pointer rounded-md`}>
              <IconArticle color='grey' className='w-4'/>
              <p >Write Blog</p> 
          </span> */}
          <div>
            <span className='flex flex-row text-[13px] gap-2 items-center rounded-md'>
              <Settings2 color='grey' className='w-4'/>
              <Link>Settings</Link> 
              <button className='hover:bg-stone-700 px-[3px] rounded'>
                {
                  openSettingPanel == false ? <ChevronUp onClick={handleClickSettings} className='w-4'/> :
                  <ChevronDown color='grey' onClick={handleClickSettings} className='w-4'/> 
                }
              </button>
            </span>
            {
              openSettingPanel == false ? <SettingSubPanel handleClickRedirect={handleClickRedirect} clicked={clicked} /> : ""
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default SideBae