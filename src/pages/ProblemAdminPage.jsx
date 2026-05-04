import { useEffect, useState } from "react"
import axios from "axios"
import { ChevronDown, ChevronRight, Eye, EyeOff, Plus, Trash2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const server = () => import.meta.env.VITE_SERVER?.replace(/\/$/, "")

const authHeaders = () => {
  const auth = JSON.parse(localStorage.getItem("AuthState") || "{}")
  return { Authorization: `Bearer ${auth?.token}` }
}

// ─── empty form state ────────────────────────────────────────────────────────
const emptyForm = { input: "", expectedOutput: "", isSample: false }

// ─── single test case row ────────────────────────────────────────────────────
const TestCaseRow = ({ tc, onToggleSample, onDelete }) => (
  <div className="flex items-start gap-3 rounded-xl border border-border bg-background px-4 py-3">
    <div className="flex-1 min-w-0 space-y-1">
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border ${
          tc.isSample
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            : "border-gray-600 bg-white/5 text-gray-400"
        }`}>
          {tc.isSample ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
          {tc.isSample ? "Sample" : "Hidden"}
        </span>
      </div>
      <pre className="text-xs text-gray-300 whitespace-pre-wrap break-all">
        <span className="text-gray-500">in: </span>{tc.input}
      </pre>
      <pre className="text-xs text-gray-300 whitespace-pre-wrap break-all">
        <span className="text-gray-500">out: </span>{tc.expectedOutput}
      </pre>
    </div>

    <div className="flex shrink-0 items-center gap-2">
      <Button
        size="sm"
        variant="ghost"
        className="h-8 rounded-lg border border-border px-3 text-xs text-gray-400 hover:text-white"
        onClick={() => onToggleSample(tc)}
        title={tc.isSample ? "Mark as hidden" : "Mark as sample"}
      >
        {tc.isSample ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
        {tc.isSample ? "Hide" : "Make sample"}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 rounded-lg border border-rose-500/20 px-3 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
        onClick={() => onDelete(tc._id)}
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  </div>
)

// ─── add form ────────────────────────────────────────────────────────────────
const AddTestCaseForm = ({ problemId, onAdded }) => {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleAdd = async () => {
    if (!form.input.trim() || !form.expectedOutput.trim()) {
      setError("Both input and expected output are required.")
      return
    }
    setSaving(true)
    setError("")
    try {
      await axios.post(
        `${server()}/api/problems/${problemId}/testcases`,
        [{ input: form.input, expectedOutput: form.expectedOutput, isSample: form.isSample }],
        { headers: authHeaders() }
      )
      setForm(emptyForm)
      onAdded()
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to add test case.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-[#0e0e0e] p-4 space-y-3">
      <p className="text-xs uppercase tracking-widest text-gray-500">Add test case</p>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Input (stdin)</label>
          <textarea
            className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-white/20 min-h-[80px] resize-y"
            placeholder={"2 7 11 15\n9"}
            value={form.input}
            onChange={e => setForm(f => ({ ...f, input: e.target.value }))}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Expected output (stdout)</label>
          <textarea
            className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-white/20 min-h-[80px] resize-y"
            placeholder={"0 1"}
            value={form.expectedOutput}
            onChange={e => setForm(f => ({ ...f, expectedOutput: e.target.value }))}
          />
        </div>
      </div>

      {/* Sample toggle */}
      <label className="flex cursor-pointer items-center gap-3 select-none">
        <div
          className={`relative h-5 w-9 rounded-full transition-colors ${form.isSample ? "bg-emerald-500" : "bg-white/10"}`}
          onClick={() => setForm(f => ({ ...f, isSample: !f.isSample }))}
        >
          <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.isSample ? "translate-x-4" : "translate-x-0.5"}`} />
        </div>
        <span className="text-sm text-gray-300">
          {form.isSample
            ? <><span className="text-emerald-400 font-medium">Sample</span> — visible to users, used for Run</>
            : <><span className="text-gray-400 font-medium">Hidden</span> — only used for Submit</>
          }
        </span>
      </label>

      {error && <p className="text-xs text-rose-400">{error}</p>}

      <Button
        size="sm"
        className="rounded-lg bg-white text-black hover:bg-gray-200"
        disabled={saving}
        onClick={handleAdd}
      >
        <Plus className="size-4" />
        {saving ? "Adding…" : "Add test case"}
      </Button>
    </div>
  )
}

