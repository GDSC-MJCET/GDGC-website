import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import {
  BookOpen, CheckCircle2, ArrowRight, QrCode, Circle,
  Users, FileText, Shield,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const SERVER = import.meta.env.VITE_SERVER?.replace(/\/$/, '')

function authHeaders() {
  const auth = JSON.parse(localStorage.getItem('AuthState'))
  return { Authorization: `Bearer ${auth?.token}` }
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const diffColor = {
  easy:   'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  medium: 'border-amber-400/30  bg-amber-400/10  text-amber-300',
  hard:   'border-rose-400/30   bg-rose-400/10   text-rose-300',
}

// ── Quick-link card ──────────────────────────────────────────────────────────
function QuickCard({ to, icon: Icon, iconBg, iconColor, title, sub }) {
  return (
    <Link to={to}>
      <Card className="group border-white/10 bg-[#111] hover:border-white/25 hover:bg-[#151515] transition-all cursor-pointer h-full">
        <CardContent className="p-5 flex flex-col gap-3 h-full">
          <div className="flex items-center justify-between">
            <div className={`p-2.5 rounded-xl border ${iconBg}`}>
              <Icon className={`size-5 ${iconColor}`} />
            </div>
            <ArrowRight className="size-4 text-gray-600 group-hover:text-white transition-colors" />
          </div>
          <div>
            <p className="font-semibold text-white">{title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// ── Exercise card (expandable) ───────────────────────────────────────────────
function ExerciseCard({ exercise }) {
  const [open, setOpen] = useState(false)

  const pct = exercise.problemCount > 0
    ? Math.round((exercise.solvedCount / exercise.problemCount) * 100)
    : 0
  const allDone = exercise.problemCount > 0 && exercise.solvedCount === exercise.problemCount

  return (
    <div className={`rounded-2xl border transition-colors ${allDone ? 'border-emerald-500/20' : 'border-white/10'} bg-[#0d0d0d]`}>
      <button
        className="w-full text-left p-4 flex items-center gap-4"
        onClick={() => setOpen(v => !v)}
      >
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            {allDone && <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />}
            <span className="font-semibold text-white text-sm leading-snug truncate">{exercise.title}</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">{exercise.problemCount} problems</span>
              <span className={allDone ? 'text-emerald-400 font-medium' : 'text-gray-400'}>
                {exercise.solvedCount}/{exercise.problemCount} solved
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${allDone ? 'bg-emerald-400' : 'bg-indigo-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
        <ArrowRight
          className={`size-4 text-gray-600 shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        />
      </button>

      {open && (
        <div className="border-t border-white/5 px-4 pb-3 pt-2 space-y-1">
          {exercise.problems.length === 0 && (
            <p className="text-xs text-gray-600 py-2 text-center">No problems in this exercise yet.</p>
          )}
          {exercise.problems.map((p, i) => (
            <Link
              key={p._id}
              to={`/team/practice/${p.slug || p._id}`}
              className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/5 transition-colors group"
            >
              {p.solved
                ? <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                : <Circle className="size-4 text-gray-700 shrink-0" />
              }
              <span className="flex-1 text-sm text-gray-300 group-hover:text-white truncate">
                <span className="text-gray-600 tabular-nums mr-1.5">{String(i + 1).padStart(2, '0')}.</span>
                {p.title}
              </span>
              {p.difficulty && (
                <Badge
                  variant="outline"
                  className={`rounded-full border text-[11px] px-2 py-0 font-medium capitalize shrink-0 ${diffColor[p.difficulty] || 'border-white/10 text-gray-400'}`}
                >
                  {p.difficulty}
                </Badge>
              )}
            </Link>
          ))}
          <Link
            to={`/team/exercises/${exercise._id}`}
            className="flex items-center justify-center gap-1.5 mt-2 py-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View full exercise <ArrowRight className="size-3" />
          </Link>
        </div>
      )}
    </div>
  )
}

// ── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const auth    = JSON.parse(localStorage.getItem('AuthState'))
  const isGuest = !!auth?.guest

  const [ready,            setReady]            = useState(false)
  const [displayName,      setDisplayName]      = useState('')
  const [isAdmin,          setIsAdmin]          = useState(false)
  const [isSuperAdmin,     setIsSuperAdmin]     = useState(false)
  const [exercises,        setExercises]        = useState([])
  const [loadingExercises, setLoadingExercises] = useState(true)
  const nav = useNavigate()

  useEffect(() => {
    if (!auth?.token) { nav('/login'); return }

    const headers = { Authorization: `Bearer ${auth.token}` }

    // One parallel batch for all auth/role checks
    Promise.allSettled([
      axios.get(`${SERVER}/api/v1/dashboard/get-dashboard`, { headers }),
      axios.get(`${SERVER}/api/v1/admin/verify-admin`,      { headers }),
      axios.get(`${SERVER}/api/v1/admin/verify-super-admin`, { headers }),
    ]).then(([dashRes, adminRes, superRes]) => {
      // Redirect if dashboard auth fails
      if (dashRes.status === 'rejected' || !dashRes.value?.data?.success) {
        nav('/login'); return
      }
      // Name comes from the dashboard response — same source the top-bar popup uses
      setDisplayName(dashRes.value.data.user?.name || dashRes.value.data.user?.email?.split('@')[0] || 'there')
      if (adminRes.status === 'fulfilled' && adminRes.value.data.success)  setIsAdmin(true)
      if (superRes.status === 'fulfilled' && superRes.value.data.success)  setIsSuperAdmin(true)
      setReady(true)
    })

    // Exercises (independent — fire alongside role checks)
    axios
      .get(`${SERVER}/api/exercises`, { headers })
      .then(res => setExercises(res.data.exercises || []))
      .catch(() => setExercises([]))
      .finally(() => setLoadingExercises(false))
  }, [])

  if (!ready) return null

  // ── Quick-link cards ───────────────────────────────────────────────────────
  const quickLinks = []

  quickLinks.push(
    <QuickCard
      key="practice"
      to="/team/practice"
      icon={CheckCircle2}
      iconBg="bg-emerald-500/10 border-emerald-500/20"
      iconColor="text-emerald-400"
      title="Practice"
      sub="Browse and solve individual problems"
    />
  )

  // QR / Settings card — available to non-guests (members, admins, superadmins)
  if (!isGuest) {
    quickLinks.push(
      <QuickCard
        key="qr"
        to="/team/customization/qrchange"
        icon={QrCode}
        iconBg="bg-white/5 border-white/10"
        iconColor="text-gray-400"
        title="Change QR Redirect"
        sub="Update where your QR code points"
      />
    )
  }

  // Content management — admins and superadmins
  if (isAdmin || isSuperAdmin) {
    quickLinks.push(
      <QuickCard
        key="content"
        to="/team/admin/content"
        icon={FileText}
        iconBg="bg-indigo-500/10 border-indigo-500/20"
        iconColor="text-indigo-400"
        title="Content"
        sub="Manage problems and exercises"
      />
    )
  }

  // User management — admins and superadmins
  if (isAdmin || isSuperAdmin) {
    quickLinks.push(
      <QuickCard
        key="users"
        to="/team/admin/users"
        icon={Users}
        iconBg="bg-amber-500/10 border-amber-500/20"
        iconColor="text-amber-400"
        title="Users"
        sub="View and manage team members"
      />
    )
  }

  // SuperAdmin panel shortcut
  if (isSuperAdmin) {
    quickLinks.push(
      <QuickCard
        key="superadmin"
        to="/team/superadmin"
        icon={Shield}
        iconBg="bg-rose-500/10 border-rose-500/20"
        iconColor="text-rose-400"
        title="SuperAdmin"
        sub="Platform-wide controls and contacts"
      />
    )
  }

  return (
    <div className="min-h-[70vh] px-6 py-8 max-w-2xl mx-auto">
      {/* Welcome header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{greeting()} 👋</p>
        <h1 className="text-3xl font-semibold text-white capitalize">{displayName}</h1>
        {isSuperAdmin && (
          <span className="inline-block mt-2 text-[11px] font-medium uppercase tracking-widest text-rose-400 border border-rose-400/30 bg-rose-400/10 rounded-full px-2.5 py-0.5">
            Super Admin
          </span>
        )}
        {!isSuperAdmin && isAdmin && (
          <span className="inline-block mt-2 text-[11px] font-medium uppercase tracking-widest text-amber-400 border border-amber-400/30 bg-amber-400/10 rounded-full px-2.5 py-0.5">
            Admin
          </span>
        )}
        {!isSuperAdmin && !isAdmin && isGuest && (
          <span className="inline-block mt-2 text-[11px] font-medium uppercase tracking-widest text-gray-400 border border-white/10 bg-white/5 rounded-full px-2.5 py-0.5">
            Guest
          </span>
        )}
      </div>

      {/* Quick links */}
      <div className={`grid gap-4 mb-8 ${quickLinks.length >= 4 ? 'sm:grid-cols-2' : quickLinks.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
        {quickLinks}
      </div>

      {/* Exercises section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-widest">Exercises</h2>
          </div>
          <Link to="/team/exercises" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1">
            View all <ArrowRight className="size-3" />
          </Link>
        </div>

        {loadingExercises && (
          <div className="flex items-center justify-center py-8">
            <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          </div>
        )}

        {!loadingExercises && exercises.length === 0 && (
          <Card className="border-white/10 bg-[#0d0d0d]">
            <CardContent className="p-6 text-center">
              <p className="text-gray-500 text-sm">No exercises available yet.</p>
              <p className="text-gray-600 text-xs mt-1">Check back soon — admins are adding content.</p>
            </CardContent>
          </Card>
        )}

        {!loadingExercises && exercises.map(ex => (
          <ExerciseCard key={ex._id} exercise={ex} />
        ))}
      </div>
    </div>
  )
}

export default Dashboard
