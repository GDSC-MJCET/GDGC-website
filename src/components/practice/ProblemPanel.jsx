import { useEffect, useState } from "react"
import axios from "axios"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, XCircle, Clock, AlertTriangle, Loader2, FileText, History } from "lucide-react"

const SERVER = import.meta.env.VITE_SERVER?.replace(/\/$/, "")

// ── helpers ──────────────────────────────────────────────────────────────────
const difficultyClassNames = {
  Easy: "border-emerald-400/30 bg-emerald-400/[0.12] text-emerald-200",
  easy: "border-emerald-400/30 bg-emerald-400/[0.12] text-emerald-200",
  Medium: "border-amber-400/30 bg-amber-400/[0.12] text-amber-200",
  medium: "border-amber-400/30 bg-amber-400/[0.12] text-amber-200",
  Hard: "border-rose-400/30 bg-rose-400/[0.12] text-rose-200",
  hard: "border-rose-400/30 bg-rose-400/[0.12] text-rose-200",
}

const verdictMeta = {
  accepted:            { label: "Accepted",            color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/30", Icon: CheckCircle2 },
  wrong_answer:        { label: "Wrong Answer",         color: "text-rose-400",    bg: "bg-rose-400/10 border-rose-400/30",       Icon: XCircle },
  time_limit_exceeded: { label: "Time Limit Exceeded",  color: "text-amber-400",   bg: "bg-amber-400/10 border-amber-400/30",     Icon: Clock },
  runtime_error:       { label: "Runtime Error",        color: "text-orange-400",  bg: "bg-orange-400/10 border-orange-400/30",   Icon: AlertTriangle },
  pending:             { label: "Pending",              color: "text-gray-400",    bg: "bg-gray-400/10 border-gray-400/20",       Icon: Loader2 },
}

const LANG_LABEL = { javascript: "JS", python: "PY", cpp: "C++", java: "Java" }

function fmtDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " · " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
}

