import React, { useEffect, useState } from 'react'
import { useNavigate, NavLink, Link } from 'react-router-dom'
import axios from 'axios'
import { BookOpen, CheckCircle2, ArrowRight, QrCode, Circle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const SERVER = import.meta.env.VITE_SERVER?.replace(/\/$/, '')

function authHeaders() {
  const auth = JSON.parse(localStorage.getItem('AuthState'))
  return { Authorization: `Bearer ${auth?.token}` }
}

const diffColor = {
  easy: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  medium: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  hard: 'border-rose-400/30 bg-rose-400/10 text-rose-300',
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
      {/* Card header — click to expand */}
      <button
        className="w-full text-left p-4 flex items-center gap-4"
        onClick={() => setOpen(v => !v)}
      >
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            {allDone && <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />}
            <span className="font-semibold text-white text-sm leading-snug truncate">{exercise.title}</span>
          </div>

          {/* Progress bar */}
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

      {/* Expanded problem list */}
      {open && (
        <div className="border-t border-white/5 px-4 pb-3 pt-2 space-y-1">
          {exercise.problems.length === 0 && (
            <p className="text-xs text-gray-600 py-2 text-center">No problems in this exercise yet.</p>
          )}
          {exercise.problems.map((p, i) => (
            <Link
              key={p._id}
              to={`/practice/${p.slug || p._id}`}
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

          {/* Go to full exercise page */}
          <Link
            to={`/exercises/${exercise._id}`}
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
  const auth = JSON.parse(localStorage.getItem('AuthState'))
  const nav = useNavigate()
  const [checked, setChecked] = useState(false)
  const [exercises, setExercises] = useState([])
  const [loadingExercises, setLoadingExercises] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  useEffect(() => {
    if (!auth?.token) { nav('/login'); return }

    axios
      .get(import.meta.env.VITE_SERVER + '/api/v1/dashboard/get-dashboard', {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      .then((res) => { if (!res.data.success) nav('/login') })
      .catch(() => nav('/login'))
      .finally(() => setChecked(true))

    axios.get(
      `${import.meta.env.VITE_SERVER}/api/v1/admin/verify-admin`,
      { headers: { Authorization: `Bearer ${auth?.token}` } }
    ).then((data) => {
      if (data.data.success) setIsAdmin(true)
    }).catch(() => {})

    axios.get(
      `${import.meta.env.VITE_SERVER}/api/v1/admin/verify-super-admin`,
      { headers: { Authorization: `Bearer ${auth?.token}` } }
    ).then((data) => {
      if (data.data.success) setIsSuperAdmin(true)
    }).catch(() => {})

    // Fetch exercises with user's solve progress
    axios
      .get(`${SERVER}/api/exercises`, { headers: authHeaders() })
      .then((res) => setExercises(res.data.exercises || []))
      .catch(() => setExercises([]))
      .finally(() => setLoadingExercises(false))
  }, [])

  if (!checked) return null

  return (
    <div className="min-h-[70vh] px-6 py-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Member Area</p>
        <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
      </div>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        <Link to="/practice">
          <Card className="group border-white/10 bg-[#111] hover:border-white/25 hover:bg-[#151515] transition-all cursor-pointer h-full">
            <CardContent className="p-5 flex flex-col gap-3 h-full">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="size-5 text-emerald-400" />
                </div>
                <ArrowRight className="size-4 text-gray-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="font-semibold text-white">Practice</p>
                <p className="text-xs text-gray-500 mt-0.5">Browse and solve individual problems</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {(isAdmin || isSuperAdmin) && (
          <NavLink to="/team/customization/qrchange">
            <Card className="group border-white/10 bg-[#111] hover:border-white/25 hover:bg-[#151515] transition-all cursor-pointer h-full">
              <CardContent className="p-5 flex flex-col gap-3 h-full">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <QrCode className="size-5 text-gray-400" />
                  </div>
                  <ArrowRight className="size-4 text-gray-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="font-semibold text-white">Change QR Redirect</p>
                  <p className="text-xs text-gray-500 mt-0.5">Update where your QR code points</p>
                </div>
              </CardContent>
            </Card>
          </NavLink>
        )}
      </div>

      {/* Exercises section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-widest">Exercises</h2>
          </div>
          <Link to="/exercises" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1">
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

        {!loadingExercises && exercises.map((ex) => (
          <ExerciseCard key={ex._id} exercise={ex} />
        ))}
      </div>
    </div>
  )
}

export default Dashboard
