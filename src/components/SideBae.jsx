import { IconArticle, IconBrandLine, IconTruckReturn } from '@tabler/icons-react'
import { BookOpen, ChevronDown, ChevronUp, Dumbbell, PenSquare, Settings2, UserStar, VenetianMask, X } from 'lucide-react'
import React, { useState,useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import gdg from "../assets/gdg-logo.png"
import axios from 'axios'


const SettingSubPanel = ({handleClickRedirect , clicked}) => {
    return (
        <div className='text-[12px] flex flex-col gap-2 pl-6 pt-2'>
            <span onClick={()=>handleClickRedirect("Qr","/team/customization/qrchange" )} className={`${clicked == "Qr" ? "bg-white text-black dark:bg-neutral-800 dark:text-white rounded-md" : ""} py-1 px-3 w-full rounded-md`}>
                Change Qr
            </span>
            <span onClick={()=>handleClickRedirect("socials","/team/customization/socials" )} className={`${clicked == "socials" ? "bg-white text-black dark:bg-neutral-800 dark:text-white rounded-md" : ""} py-1 px-3 w-full rounded-md`}>
                Socials
            </span>
        </div>
    )
}

const AdminSubPanel = ({handleClickRedirect , clicked}) => {
    return (
        <div className='text-[12px] flex flex-col gap-2 pl-6 pt-2'>
            <span onClick={()=>handleClickRedirect("adminUsers","/team/admin/users" )} className={`${clicked == "adminUsers" ? "bg-white text-black rounded-md" : ""} py-1 px-3 w-full rounded-md`}>
                Users
            </span>
            <span onClick={()=>handleClickRedirect("hr-interface","/team/admin/hr-interface" )} className={`${clicked == "hr-interface" ? "bg-white text-black rounded-md" : ""} py-1 px-3 w-full rounded-md`}>
                Tech Debate
            </span>
            <span onClick={()=>handleClickRedirect("content","/team/admin/content" )} className={`${clicked == "content" ? "bg-white text-black rounded-md" : ""} py-1 px-3 w-full rounded-md`}>
                Content
            </span>
        </div>
    )
}

const SuperAdminSubPanel = ({handleClickRedirect , clicked}) => {
    return (
        <div className='text-[12px] flex flex-col gap-2 pl-6 pt-2'>
            <span onClick={()=>handleClickRedirect("superAdminDashboard","/team/superadmin" )} className={`${clicked == "superAdminDashboard" ? "bg-white text-black dark:bg-neutral-800 dark:text-white rounded-md" : ""} py-1 px-3 w-full rounded-md`}>
                Dashboard
            </span>
            <span onClick={()=>handleClickRedirect("superAdminUsers","/team/superadmin/users" )} className={`${clicked == "superAdminUsers" ? "bg-white text-black dark:bg-neutral-800 dark:text-white rounded-md" : ""} py-1 px-3 w-full rounded-md`}>
                Users
            </span>
            <span onClick={()=>handleClickRedirect("superAdminContacts","/team/superadmin/contacts" )} className={`${clicked == "superAdminContacts" ? "bg-white text-black rounded-md" : ""} py-1 px-3 w-full rounded-md`}>
                Contact Submissions
            </span>
        </div>
    )
}

const BlogSubPanel = ({handleClickRedirect , clicked}) => {
    return (
        <div className='text-[12px] flex flex-col gap-2 pl-6 pt-2'>
            <span onClick={()=>handleClickRedirect("blog-feed","/blog/home")} className={`${clicked == "blog-feed" ? "bg-white text-black dark:bg-neutral-800 dark:text-white rounded-md" : ""} py-1 px-3 w-full rounded-md`}>
                Blog Feed
            </span>
            <span onClick={()=>handleClickRedirect("blog-editor","/blog/editor")} className={`${clicked == "blog-editor" ? "bg-white text-black dark:bg-neutral-800 dark:text-white rounded-md" : ""} py-1 px-3 w-full rounded-md`}>
                Create Blog
            </span>
            <span onClick={()=>handleClickRedirect("my-blogs","/blog/myblogs")} className={`${clicked == "my-blogs" ? "bg-white text-black dark:bg-neutral-800 dark:text-white rounded-md" : ""} py-1 px-3 w-full rounded-md`}>
                My Blogs
            </span>
            <span onClick={()=>handleClickRedirect("blog-help","/blog/help")} className={`${clicked == "blog-help" ? "bg-white text-black dark:bg-neutral-800 dark:text-white rounded-md" : ""} py-1 px-3 w-full rounded-md`}>
                Help
            </span>
        </div>
    )
}


const SideBae = ({ isOpen, onClose }) => {
    const [clicked , setClicked] = useState("blog")
    const [openSettingPanel , setOpenSettingPanel] = useState(false)
    const [openAdminPanel , setOpenAdminPanel] = useState(false)
    const [openSuperAdminPanel , setOpenSuperAdminPanel] = useState(false)
    const [openBlogPanel , setOpenBlogPanel] = useState(false)
    const [isAdmin,setIsAdmin] = useState(false);
    const [isSuperAdmin,setIsSuperAdmin] = useState(false)
    const [isGuest,setIsGuest] = useState(false)
    const nav = useNavigate();
    
    const auth = JSON.parse(localStorage.getItem("AuthState"));
    useEffect(() => {
    if (!auth?.token) {
      nav("/login")
    }

    axios.get(
        `${import.meta.env.VITE_SERVER}` + "/api/v1/admin/verify-admin",
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      )
      .then((data) => {
        if(data.data.success){
          setIsAdmin(true)
        }
        
      })
      .catch(() => {
        return
      })
      axios.get(
        `${import.meta.env.VITE_SERVER}` + "/api/v1/admin/verify-super-admin",
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      )
      .then((data) => {
        if(data.data.success){
          
          setIsSuperAdmin(true)
        }
        
      })
      .catch(() => {
        return
      })
      localStorage.getItem("AuthState") && setIsGuest(JSON.parse(localStorage.getItem("AuthState")).guest)
  }, [auth?.token])
    function handleClickSettings() {
        setOpenSettingPanel(!openSettingPanel)
    }
    function handleClickAdmin() {
        setOpenAdminPanel(!openAdminPanel)
    }
    function handleClickSuperAdmin() {
        setOpenSuperAdminPanel(!openSuperAdminPanel)
    }
    function handleClickBlog() {
        setOpenBlogPanel(!openBlogPanel)
    }
    function handleClickRedirect(item , redirect) {
        setClicked(item)
        nav(redirect)
        // Close sidebar on mobile after navigation
        if (onClose) onClose()
    }
  if(isGuest){
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <div className={`
        fixed md:relative z-50 md:z-auto
        w-[250px] md:w-[18%] md:min-w-[180px] 
        h-screen flex-shrink-0 
        border-r border-border 
        bg-background
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className='flex flex-col bottom-1 items-center'>
          <div className='border-b flex h-10 flex-row w-full justify-between items-center px-3'>
            <img src={gdg} alt="" className='w-8 h-4' />
            <button onClick={onClose} className='md:hidden p-1 hover:bg-gray-800 rounded'>
              <X className='w-5 h-5 text-gray-400' />
            </button>
          </div>
        </div>
        <div className='flex flex-col text-[13px] p-5 gap-3'>
          <span onClick={()=>handleClickRedirect("dash","/team/dashboard")} className={`flex ${clicked == "dash" ? "bg-white text-black dark:bg-neutral-800 dark:text-white" : ""} p-2 rounded-md flex-row cursor-pointer gap-3 items-center`}>
            <IconBrandLine className='w-4 h-4 text-gray-400 flex-shrink-0'/>
            <p>Dashboard</p>
          </span>

          <span onClick={()=>handleClickRedirect("exercises","/team/exercises")} className={`flex ${clicked=="exercises"?"bg-white text-black":""} p-2 rounded-md flex-row cursor-pointer gap-3 items-center`}>
            <BookOpen className='w-4 h-4 text-gray-400 flex-shrink-0'/>
            <p>Exercises</p>
          </span>

          <span onClick={()=>handleClickRedirect("practice","/team/practice")} className={`flex ${clicked=="practice"?"bg-white text-black":""} p-2 rounded-md flex-row cursor-pointer gap-3 items-center`}>
            <Dumbbell className='w-4 h-4 text-gray-400 flex-shrink-0'/>
            <p>Practice</p>
          </span>

          <div>
            <span onClick={handleClickBlog} className='flex p-2 flex-row text-[13px] gap-3 items-center rounded-md cursor-pointer hover:bg-gray-800'>
              <PenSquare className='w-4 h-4 text-gray-400 flex-shrink-0'/>
              <span className='flex-1'>Blog</span>
              {openBlogPanel ?
                <ChevronDown className='w-4 h-4 text-gray-400'/> :
                <ChevronUp className='w-4 h-4 text-gray-400'/>
              }
            </span>
            {!openBlogPanel && <BlogSubPanel handleClickRedirect={handleClickRedirect} clicked={clicked} />}
          </div>
        </div>
      </div>
    </>
  )
}
  if(isAdmin && !isSuperAdmin){
    return(<>{/* Overlay for mobile */}
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
        border-r border-border 
        bg-background
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className='flex flex-col bottom-1 items-center'>
          <div className='border-b flex h-10 flex-row w-full justify-between items-center px-3'>
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
        
        {/* Navigation menu */}
        <div className='flex flex-col text-[13px] p-5 gap-3'>
          <span onClick={()=>handleClickRedirect("dash","/team/dashboard" )} className={`flex ${clicked == "dash" ? "bg-white text-black dark:bg-neutral-800 dark:text-white" : ""} p-2 rounded-md flex-row cursor-pointer gap-3 items-center`}>
            <IconBrandLine className='w-4 h-4 text-gray-400 flex-shrink-0'/>
            <p>Dashboard</p>
          </span>

          <span onClick={()=>handleClickRedirect("exercises","/team/exercises")} className={`flex ${clicked=="exercises"?"bg-white text-black":""} p-2 rounded-md flex-row cursor-pointer gap-3 items-center`}>
            <BookOpen className='w-4 h-4 text-gray-400 flex-shrink-0'/>
            <p>Exercises</p>
          </span>

          <span onClick={()=>handleClickRedirect("practice","/team/practice")} className={`flex ${clicked=="practice"?"bg-white text-black":""} p-2 rounded-md flex-row cursor-pointer gap-3 items-center`}>
            <Dumbbell className='w-4 h-4 text-gray-400 flex-shrink-0'/>
            <p>Practice</p>
          </span>

          <div>
            <span onClick={handleClickSettings} className='flex p-2 flex-row text-[13px] gap-3 items-center rounded-md cursor-pointer hover:bg-gray-800'>
              <Settings2 className='w-4 h-4 text-gray-400 flex-shrink-0'/>
              <span className='flex-1'>Settings</span>
              {openSettingPanel ?
                <ChevronDown className='w-4 h-4 text-gray-400'/> :
                <ChevronUp className='w-4 h-4 text-gray-400'/>
              }
            </span>
            {!openSettingPanel && <SettingSubPanel handleClickRedirect={handleClickRedirect} clicked={clicked} />}
          </div>
          <div>
            <span onClick={handleClickAdmin} className='flex p-2 flex-row text-[13px] gap-3 items-center rounded-md cursor-pointer hover:bg-gray-800'>
              <UserStar className='w-4 h-4 text-gray-400 flex-shrink-0'/>
              <span className='flex-1'>Admin</span>
              {openAdminPanel ?
                <ChevronDown className='w-4 h-4 text-gray-400'/> :
                <ChevronUp className='w-4 h-4 text-gray-400'/>
              }
            </span>
            {!openAdminPanel && <AdminSubPanel handleClickRedirect={handleClickRedirect} clicked={clicked} />}
          </div>
          <div>
            <span onClick={handleClickBlog} className='flex p-2 flex-row text-[13px] gap-3 items-center rounded-md cursor-pointer hover:bg-gray-800'>
              <PenSquare className='w-4 h-4 text-gray-400 flex-shrink-0'/>
              <span className='flex-1'>Blog</span>
              {openBlogPanel ?
                <ChevronDown className='w-4 h-4 text-gray-400'/> :
                <ChevronUp className='w-4 h-4 text-gray-400'/>
              }
            </span>
            {!openBlogPanel && <BlogSubPanel handleClickRedirect={handleClickRedirect} clicked={clicked} />}
          </div>
        </div>
      </div>
    </>)
  }
  if(isSuperAdmin){
    return (<>
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
        border-r border-border
        bg-background
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className='flex flex-col bottom-1 items-center'>
          <div className='border-b flex h-10 flex-row w-full justify-between items-center px-3'>
            <img src={gdg} alt="" className='w-8 h-4' />
            <button onClick={onClose} className='md:hidden p-1 hover:bg-gray-800 rounded'>
              <X className='w-5 h-5 text-gray-400' />
            </button>
          </div>
        </div>
        <div className='flex flex-col text-[13px] p-5 gap-3'>
          <span onClick={()=>handleClickRedirect("dash","/team/dashboard" )} className={`flex ${clicked == "dash" ? "bg-white text-black dark:bg-neutral-800 dark:text-white" : ""} p-2 rounded-md flex-row cursor-pointer gap-3 items-center`}>
            <IconBrandLine className='w-4 h-4 text-gray-400 flex-shrink-0'/>
            <p>Dashboard</p>
          </span>

          <span onClick={()=>handleClickRedirect("exercises","/team/exercises")} className={`flex ${clicked=="exercises"?"bg-white text-black":""} p-2 rounded-md flex-row cursor-pointer gap-3 items-center`}>
            <BookOpen className='w-4 h-4 text-gray-400 flex-shrink-0'/>
            <p>Exercises</p>
          </span>

          <span onClick={()=>handleClickRedirect("practice","/team/practice")} className={`flex ${clicked=="practice"?"bg-white text-black":""} p-2 rounded-md flex-row cursor-pointer gap-3 items-center`}>
            <Dumbbell className='w-4 h-4 text-gray-400 flex-shrink-0'/>
            <p>Practice</p>
          </span>

          <div>
            <span onClick={handleClickSettings} className='flex p-2 flex-row text-[13px] gap-3 items-center rounded-md cursor-pointer hover:bg-gray-800'>
              <Settings2 className='w-4 h-4 text-gray-400 flex-shrink-0'/>
              <span className='flex-1'>Settings</span>
              {openSettingPanel ?
                <ChevronDown className='w-4 h-4 text-gray-400'/> :
                <ChevronUp className='w-4 h-4 text-gray-400'/>
              }
            </span>
            {!openSettingPanel && <SettingSubPanel handleClickRedirect={handleClickRedirect} clicked={clicked} />}
          </div>
          <div>
            <span onClick={handleClickAdmin} className='flex p-2 flex-row text-[13px] gap-3 items-center rounded-md cursor-pointer hover:bg-gray-800'>
              <UserStar className='w-4 h-4 text-gray-400 flex-shrink-0'/>
              <span className='flex-1'>Admin</span>
              {openAdminPanel ?
                <ChevronDown className='w-4 h-4 text-gray-400'/> :
                <ChevronUp className='w-4 h-4 text-gray-400'/>
              }
            </span>
            {!openAdminPanel && <AdminSubPanel handleClickRedirect={handleClickRedirect} clicked={clicked} />}
          </div>
          <div>
            <span onClick={handleClickSuperAdmin} className='flex p-2 flex-row text-[13px] gap-3 items-center rounded-md cursor-pointer hover:bg-gray-800'>
              <VenetianMask className='w-4 h-4 text-gray-400 flex-shrink-0'/>
              <span className='flex-1'>SuperAdmin</span>
              {openSuperAdminPanel ?
                <ChevronDown className='w-4 h-4 text-gray-400'/> :
                <ChevronUp className='w-4 h-4 text-gray-400'/>
              }
            </span>
            {!openSuperAdminPanel && <SuperAdminSubPanel handleClickRedirect={handleClickRedirect} clicked={clicked} />}
          </div>
          <div>
            <span onClick={handleClickBlog} className='flex p-2 flex-row text-[13px] gap-3 items-center rounded-md cursor-pointer hover:bg-gray-800'>
              <PenSquare className='w-4 h-4 text-gray-400 flex-shrink-0'/>
              <span className='flex-1'>Blog</span>
              {openBlogPanel ?
                <ChevronDown className='w-4 h-4 text-gray-400'/> :
                <ChevronUp className='w-4 h-4 text-gray-400'/>
              }
            </span>
            {!openBlogPanel && <BlogSubPanel handleClickRedirect={handleClickRedirect} clicked={clicked} />}
          </div>
        </div>
      </div></>)
  }
  // Regular user sidebar
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <div className={`
        fixed md:relative z-50 md:z-auto
        w-[250px] md:w-[18%] md:min-w-[180px]
        h-screen flex-shrink-0
        border-r border-border
        bg-background
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className='flex flex-col bottom-1 items-center'>
          <div className='border-b flex h-10 flex-row w-full justify-between items-center px-3'>
            <img src={gdg} alt="" className='w-8 h-4' />
            <button onClick={onClose} className='md:hidden p-1 hover:bg-gray-800 rounded'>
              <X className='w-5 h-5 text-gray-400' />
            </button>
          </div>
        </div>
        <div className='flex flex-col text-[13px] p-5 gap-3'>
          <span onClick={()=>handleClickRedirect("dash","/team/dashboard")} className={`flex ${clicked=="dash"?"bg-white text-black":""} p-2 rounded-md flex-row cursor-pointer gap-3 items-center`}>
            <IconBrandLine className='w-4 h-4 text-gray-400 flex-shrink-0'/>
            <p>Dashboard</p>
          </span>

          <span onClick={()=>handleClickRedirect("exercises","/team/exercises")} className={`flex ${clicked=="exercises"?"bg-white text-black":""} p-2 rounded-md flex-row cursor-pointer gap-3 items-center`}>
            <BookOpen className='w-4 h-4 text-gray-400 flex-shrink-0'/>
            <p>Exercises</p>
          </span>

          <span onClick={()=>handleClickRedirect("practice","/team/practice")} className={`flex ${clicked=="practice"?"bg-white text-black":""} p-2 rounded-md flex-row cursor-pointer gap-3 items-center`}>
            <Dumbbell className='w-4 h-4 text-gray-400 flex-shrink-0'/>
            <p>Practice</p>
          </span>

          <div>
            <span onClick={handleClickSettings} className='flex p-2 flex-row text-[13px] gap-3 items-center rounded-md cursor-pointer hover:bg-gray-800'>
              <Settings2 className='w-4 h-4 text-gray-400 flex-shrink-0'/>
              <span className='flex-1'>Settings</span>
              {openSettingPanel ?
                <ChevronDown className='w-4 h-4 text-gray-400'/> :
                <ChevronUp className='w-4 h-4 text-gray-400'/>
              }
            </span>
            {!openSettingPanel && <SettingSubPanel handleClickRedirect={handleClickRedirect} clicked={clicked} />}
          </div>
          <div>
            <span onClick={handleClickBlog} className='flex p-2 flex-row text-[13px] gap-3 items-center rounded-md cursor-pointer hover:bg-gray-800'>
              <PenSquare className='w-4 h-4 text-gray-400 flex-shrink-0'/>
              <span className='flex-1'>Blog</span>
              {openBlogPanel ?
                <ChevronDown className='w-4 h-4 text-gray-400'/> :
                <ChevronUp className='w-4 h-4 text-gray-400'/>
              }
            </span>
            {!openBlogPanel && <BlogSubPanel handleClickRedirect={handleClickRedirect} clicked={clicked} />}
          </div>
        </div>
      </div>
    </>
  )
}

export default SideBae