function fmtElapsed(ms) {
  if (ms == null) return null
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

// ── code sample ──────────────────────────────────────────────────────────────
const CodeSample = ({ children }) => (
  <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 text-sm leading-7 text-gray-200">
    <code>{children}</code>
  </pre>
)

// ── Submissions tab ───────────────────────────────────────────────────────────
function SubmissionsTab({ problemId, refreshToken }) {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!problemId || !SERVER) { setLoading(false); return }
    const auth = JSON.parse(localStorage.getItem("AuthState"))
    if (!auth?.token) { setLoading(false); return }

    setLoading(true)
    axios
      .get(`${SERVER}/api/submissions?problemId=${problemId}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      .then((res) => setSubmissions(res.data.submissions || []))
      .catch(() => setError("Could not load submissions."))
      .finally(() => setLoading(false))
  }, [problemId, refreshToken])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-5 animate-spin text-gray-500" />
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-rose-400 text-center py-8">{error}</p>
  }

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
        <History className="size-8 text-gray-700" />
        <p className="text-sm text-gray-500">No submissions yet.</p>
        <p className="text-xs text-gray-600">Hit Submit to see your history here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {submissions.map((s) => {
        const meta = verdictMeta[s.verdict] || verdictMeta.pending
        const elapsed = fmtElapsed(s.elapsedMs)
        return (
          <div
            key={s.submissionId}
            className="rounded-xl border border-white/8 bg-background px-4 py-3 space-y-2"
          >
            {/* Top row: verdict + language */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium ${meta.bg} ${meta.color}`}>
                <meta.Icon className={`size-3.5 ${s.verdict === 'pending' ? 'animate-spin' : ''}`} />
                {meta.label}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono uppercase tracking-wide">
                  {LANG_LABEL[s.language] || s.language}
                </span>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
              {s.totalCount > 0 && (
                <span>
                  <span className={s.allPassed ? "text-emerald-400 font-medium" : "text-rose-400 font-medium"}>
                    {s.passedCount}/{s.totalCount}
                  </span>{" "}
                  test cases passed
                </span>
              )}
              {elapsed && (
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {elapsed}
                </span>
              )}
              <span className="ml-auto">{fmtDate(s.createdAt)}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── ProblemPanel ─────────────────────────────────────────────────────────────
const ProblemPanel = ({ problem, submissionRefreshToken }) => {
  const [tab, setTab] = useState("description")

  const tabs = [
    { id: "description", label: "Description", Icon: FileText },
    { id: "submissions", label: "Submissions", Icon: History },
  ]

  return (
    <Card className="h-full overflow-hidden rounded-2xl border-border bg-[#111111] shadow-none">
      <div className="flex h-full flex-col">

        {/* Header */}
        <div className="border-b border-border px-5 pt-5 pb-0 md:px-7">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <Badge
              className={`rounded-full border px-3 py-1 text-xs font-medium ${difficultyClassNames[problem.difficulty] || "border-white/[0.15] bg-white/[0.08] text-white/75"}`}
              variant="outline"
            >
              {problem.difficulty}
            </Badge>
            {problem.tags.map((tag) => (
              <Badge className="rounded-full border-border bg-background px-3 py-1 text-xs text-gray-400" key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl mb-4">
            {problem.title}
          </h2>

          {/* Tab bar */}
          <div className="flex gap-0 -mb-px">
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  tab === id
                    ? "border-white text-white"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                <Icon className="size-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-6 md:px-7">
          {tab === "description" && (
            <div className="space-y-8">
              <section className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.32em] text-gray-500">Description</p>
                  <h3 className="text-lg font-medium text-white">Understand the task</h3>
                </div>
                <div className="space-y-4 text-sm leading-7 text-gray-300 md:text-[15px]">
                  {problem.statement.paragraphs.length ? (
                    problem.statement.paragraphs.map((paragraph, index) => (
                      <p key={`${problem.id}-paragraph-${index}`}>{paragraph}</p>
                    ))
                  ) : (
                    <p>No statement text was returned for this problem yet.</p>
                  )}
                </div>
              </section>

              <Separator className="bg-border" />

              <section className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.32em] text-gray-500">Examples</p>
                  <h3 className="text-lg font-medium text-white">Sample cases</h3>
                </div>
                <div className="space-y-4">
                  {problem.statement.examples.length ? (
                    problem.statement.examples.map((example, index) => (
                      <div className="rounded-xl border border-border bg-background px-4 py-4" key={example.id || `${problem.id}-example-${index}`}>
                        <p className="mb-3 text-sm font-medium text-white">Example {index + 1}</p>
                        {example.input ? <CodeSample>{`Input:\n${example.input}`}</CodeSample> : null}
                        {example.output ? (
                          <div className={example.input ? "mt-3" : ""}>
                            <CodeSample>{`Output:\n${example.output}`}</CodeSample>
                          </div>
                        ) : null}
                        {example.explanation ? (
                          <p className="mt-3 text-sm leading-7 text-gray-400">
                            <span className="font-medium text-white">Explanation:</span> {example.explanation}
                          </p>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-border bg-background p-4 text-sm text-gray-500">
                      No examples are available for this problem yet.
                    </div>
                  )}
                </div>
              </section>

              <Separator className="bg-border" />

              <section className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.32em] text-gray-500">Constraints</p>
                  <h3 className="text-lg font-medium text-white">What your solution should respect</h3>
                </div>
                {problem.statement.constraints.length ? (
                  <ul className="space-y-3 text-sm leading-7 text-gray-300 md:text-[15px]">
                    {problem.statement.constraints.map((constraint) => (
                      <li className="flex items-start gap-3 rounded-xl border border-border bg-background px-4 py-3" key={constraint}>
                        <span className="mt-2 size-2 rounded-full bg-gray-400" />
                        <span>{constraint}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-xl border border-dashed border-border bg-background p-4 text-sm text-gray-500">
                    No constraints were returned for this problem yet.
                  </div>
                )}
              </section>
            </div>
          )}

          {tab === "submissions" && (
            <SubmissionsTab
              problemId={problem.id || problem._id}
              refreshToken={submissionRefreshToken}
            />
          )}
        </div>
      </div>
    </Card>
  )
}

export default ProblemPanel