// ─── problem accordion ───────────────────────────────────────────────────────
const ProblemAccordion = ({ problem }) => {
  const [open, setOpen] = useState(false)
  const [testCases, setTestCases] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchTestCases = async () => {
    setLoading(true)
    try {
      const res = await axios.get(
        `${server()}/api/problems/${problem._id}/testcases`,
        { headers: authHeaders() }
      )
      setTestCases(res.data.testCases || [])
    } catch {
      setTestCases([])
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = () => {
    if (!open) fetchTestCases()
    setOpen(o => !o)
  }

  const handleToggleSample = async (tc) => {
    try {
      await axios.patch(
        `${server()}/api/problems/${problem._id}/testcases/${tc._id}`,
        { isSample: !tc.isSample },
        { headers: authHeaders() }
      )
      fetchTestCases()
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to update.")
    }
  }

  const handleDelete = async (tcId) => {
    if (!confirm("Delete this test case?")) return
    try {
      await axios.delete(
        `${server()}/api/problems/${problem._id}/testcases/${tcId}`,
        { headers: authHeaders() }
      )
      fetchTestCases()
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to delete.")
    }
  }

  const sampleCount = testCases.filter(tc => tc.isSample).length
  const hiddenCount = testCases.filter(tc => !tc.isSample).length

  return (
    <div className="rounded-2xl border border-border bg-[#111111] overflow-hidden">
      {/* header */}
      <button
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
        onClick={handleOpen}
      >
        <div className="flex items-center gap-3">
          {open ? <ChevronDown className="size-4 text-gray-400" /> : <ChevronRight className="size-4 text-gray-400" />}
          <span className="font-medium text-white">{problem.title}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs border ${
            problem.difficulty === "Easy" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            : problem.difficulty === "Medium" ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
            : "border-rose-500/30 bg-rose-500/10 text-rose-300"
          }`}>
            {problem.difficulty}
          </span>
        </div>

        {open && testCases.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="text-emerald-400">{sampleCount} sample</span>
            <span>·</span>
            <span>{hiddenCount} hidden</span>
          </div>
        )}
      </button>

      {/* body */}
      {open && (
        <div className="border-t border-border px-5 py-4 space-y-3">
          {loading ? (
            <p className="text-sm text-gray-500 py-2">Loading…</p>
          ) : testCases.length === 0 ? (
            <p className="text-sm text-gray-500 py-2">No test cases yet.</p>
          ) : (
            <div className="space-y-2">
              {testCases.map(tc => (
                <TestCaseRow
                  key={tc._id}
                  tc={tc}
                  onToggleSample={handleToggleSample}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          <AddTestCaseForm problemId={problem._id} onAdded={fetchTestCases} />
        </div>
      )}
    </div>
  )
}

// ─── page ────────────────────────────────────────────────────────────────────
const ProblemAdminPage = () => {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProblems = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${server()}/api/problems`, { headers: authHeaders() })
      setProblems(res.data.problems || [])
    } catch {
      setProblems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProblems() }, [])

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-8">
      <div className="mx-auto max-w-4xl space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500">Admin</p>
            <h1 className="mt-1 text-2xl font-semibold text-white">Test Case Manager</h1>
            <p className="mt-1 text-sm text-gray-400">
              <span className="text-emerald-400">Sample</span> test cases are shown to users and used for <strong>Run</strong>.{" "}
              <span className="text-gray-400">Hidden</span> ones are only used for <strong>Submit</strong>.
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="rounded-lg border border-border text-gray-400 hover:text-white"
            onClick={fetchProblems}
          >
            <RefreshCw className="size-4" />
          </Button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading problems…</p>
        ) : problems.length === 0 ? (
          <p className="text-gray-500">No problems found.</p>
        ) : (
          <div className="space-y-3">
            {problems.map(p => (
              <ProblemAccordion key={p._id} problem={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProblemAdminPage
