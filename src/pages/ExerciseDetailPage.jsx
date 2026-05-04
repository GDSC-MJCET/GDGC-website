import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, ArrowRight, CheckCircle2, Circle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const SERVER = import.meta.env.VITE_SERVER?.replace(/\/$/, '')

const diffColor = {
  easy: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  medium: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  hard: 'border-rose-400/30 bg-rose-400/10 text-rose-300',
}

function authHeaders() {
  const auth = JSON.parse(localStorage.getItem('AuthState'))
  return auth?.token ? { Authorization: `Bearer ${auth.token}` } : {}
}

export default function ExerciseDetailPage() {
  const { exerciseId } = useParams()
  const nav = useNavigate()
  const [exercise, setExercise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    axios
      .get(`${SERVER}/api/exercises/${exerciseId}`, { headers: authHeaders() })
      .then((res) => setExercise(res.data.exercise))
      .catch(() => setError('Could not load this exercise.'))
      .finally(() => setLoading(false))
  }, [exerciseId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    )
  }

  if (error || !exercise) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-4">
        <div className="text-center space-y-3">
          <p className="text-gray-400">{error || 'Exercise not found.'}</p>
          <button onClick={() => nav(-1)} className="text-sm text-indigo-400 hover:underline">
            ← Go back
          </button>
        </div>
      </div>
    )
  }

  const pct = exercise.problemCount > 0
    ? Math.round((exercise.solvedCount / exercise.problemCount) * 100)
    : 0
  const allDone = exercise.problemCount > 0 && exercise.solvedCount === exercise.problemCount

  return (
    <div className="min-h-screen bg-[#050816] text-white px-4 py-8 md:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Back */}
        <button
          onClick={() => nav(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="size-4" />
          All Exercises
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            {allDone && <CheckCircle2 className="size-5 text-emerald-400" />}
            <h1 className="text-2xl md:text-3xl font-semibold text-white">{exercise.title}</h1>
          </div>
          {exercise.description && (
            <p className="text-gray-400 text-sm mt-1">{exercise.description}</p>
          )}

          {/* Progress bar */}
          <div className="mt-4 space-y-1.5">
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

        {/* Problem list */}
        <div className="space-y-3">
          {exercise.problems.length === 0 && (
            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-8 text-center text-gray-500 text-sm">
                No problems in this exercise yet.
              </CardContent>
            </Card>
          )}

          {exercise.problems.map((p, i) => (
            <Link key={p._id} to={`/practice/${p.slug || p._id}`}>
              <Card className="group border-white/10 bg-[#0d0d0d] hover:border-white/25 hover:bg-[#111] transition-all">
                <CardContent className="p-4 flex items-center gap-4">
                  {/* Solved indicator */}
                  <div className="shrink-0">
                    {p.solved
                      ? <CheckCircle2 className="size-5 text-emerald-400" />
                      : <Circle className="size-5 text-gray-700" />
                    }
                  </div>

                  {/* Problem info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-600 tabular-nums w-5 shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-medium text-white text-sm truncate">{p.title}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {(p.tags || []).slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="rounded-full border-white/10 bg-white/5 text-gray-500 text-xs px-2 py-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty + arrow */}
                  <div className="flex items-center gap-2 shrink-0">
                    {p.difficulty && (
                      <Badge
                        variant="outline"
                        className={`rounded-full border text-xs px-2.5 py-0.5 font-medium capitalize ${diffColor[p.difficulty] || 'border-white/10 text-gray-400'}`}
                      >
                        {p.difficulty}
                      </Badge>
                    )}
                    <ArrowRight className="size-4 text-gray-600 group-hover:text-white transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
