import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import axios from "axios"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getMockProblemList } from "@/components/practice/mockProblems"

const difficultyClassNames = {
  Easy: "border-emerald-400/30 bg-emerald-400/[0.12] text-emerald-200",
  easy: "border-emerald-400/30 bg-emerald-400/[0.12] text-emerald-200",
  Medium: "border-amber-400/30 bg-amber-400/[0.12] text-amber-200",
  medium: "border-amber-400/30 bg-amber-400/[0.12] text-amber-200",
  Hard: "border-rose-400/30 bg-rose-400/[0.12] text-rose-200",
  hard: "border-rose-400/30 bg-rose-400/[0.12] text-rose-200",
}

const PracticeListPage = () => {
  const server = import.meta.env.VITE_SERVER?.replace(/\/$/, "")
  const [problems, setProblems] = useState([])
  const [isMock, setIsMock] = useState(false)

  useEffect(() => {
    if (!server) {
      setProblems(getMockProblemList())
      setIsMock(true)
      return
    }

    axios
      .get(`${server}/api/problems`)
      .then((res) => {
        if (res.data.success && res.data.problems.length > 0) {
          setProblems(res.data.problems)
          setIsMock(false)
        } else {
          setProblems(getMockProblemList())
          setIsMock(true)
        }
      })
      .catch(() => {
        setProblems(getMockProblemList())
        setIsMock(true)
      })
  }, [server])

  const getSlug = (problem) => problem.slug || problem._id || problem.id

  return (
    <div className="min-h-full bg-background px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <Card className="rounded-2xl border-border bg-[#111111] shadow-none">
            <CardContent className="p-6">
              <p className="text-[11px] uppercase tracking-[0.3em] text-gray-500">
                Problem Set
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                Choose a problem and open the dedicated solve screen
              </h2>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border bg-[#111111] shadow-none">
            <CardContent className="flex h-full flex-col justify-center p-6">
              <p className="text-xs uppercase tracking-[0.26em] text-gray-500">Available</p>
              <p className="mt-3 text-3xl font-semibold text-white">{problems.length}</p>
              <p className="mt-2 text-sm text-gray-400">
                {isMock ? "Demo problems ready for preview." : "Problems loaded from backend."}
              </p>
            </CardContent>
          </Card>
        </div>

        <section className="grid gap-4">
          {problems.map((problem) => (
            <Link key={problem._id || problem.id} to={`/practice/${getSlug(problem)}`}>
              <Card className="group overflow-hidden border-border bg-[#111111] shadow-none transition-colors duration-200 hover:border-white/20 hover:bg-[#151515]">
                <CardContent className="p-0">
                  <div className="flex flex-col gap-5 px-5 py-5 md:flex-row md:items-start md:justify-between md:px-6">
                    <div className="flex min-w-0 flex-1 gap-4">
                      <div className="min-w-0 flex flex-col space-y-2">
                        <h2 className="text-lg font-semibold tracking-tight text-white md:text-xl">
                          {problem.title}
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {(problem.tags || []).map((tag) => (
                            <Badge
                              className="rounded-full border-border bg-background px-3 py-1 text-xs text-gray-400"
                              key={tag}
                              variant="outline"
                            >
                              {tag}
                            </Badge>
                          ))}
                          <Badge
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${difficultyClassNames[problem.difficulty] || "border-white/15 bg-white/10 text-white/75"}`}
                            variant="outline"
                          >
                            {problem.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end rounded-xl border border-border bg-background px-4 py-3 text-sm text-gray-300 transition-colors group-hover:border-white/20 group-hover:text-white md:self-center">
                      <span>Open workspace</span>
                      <ArrowRight className="size-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {problems.length === 0 && (
            <Card className="rounded-2xl border-border bg-[#111111] shadow-none">
              <CardContent className="p-8 text-center text-gray-500">
                No problems available yet.
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  )
}

export default PracticeListPage
