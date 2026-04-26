import { ArrowRight, Code2 } from "lucide-react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getMockProblemList } from "@/components/practice/mockProblems"

const difficultyClassNames = {
  Easy: "border-emerald-400/30 bg-emerald-400/[0.12] text-emerald-200",
  Medium: "border-amber-400/30 bg-amber-400/[0.12] text-amber-200",
  Hard: "border-rose-400/30 bg-rose-400/[0.12] text-rose-200",
}

const PracticeListPage = () => {
  const problems = getMockProblemList()

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
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400 md:text-base">
                This list follows the internal dashboard styling, while each problem opens its own coding workspace at `/practice/:problemId`.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border bg-[#111111] shadow-none">
            <CardContent className="flex h-full flex-col justify-center p-6">
              <p className="text-xs uppercase tracking-[0.26em] text-gray-500">Available</p>
              <p className="mt-3 text-3xl font-semibold text-white">{problems.length}</p>
              <p className="mt-2 text-sm text-gray-400">Demo problems ready for preview.</p>
            </CardContent>
          </Card>
        </div>

        <section className="grid gap-4">
          {problems.map((problem, index) => (
            <Link key={problem.id} to={`/practice/${problem.slug}`}>
              <Card className="group overflow-hidden rounded-2xl border-border bg-[#111111] shadow-none transition-colors duration-200 hover:border-white/20 hover:bg-[#151515]">
                <CardContent className="p-0">
                  <div className="flex flex-col gap-5 px-5 py-5 md:flex-row md:items-start md:justify-between md:px-6">
                    <div className="flex min-w-0 flex-1 gap-4">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-gray-300">
                        <Code2 className="size-5" />
                      </div>

                      <div className="min-w-0 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xs uppercase tracking-[0.28em] text-gray-500">
                            Problem {String(index + 1).padStart(2, "0")}
                          </span>
                          <Badge
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${difficultyClassNames[problem.difficulty] || "border-white/15 bg-white/10 text-white/75"}`}
                            variant="outline"
                          >
                            {problem.difficulty}
                          </Badge>
                        </div>

                        <div>
                          <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                            {problem.title}
                          </h2>
                          <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-400 md:text-[15px]">
                            {problem.summary}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {problem.tags.map((tag) => (
                            <Badge
                              className="rounded-full border-border bg-background px-3 py-1 text-xs text-gray-400"
                              key={tag}
                              variant="outline"
                            >
                              {tag}
                            </Badge>
                          ))}
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
        </section>
      </div>
    </div>
  )
}

export default PracticeListPage
