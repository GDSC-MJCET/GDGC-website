import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import axios from 'axios'
import { Plus, Pencil, Trash2, ListChecks, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const SERVER = import.meta.env.VITE_SERVER?.replace(/\/$/, '')
const DIFFICULTIES = ['easy', 'medium', 'hard']
const LANGUAGES = ['javascript', 'python', 'cpp', 'java']

const emptyProblem = () => ({
  title: '',
  difficulty: 'easy',
  tags: '',
  allowedLanguages: [...LANGUAGES],
  defaultLanguage: 'javascript',
  statement: {
    paragraphs: '',
    constraints: '',
    examples: [{ input: '', output: '', explanation: '' }],
  },
  starterCode: { javascript: '', python: '', cpp: '', java: '' },
})

function authHeaders() {
  const auth = JSON.parse(localStorage.getItem('AuthState'))
  return { Authorization: `Bearer ${auth?.token}` }
}

// ── Inline modal ────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 py-8 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Problem form ─────────────────────────────────────────────────────────────
function ProblemForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial)
  const [activeCodeTab, setActiveCodeTab] = useState('javascript')

  const set = (path, value) =>
    setForm((f) => {
      const copy = structuredClone(f)
      const keys = path.split('.')
      let obj = copy
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
      obj[keys[keys.length - 1]] = value
      return copy
    })

  const addExample = () =>
    setForm((f) => ({
      ...f,
      statement: {
        ...f.statement,
        examples: [...f.statement.examples, { input: '', output: '', explanation: '' }],
      },
    }))

  const removeExample = (i) =>
    setForm((f) => ({
      ...f,
      statement: {
        ...f.statement,
        examples: f.statement.examples.filter((_, idx) => idx !== i),
      },
    }))

  const setExample = (i, field, value) =>
    setForm((f) => {
      const examples = [...f.statement.examples]
      examples[i] = { ...examples[i], [field]: value }
      return { ...f, statement: { ...f.statement, examples } }
    })

  const toggleLanguage = (lang) =>
    setForm((f) => ({
      ...f,
      allowedLanguages: f.allowedLanguages.includes(lang)
        ? f.allowedLanguages.filter((l) => l !== lang)
        : [...f.allowedLanguages, lang],
    }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      title: form.title.trim(),
      difficulty: form.difficulty,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      allowedLanguages: form.allowedLanguages,
      defaultLanguage: form.defaultLanguage,
      statement: {
        paragraphs: form.statement.paragraphs.split('\n').map((p) => p.trim()).filter(Boolean),
        constraints: form.statement.constraints.split('\n').map((c) => c.trim()).filter(Boolean),
        examples: form.statement.examples.filter((ex) => ex.input || ex.output),
      },
      starterCode: form.starterCode,
    }
    onSave(payload)
  }

  const labelCls = 'block text-xs uppercase tracking-widest text-gray-400 mb-1'
  const inputCls = 'bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-600'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelCls}>Title</label>
          <Input className={inputCls} value={form.title} onChange={(e) => set('title', e.target.value)} required />
        </div>
        <div>
          <label className={labelCls}>Difficulty</label>
          <select
            className="w-full rounded-md border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white"
            value={form.difficulty}
            onChange={(e) => set('difficulty', e.target.value)}
          >
            {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Default Language</label>
          <select
            className="w-full rounded-md border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white"
            value={form.defaultLanguage}
            onChange={(e) => set('defaultLanguage', e.target.value)}
          >
            {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Tags (comma-separated)</label>
          <Input className={inputCls} placeholder="Array, Hash Map" value={form.tags} onChange={(e) => set('tags', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Allowed Languages</label>
          <div className="flex gap-2 flex-wrap">
            {LANGUAGES.map((lang) => (
              <button
                key={lang} type="button"
                onClick={() => toggleLanguage(lang)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  form.allowedLanguages.includes(lang)
                    ? 'border-white/40 bg-white/10 text-white'
                    : 'border-white/10 text-gray-500 hover:border-white/20'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className={labelCls}>Description (one paragraph per line)</label>
        <Textarea className={`${inputCls} min-h-[100px] font-mono text-sm`} value={form.statement.paragraphs} onChange={(e) => set('statement.paragraphs', e.target.value)} />
      </div>

      <div>
        <label className={labelCls}>Constraints (one per line)</label>
        <Textarea className={`${inputCls} min-h-[80px] font-mono text-sm`} value={form.statement.constraints} onChange={(e) => set('statement.constraints', e.target.value)} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelCls}>Examples</label>
          <button type="button" onClick={addExample} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
            <Plus className="size-3" /> Add
          </button>
        </div>
        {form.statement.examples.map((ex, i) => (
          <div key={i} className="mb-3 rounded-xl border border-white/10 p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Example {i + 1}</span>
              {form.statement.examples.length > 1 && (
                <button type="button" onClick={() => removeExample(i)} className="text-gray-600 hover:text-red-400">
                  <X className="size-3" />
                </button>
              )}
            </div>
            <Input className={`${inputCls} font-mono text-xs`} placeholder="Input" value={ex.input} onChange={(e) => setExample(i, 'input', e.target.value)} />
            <Input className={`${inputCls} font-mono text-xs`} placeholder="Output" value={ex.output} onChange={(e) => setExample(i, 'output', e.target.value)} />
            <Input className={inputCls + ' text-xs'} placeholder="Explanation (optional)" value={ex.explanation} onChange={(e) => setExample(i, 'explanation', e.target.value)} />
          </div>
        ))}
      </div>

      <div>
        <label className={labelCls}>Starter Code</label>
        <div className="flex gap-1 mb-2">
          {LANGUAGES.map((l) => (
            <button key={l} type="button" onClick={() => setActiveCodeTab(l)}
              className={`rounded-md px-3 py-1 text-xs ${activeCodeTab === l ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>
              {l}
            </button>
          ))}
        </div>
        <Textarea
          className={`${inputCls} min-h-[120px] font-mono text-xs`}
          value={form.starterCode[activeCodeTab]}
          onChange={(e) => set(`starterCode.${activeCodeTab}`, e.target.value)}
          placeholder={`// ${activeCodeTab} starter code`}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving} className="bg-white text-black hover:bg-gray-200">
          {saving ? 'Saving…' : 'Save Problem'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} className="text-gray-400">
          Cancel
        </Button>
      </div>
    </form>
  )
}

// ── Test case manager ────────────────────────────────────────────────────────
function TestCaseManager({ problem, onClose }) {
  const [testCases, setTestCases] = useState([])
  const [newInput, setNewInput] = useState('')
  const [newExpected, setNewExpected] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const { data } = await axios.get(`${SERVER}/api/problems/${problem._id}/testcases`, { headers: authHeaders() })
    setTestCases(data.testCases || [])
  }, [problem._id])

  useEffect(() => { load() }, [load])

  const add = async () => {
    if (!newInput.trim() || !newExpected.trim()) return
    setSaving(true)
    await axios.post(
      `${SERVER}/api/problems/${problem._id}/testcases`,
      [{ input: newInput, expectedOutput: newExpected }],
      { headers: authHeaders() }
    )
    setNewInput('')
    setNewExpected('')
    await load()
    setSaving(false)
  }

  const remove = async (tcId) => {
    await axios.delete(`${SERVER}/api/problems/${problem._id}/testcases/${tcId}`, { headers: authHeaders() })
    await load()
  }

  const inputCls = 'bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-600 font-mono text-xs'

  return (
    <Modal title={`Test Cases — ${problem.title}`} onClose={onClose}>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        {testCases.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No test cases yet.</p>
        )}
        {testCases.map((tc, i) => (
          <div key={tc._id} className="rounded-xl border border-white/10 p-3 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Case {i + 1}</span>
              <button onClick={() => remove(tc._id)} className="text-gray-600 hover:text-red-400">
                <Trash2 className="size-3.5" />
              </button>
            </div>
            <p className="text-xs text-gray-400">Input:</p>
            <pre className="text-xs text-white bg-black/30 rounded p-2 whitespace-pre-wrap">{tc.input}</pre>
            <p className="text-xs text-gray-400">Expected:</p>
            <pre className="text-xs text-white bg-black/30 rounded p-2 whitespace-pre-wrap">{tc.expectedOutput}</pre>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Add Test Case</p>
        <Textarea className={`${inputCls} min-h-[60px]`} placeholder="Input" value={newInput} onChange={(e) => setNewInput(e.target.value)} />
        <Textarea className={`${inputCls} min-h-[60px]`} placeholder="Expected Output" value={newExpected} onChange={(e) => setNewExpected(e.target.value)} />
        <Button onClick={add} disabled={saving} className="bg-white text-black hover:bg-gray-200 w-full">
          {saving ? 'Adding…' : 'Add Test Case'}
        </Button>
      </div>
    </Modal>
  )
}

// ── Admin panel ──────────────────────────────────────────────────────────────
function AdminPanel() {
  const [problems, setProblems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [tcTarget, setTcTarget] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const { data } = await axios.get(`${SERVER}/api/problems`)
    setProblems(data.problems || [])
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setEditTarget(null); setShowForm(true) }
  const openEdit = async (p) => {
    const { data } = await axios.get(`${SERVER}/api/problems/${p._id}`)
    const full = data.problem
    setEditTarget({
      ...full,
      tags: (full.tags || []).join(', '),
      statement: {
        paragraphs: (full.statement?.paragraphs || []).join('\n'),
        constraints: (full.statement?.constraints || []).join('\n'),
        examples: full.statement?.examples?.length ? full.statement.examples : [{ input: '', output: '', explanation: '' }],
      },
    })
    setShowForm(true)
  }

  const save = async (payload) => {
    setSaving(true)
    try {
      if (editTarget?._id) {
        await axios.put(`${SERVER}/api/problems/${editTarget._id}`, payload, { headers: authHeaders() })
      } else {
        await axios.post(`${SERVER}/api/problems`, payload, { headers: authHeaders() })
      }
      await load()
      setShowForm(false)
    } catch (e) {
      alert(e?.response?.data?.message || 'Save failed')
    }
    setSaving(false)
  }

  const deleteProblem = async (id) => {
    if (!confirm('Delete this problem?')) return
    await axios.delete(`${SERVER}/api/problems/${id}`, { headers: authHeaders() })
    await load()
  }

  const diffColor = { easy: 'text-emerald-400', medium: 'text-amber-400', hard: 'text-rose-400' }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-500">Admin</p>
          <h1 className="text-2xl font-semibold text-white mt-1">Problem Management</h1>
        </div>
        <Button onClick={openCreate} className="bg-white text-black hover:bg-gray-200 flex items-center gap-2">
          <Plus className="size-4" /> New Problem
        </Button>
      </div>

      <div className="space-y-3">
        {problems.length === 0 && (
          <Card className="border-border bg-[#111]">
            <CardContent className="p-8 text-center text-gray-500 text-sm">
              No problems yet. Create one to get started.
            </CardContent>
          </Card>
        )}
        {problems.map((p) => (
          <Card key={p._id} className="border-border bg-[#111] hover:border-white/20 transition-colors">
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium text-white truncate">{p.title}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`text-xs font-medium ${diffColor[p.difficulty] || 'text-gray-400'}`}>{p.difficulty}</span>
                  {(p.tags || []).slice(0, 3).map((t) => (
                    <span key={t} className="text-xs text-gray-500 bg-white/5 rounded-full px-2 py-0.5">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setTcTarget(p)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10" title="Test Cases">
                  <ListChecks className="size-4" />
                </button>
                <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10" title="Edit">
                  <Pencil className="size-4" />
                </button>
                <button onClick={() => deleteProblem(p._id)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10" title="Delete">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showForm && (
        <Modal title={editTarget ? 'Edit Problem' : 'New Problem'} onClose={() => setShowForm(false)}>
          <ProblemForm
            initial={editTarget || emptyProblem()}
            onSave={save}
            onCancel={() => setShowForm(false)}
            saving={saving}
          />
        </Modal>
      )}

      {tcTarget && <TestCaseManager problem={tcTarget} onClose={() => setTcTarget(null)} />}
    </div>
  )
}

// ── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const auth = JSON.parse(localStorage.getItem('AuthState'))
  const nav = useNavigate()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!auth?.token) { nav('/login'); return }

    axios
      .get(import.meta.env.VITE_SERVER + '/api/v1/dashboard/get-dashboard', {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      .then((res) => { if (!res.data.success) nav('/login') })
      .catch(() => nav('/login'))

    axios
      .get(import.meta.env.VITE_SERVER + '/api/v1/admin/verify-admin', {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      .then(() => setIsAdmin(true))
      .catch(() => setIsAdmin(false))
      .finally(() => setChecked(true))
  }, [])

  if (!checked) return null

  if (isAdmin) return <AdminPanel />

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">Coming Soon</p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>In Development</span>
        </div>
        <div className="pt-6 flex flex-col items-center">
          <p className="text-gray-500 text-sm mb-3">Until then, you can manage your QR redirection</p>
          <NavLink
            to="/team/customization/qrchange"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Change QR Redirect
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
