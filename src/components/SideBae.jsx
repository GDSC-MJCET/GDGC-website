import { IconBrandLine } from '@tabler/icons-react'
import {
  BookOpen, ChevronDown, ChevronUp, Dumbbell, PenSquare,
  Settings2, UserStar, VenetianMask, X,
} from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import gdg from '../assets/gdg-logo.png'
import axios from 'axios'

// ── Sub-panels ────────────────────────────────────────────────────────────────
const sub = (active, key) =>
  `${active === key ? 'bg-white text-black dark:bg-neutral-800 dark:text-white rounded-md' : ''} py-1 px-3 w-full rounded-md cursor-pointer`

const SettingsSubPanel = ({ nav, active }) => (
  <div className='text-[12px] flex flex-col gap-2 pl-6 pt-2'>
    <span onClick={() => nav('Qr', '/team/customization/qrchange')} className={sub(active, 'Qr')}>Change QR</span>
    <span onClick={() => nav('socials', '/team/customization/socials')} className={sub(active, 'socials')}>Socials</span>
  </div>
)

const AdminSubPanel = ({ nav, active }) => (
  <div className='text-[12px] flex flex-col gap-2 pl-6 pt-2'>
    <span onClick={() => nav('adminUsers', '/team/admin/users')} className={sub(active, 'adminUsers')}>Users</span>
    <span onClick={() => nav('hr-interface', '/team/admin/hr-interface')} className={sub(active, 'hr-interface')}>Tech Debate</span>
    <span onClick={() => nav('content', '/team/admin/content')} className={sub(active, 'content')}>Content</span>
  </div>
)

const SuperAdminSubPanel = ({ nav, active }) => (
  <div className='text-[12px] flex flex-col gap-2 pl-6 pt-2'>
    <span onClick={() => nav('superAdminDashboard', '/team/superadmin')} className={sub(active, 'superAdminDashboard')}>Dashboard</span>
    <span onClick={() => nav('superAdminUsers', '/team/superadmin/users')} className={sub(active, 'superAdminUsers')}>Users</span>
    <span onClick={() => nav('superAdminContacts', '/team/superadmin/contacts')} className={sub(active, 'superAdminContacts')}>Contact Submissions</span>
  </div>
)

const BlogSubPanel = ({ nav, active }) => (
  <div className='text-[12px] flex flex-col gap-2 pl-6 pt-2'>
    <span onClick={() => nav('blog-feed', '/blog/home')} className={sub(active, 'blog-feed')}>Blog Feed</span>
    <span onClick={() => nav('blog-editor', '/blog/editor')} className={sub(active, 'blog-editor')}>Create Blog</span>
    <span onClick={() => nav('my-blogs', '/blog/myblogs')} className={sub(active, 'my-blogs')}>My Blogs</span>
    <span onClick={() => nav('blog-help', '/blog/help')} className={sub(active, 'blog-help')}>Help</span>
  </div>
)

// ── Collapsible nav group ─────────────────────────────────────────────────────
const NavGroup = ({ icon: Icon, label, open, onToggle, children }) => (
  <div>
    <span
      onClick={onToggle}
      className='flex p-2 flex-row text-[13px] gap-3 items-center rounded-md cursor-pointer hover:bg-gray-800'
    >
      <Icon className='w-4 h-4 text-gray-400 flex-shrink-0' />
      <span className='flex-1'>{label}</span>
      {open ? <ChevronDown className='w-4 h-4 text-gray-400' /> : <ChevronUp className='w-4 h-4 text-gray-400' />}
    </span>
    {!open && children}
  </div>
)

// ── Top-level nav item ────────────────────────────────────────────────────────
const NavItem = ({ icon: Icon, label, id, active, onClick }) => (
  <span
    onClick={() => onClick(id)}
    className={`flex ${active === id ? 'bg-white text-black dark:bg-neutral-800 dark:text-white' : ''} p-2 rounded-md flex-row cursor-pointer gap-3 items-center`}
  >
    <Icon className='w-4 h-4 text-gray-400 flex-shrink-0' />
    <p>{label}</p>
  </span>
)

// ── Sidebar shell ─────────────────────────────────────────────────────────────
const Shell = ({ isOpen, onClose, children }) => (
  <>
    {isOpen && (
      <div className='fixed inset-0 bg-black/50 z-40 md:hidden' onClick={onClose} />
    )}
    <div className={`
      fixed md:relative z-50 md:z-auto
      w-[250px] md:w-[18%] md:min-w-[180px]
      h-screen flex-shrink-0
      border-r border-border bg-background
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      <div className='flex flex-col bottom-1 items-center'>
        <div className='border-b flex h-10 flex-row w-full justify-between items-center px-3'>
          <img src={gdg} alt='' className='w-8 h-4' />
          <button onClick={onClose} className='md:hidden p-1 hover:bg-gray-800 rounded'>
            <X className='w-5 h-5 text-gray-400' />
          </button>
        </div>
      </div>
      <div className='flex flex-col text-[13px] p-5 gap-3'>
        {children}
      </div>
    </div>
  </>
)

// ── Main component ────────────────────────────────────────────────────────────
const SideBae = ({ isOpen, onClose }) => {
  const location   = useLocation()
  const navigate   = useNavigate()
  const auth       = JSON.parse(localStorage.getItem('AuthState'))

  const [active, setActive]                 = useState('dash')
  const [isSuperAdmin, setIsSuperAdmin]     = useState(false)
  const [isAdmin, setIsAdmin]               = useState(false)
  const [isGuest, setIsGuest]               = useState(false)
  const [roleReady, setRoleReady]           = useState(false)

  // Panel open/close state
  const [openSettings, setOpenSettings]     = useState(false)
  const [openAdmin, setOpenAdmin]           = useState(false)
  const [openSuperAdmin, setOpenSuperAdmin] = useState(false)
  const [openBlog, setOpenBlog]             = useState(false)

  // Sync active highlight with URL
  useEffect(() => {
    const p = location.pathname
    if (p.includes('dashboard'))       setActive('dash')
    else if (p.includes('exercises'))  setActive('exercises')
    else if (p.includes('practice'))   setActive('practice')
    else if (p.includes('admin/users'))     setActive('adminUsers')
    else if (p.includes('hr-interface'))    setActive('hr-interface')
    else if (p.includes('admin/content'))   setActive('content')
    else if (p.includes('superadmin'))      setActive('superAdminDashboard')
    else if (p.includes('customization'))   setActive('Qr')
    else if (p.includes('blog/home'))       setActive('blog-feed')
    else if (p.includes('blog/editor'))     setActive('blog-editor')
    else if (p.includes('blog/myblogs'))    setActive('my-blogs')
    else if (p.includes('blog/help'))       setActive('blog-help')
  }, [location.pathname])

  // Fetch roles
  useEffect(() => {
    if (!auth?.token) { navigate('/login'); return }

    // Read guest flag from stored auth state
    const stored = localStorage.getItem('AuthState')
    if (stored) setIsGuest(!!JSON.parse(stored).guest)

    const headers = { Authorization: `Bearer ${auth.token}` }
    const base    = import.meta.env.VITE_SERVER

    Promise.allSettled([
      axios.get(`${base}/api/v1/admin/verify-admin`, { headers }),
      axios.get(`${base}/api/v1/admin/verify-super-admin`, { headers }),
    ]).then(([adminRes, superRes]) => {
      if (adminRes.status === 'fulfilled' && adminRes.value.data.success) setIsAdmin(true)
      if (superRes.status === 'fulfilled' && superRes.value.data.success) setIsSuperAdmin(true)
      setRoleReady(true)
    })
  }, [auth?.token])

  // Nav helper — sets active + navigates + closes mobile sidebar
  const go = (id, path) => {
    setActive(id)
    navigate(path)
    if (onClose) onClose()
  }

  // Don't render until roles are resolved (prevents flickering between sidebars)
  if (!roleReady) return null

  // ── Role hierarchy ──────────────────────────────────────────────────────────
  // SuperAdmin ≥ Admin ≥ Non-guest ≥ Guest
  // Each tier inherits the previous tier's nav items and adds its own.

  const commonNav = (
    <>
      <NavItem icon={IconBrandLine} label='Dashboard' id='dash'      active={active} onClick={() => go('dash', '/team/dashboard')} />
      <NavItem icon={BookOpen}      label='Exercises'  id='exercises' active={active} onClick={() => go('exercises', '/team/exercises')} />
      <NavItem icon={Dumbbell}      label='Practice'   id='practice'  active={active} onClick={() => go('practice', '/team/practice')} />
    </>
  )

  const settingsNav = (
    <NavGroup icon={Settings2} label='Settings' open={openSettings} onToggle={() => setOpenSettings(v => !v)}>
      <SettingsSubPanel nav={go} active={active} />
    </NavGroup>
  )

  const adminNav = (
    <NavGroup icon={UserStar} label='Admin' open={openAdmin} onToggle={() => setOpenAdmin(v => !v)}>
      <AdminSubPanel nav={go} active={active} />
    </NavGroup>
  )

  const superAdminNav = (
    <NavGroup icon={VenetianMask} label='SuperAdmin' open={openSuperAdmin} onToggle={() => setOpenSuperAdmin(v => !v)}>
      <SuperAdminSubPanel nav={go} active={active} />
    </NavGroup>
  )

  const blogNav = (
    <NavGroup icon={PenSquare} label='Blog' open={openBlog} onToggle={() => setOpenBlog(v => !v)}>
      <BlogSubPanel nav={go} active={active} />
    </NavGroup>
  )

  // SuperAdmin — everything
  if (isSuperAdmin) {
    return (
      <Shell isOpen={isOpen} onClose={onClose}>
        {commonNav}
        {settingsNav}
        {adminNav}
        {superAdminNav}
        {blogNav}
      </Shell>
    )
  }

  // Admin — common + settings + admin panel + blog
  if (isAdmin) {
    return (
      <Shell isOpen={isOpen} onClose={onClose}>
        {commonNav}
        {settingsNav}
        {adminNav}
        {blogNav}
      </Shell>
    )
  }

  // Non-guest member — common + settings + blog
  if (!isGuest) {
    return (
      <Shell isOpen={isOpen} onClose={onClose}>
        {commonNav}
        {settingsNav}
        {blogNav}
      </Shell>
    )
  }

  // Guest — common + blog only (no QR / settings)
  return (
    <Shell isOpen={isOpen} onClose={onClose}>
      {commonNav}
      {blogNav}
    </Shell>
  )
}

export default SideBae
