import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowRight, BookOpen, CheckCircle2, Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const SERVER = import.meta.env.VITE_SERVER?.replace(/\/$/, '')

function authHeaders() {
  const auth = JSON.parse(localStorage.getItem('AuthState'))
  return auth?.token ? { Authorization: `Bearer ${auth.token}` } : {}
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(`${SERVER}/api/exercises`, { headers: authHeaders() })
      .then((res) => setExercises(res.data.exercises || []))
      .catch(() => setExercises([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white px-4 py-8 md:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gray-500 mb-2">Practice</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">Exercises</h1>
          <p className="mt-2 text-gray-400 text-sm max-w-lg">
            Each exercise is a curated set of problems. Track your progress as you solve them.
          </p>
        </div>

        {exercises.length === 0 ? (
          <Card className="border-white/10 bg-white/5">
            <CardContent className="p-10 text-center">
              <BookOpen className="size-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No exercises have been created yet.</p>
              <p className="text-gray-600 text-xs mt-1">Check back soon — admins are adding content.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {exercises.map((ex) => {
              const pct = ex.problemCount > 0
                ? Math.round((ex.solvedCount / ex.problemCount) * 100)
                : 0
              const allDone = ex.problemCount > 0 && ex.solvedCount === ex.problemCount

              return (
                <Link key={ex._id} to={`/exercises/${ex._id}`}>
                  <Card className="group h-full border-white/10 bg-[#0d0d0d] hover:border-white/25 hover:bg-[#111] transition-all duration-200 cursor-pointer">
                    <CardContent className="p-5 flex flex-col gap-4 h-full">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {allDone && (
                              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                            )}
                            <h2 className="font-semibold text-white text-base leading-snug truncate">
                              {ex.title}
                            </h2>
                          </div>
                          {ex.description && (
                            <p className="text-xs text-gray-500 line-clamp-2">{ex.description}</p>
                          )}
                        </div>
                        <ArrowRight className="size-4 text-gray-600 group-hover:text-white transition-colors mt-0.5 shrink-0" />
                      </div>

                      {/* Progress */}
                      <div className="mt-auto space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">{ex.problemCount} problems</span>
                          <span className={allDone ? 'text-emerald-400 font-medium' : 'text-gray-400'}>
                            {ex.solvedCount}/{ex.problemCount} solved
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${allDone ? 'bg-emerald-400' : 'bg-indigo-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
