import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import {
  Plus, Pencil, Trash2, ListChecks, X, Import, CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'

const SERVER = import.meta.env.VITE_SERVER?.replace(/\/$/, '')
const DIFFICULTIES = ['easy', 'medium', 'hard']
const LANGUAGES = ['javascript', 'python', 'cpp', 'java']

function authHeaders() {
  const auth = JSON.parse(localStorage.getItem('AuthState'))
  return { Authorization: `Bearer ${auth?.token}` }
}

const emptyProblem = () => ({
  title: '',
  difficulty: 'easy',
  tags: '',
  allowedLanguages: [...LANGUAGES],
  defaultLanguage: 'javascript',
  statement: {
    paragraphs: '',
    constraints: '',
    inputFormat: '',
    outputFormat: '',
    examples: [{ input: '', output: '', explanation: '' }],
  },
})

// ── Modal ────────────────────────────────────────────────────────────────────
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
      statement: { ...f.statement, examples: [...f.statement.examples, { input: '', output: '', explanation: '' }] },
    }))

  const removeExample = (i) =>
    setForm((f) => ({
      ...f,
      statement: { ...f.statement, examples: f.statement.examples.filter((_, idx) => idx !== i) },
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
    onSave({
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
    })
  }

  const lCls = 'block text-xs uppercase tracking-widest text-gray-400 mb-1'
  const iCls = 'bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-600'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={lCls}>Title</label>
          <Input className={iCls} value={form.title} onChange={(e) => set('title', e.target.value)} required />
        </div>
        <div>
          <label className={lCls}>Difficulty</label>
          <select className="w-full rounded-md border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white" value={form.difficulty} onChange={(e) => set('difficulty', e.target.value)}>
            {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className={lCls}>Default Language</label>
          <select className="w-full rounded-md border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white" value={form.defaultLanguage} onChange={(e) => set('defaultLanguage', e.target.value)}>
            {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className={lCls}>Tags (comma-separated)</label>
          <Input className={iCls} placeholder="Array, Hash Map" value={form.tags} onChange={(e) => set('tags', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className={lCls}>Allowed Languages</label>
          <div className="flex gap-2 flex-wrap">
            {LANGUAGES.map((lang) => (
              <button key={lang} type="button" onClick={() => toggleLanguage(lang)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${form.allowedLanguages.includes(lang) ? 'border-white/40 bg-white/10 text-white' : 'border-white/10 text-gray-500 hover:border-white/20'}`}>
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <label className={lCls}>Description (one paragraph per line)</label>
        <Textarea className={`${iCls} min-h-[100px] font-mono text-sm`} value={form.statement.paragraphs} onChange={(e) => set('statement.paragraphs', e.target.value)} />
      </div>
      <div>
        <label className={lCls}>Constraints (one per line)</label>
        <Textarea className={`${iCls} min-h-[80px] font-mono text-sm`} value={form.statement.constraints} onChange={(e) => set('statement.constraints', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lCls}>Input Format</label>
          <Textarea rows={3} className={`${iCls} text-sm resize-y`} placeholder="Describe the input format — e.g. First line contains N integers space-separated. Second line contains the target." value={form.statement.inputFormat || ''} onChange={(e) => set('statement.inputFormat', e.target.value)} />
        </div>
        <div>
          <label className={lCls}>Output Format</label>
          <Textarea rows={3} className={`${iCls} text-sm resize-y`} placeholder="Describe the output format — e.g. Print two space-separated indices." value={form.statement.outputFormat || ''} onChange={(e) => set('statement.outputFormat', e.target.value)} />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={lCls}>Examples</label>
          <button type="button" onClick={addExample} className="text-xs text-gray-400 hover:text-white flex items-center gap-1"><Plus className="size-3" /> Add</button>
        </div>
        {form.statement.examples.map((ex, i) => (
          <div key={i} className="mb-3 rounded-xl border border-white/10 p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Example {i + 1}</span>
              {form.statement.examples.length > 1 && (
                <button type="button" onClick={() => removeExample(i)} className="text-gray-600 hover:text-red-400"><X className="size-3" /></button>
              )}
            </div>
            <Textarea rows={3} className={`${iCls} font-mono text-xs resize-y min-h-[60px]`} placeholder="Input (one value per line)" value={ex.input} onChange={(e) => setExample(i, 'input', e.target.value)} />
            <Textarea rows={2} className={`${iCls} font-mono text-xs resize-y min-h-[40px]`} placeholder="Output" value={ex.output} onChange={(e) => setExample(i, 'output', e.target.value)} />
            <Input className={`${iCls} text-xs`} placeholder="Explanation (optional)" value={ex.explanation} onChange={(e) => setExample(i, 'explanation', e.target.value)} />
          </div>
        ))}
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving} className="bg-white text-black hover:bg-gray-200">{saving ? 'Saving…' : 'Save Problem'}</Button>
        <Button type="button" variant="ghost" onClick={onCancel} className="text-gray-400">Cancel</Button>
      </div>
    </form>
  )
}

// ── Test case manager ────────────────────────────────────────────────────────
function TestCaseManager({ problem, onClose }) {
  const [testCases, setTestCases] = useState([])
  const [newInput, setNewInput] = useState('')
  const [newExpected, setNewExpected] = useState('')
  const [newIsSample, setNewIsSample] = useState(false)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState('')

  const load = useCallback(async () => {
    const { data } = await axios.get(`${SERVER}/api/problems/${problem._id}/testcases`, { headers: authHeaders() })
    setTestCases(data.testCases || [])
  }, [problem._id])

  useEffect(() => { load() }, [load])

  const add = async () => {
    if (!newInput.trim() || !newExpected.trim()) return
    setSaving(true)
    await axios.post(`${SERVER}/api/problems/${problem._id}/testcases`, [{ input: newInput, expectedOutput: newExpected, isSample: newIsSample }], { headers: authHeaders() })
    setNewInput(''); setNewExpected(''); setNewIsSample(false)
    await load(); setSaving(false)
  }

  const toggleSample = async (tc) => {
    await axios.patch(`${SERVER}/api/problems/${problem._id}/testcases/${tc._id}`, { isSample: !tc.isSample }, { headers: authHeaders() })
    await load()
  }

  const remove = async (tcId) => {
    await axios.delete(`${SERVER}/api/problems/${problem._id}/testcases/${tcId}`, { headers: authHeaders() })
    await load()
  }

  const generateWithAI = async () => {
    setGenerating(true); setGenError('')
    try {
      await axios.post(`${SERVER}/api/problems/${problem._id}/generate-testcases`, {}, { headers: authHeaders() })
      await load()
    } catch (e) { setGenError(e?.response?.data?.message || 'AI generation failed.') }
    setGenerating(false)
  }

  const sampleCount = testCases.filter(tc => tc.isSample).length
  const hiddenCount = testCases.filter(tc => !tc.isSample).length
  const iCls = 'bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-600 font-mono text-xs'

  return (
    <Modal title={`Test Cases — ${problem.title}`} onClose={onClose}>
      <div className="mb-4 flex items-center gap-3">
        <Button onClick={generateWithAI} disabled={generating}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 flex items-center gap-2 flex-1">
          {generating ? (<><svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>AI is generating…</>) : 'Generate with AI'}
        </Button>
        <div className="text-right text-xs text-gray-500 shrink-0 space-y-0.5">
          <p><span className="text-emerald-400 font-medium">{sampleCount}</span> sample</p>
          <p><span className="text-gray-400 font-medium">{hiddenCount}</span> hidden</p>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-emerald-400"/>Sample — shown to user, used for <strong className="text-gray-300">Run</strong></span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-gray-600"/>Hidden — only used for <strong className="text-gray-300">Submit</strong></span>
      </div>

      {genError && <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 mb-3">{genError}</p>}

      <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
        {testCases.length === 0 && !generating && (
          <p className="text-sm text-gray-500 text-center py-4">No test cases yet. Generate with AI or add manually below.</p>
        )}
        {testCases.map((tc, i) => (
          <div key={tc._id} className={`rounded-xl border p-3 space-y-1.5 ${tc.isSample ? 'border-emerald-500/25 bg-emerald-500/5' : 'border-white/10'}`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Case {i + 1}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tc.isSample ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/5 text-gray-500'}`}>
                  {tc.isSample ? 'Sample' : 'Hidden'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => toggleSample(tc)}
                  className={`rounded-lg border px-2 py-1 text-xs transition-colors ${tc.isSample ? 'border-gray-600 text-gray-400 hover:text-white hover:border-white/20' : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'}`}
                  title={tc.isSample ? 'Mark as hidden' : 'Mark as sample'}>
                  {tc.isSample ? 'Make hidden' : 'Make sample'}
                </button>
                <button onClick={() => remove(tc._id)} className="rounded-lg p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-400/10">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
            <pre className="text-xs text-gray-300 bg-black/30 rounded p-2 whitespace-pre-wrap break-all"><span className="text-gray-600">in: </span>{tc.input}</pre>
            <pre className="text-xs text-gray-300 bg-black/30 rounded p-2 whitespace-pre-wrap break-all"><span className="text-gray-600">out: </span>{tc.expectedOutput}</pre>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Add Manually</p>
        <Textarea className={`${iCls} min-h-[60px]`} placeholder="Input (stdin)" value={newInput} onChange={(e) => setNewInput(e.target.value)} />
        <Textarea className={`${iCls} min-h-[60px]`} placeholder="Expected Output (stdout)" value={newExpected} onChange={(e) => setNewExpected(e.target.value)} />
        <label className="flex cursor-pointer items-center gap-3 select-none py-1">
          <div className={`relative h-5 w-9 rounded-full transition-colors ${newIsSample ? 'bg-emerald-500' : 'bg-white/10'}`} onClick={() => setNewIsSample(v => !v)}>
            <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${newIsSample ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </div>
          <span className="text-xs text-gray-300">
            {newIsSample ? <><span className="text-emerald-400 font-medium">Sample</span> — visible to users, used for Run</> : <><span className="text-gray-400 font-medium">Hidden</span> — only used for Submit</>}
          </span>
        </label>
        <Button onClick={add} disabled={saving} className="bg-white text-black hover:bg-gray-200 w-full">{saving ? 'Adding…' : 'Add Test Case'}</Button>
      </div>
    </Modal>
  )
}

// ── Exercise manager ─────────────────────────────────────────────────────────
function ExerciseManager({ allProblems }) {
  const [exercises, setExercises] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formTitle, setFormTitle] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formProblems, setFormProblems] = useState([])

  const iCls = 'bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-600'

  const load = useCallback(async () => {
    const { data } = await axios.get(`${SERVER}/api/exercises`, { headers: authHeaders() })
    setExercises(data.exercises || [])
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setEditTarget(null); setFormTitle(''); setFormDesc(''); setFormProblems([]); setShowForm(true) }
  const openEdit = (ex) => {
    setEditTarget(ex); setFormTitle(ex.title); setFormDesc(ex.description || '')
    setFormProblems((ex.problems || []).map(p => String(p._id || p)))
    setShowForm(true)
  }

  const toggleProblem = (id) => {
    const sid = String(id)
    setFormProblems(prev => prev.includes(sid) ? prev.filter(x => x !== sid) : [...prev, sid])
  }

  const save = async () => {
    if (!formTitle.trim()) return
    setSaving(true)
    try {
      const payload = { title: formTitle.trim(), description: formDesc, problems: formProblems }
      if (editTarget?._id) {
        await axios.put(`${SERVER}/api/exercises/${editTarget._id}`, payload, { headers: authHeaders() })
      } else {
        await axios.post(`${SERVER}/api/exercises`, payload, { headers: authHeaders() })
      }
      await load(); setShowForm(false)
    } catch (e) { alert(e?.response?.data?.message || 'Save failed') }
    setSaving(false)
  }

  const del = async (id) => {
    if (!confirm('Delete this exercise?')) return
    await axios.delete(`${SERVER}/api/exercises/${id}`, { headers: authHeaders() })
    await load()
  }

  const diffColor = { easy: 'text-emerald-400', medium: 'text-amber-400', hard: 'text-rose-400' }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm text-gray-500">Create exercise sets and assign problems to them.</p>
        <Button onClick={openCreate} className="bg-white text-black hover:bg-gray-200 flex items-center gap-2">
          <Plus className="size-4" /> New Exercise
        </Button>
      </div>

      {exercises.length === 0 && (
        <Card className="border-border bg-[#111]">
          <CardContent className="p-8 text-center text-gray-500 text-sm">No exercises yet. Create one to get started.</CardContent>
        </Card>
      )}

      {exercises.map((ex) => (
        <Card key={ex._id} className="border-border bg-[#111] hover:border-white/20 transition-colors">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium text-white truncate">{ex.title}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-gray-500">{ex.problemCount ?? (ex.problems?.length ?? 0)} problems</span>
                {ex.description && <span className="text-xs text-gray-600 truncate max-w-[300px]">{ex.description}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => openEdit(ex)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"><Pencil className="size-4" /></button>
              <button onClick={() => del(ex._id)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10"><Trash2 className="size-4" /></button>
            </div>
          </CardContent>
        </Card>
      ))}

      {showForm && (
        <Modal title={editTarget ? 'Edit Exercise' : 'New Exercise'} onClose={() => setShowForm(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">Title</label>
              <Input className={iCls} value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="e.g. Arrays & Hashing" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">Description (optional)</label>
              <Textarea className={`${iCls} min-h-[70px]`} value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="Short description shown on the exercise card" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                Problems <span className="normal-case text-gray-600">({formProblems.length} selected)</span>
              </label>
              <div className="max-h-[40vh] overflow-y-auto space-y-1.5 pr-1">
                {allProblems.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No problems available. Create some in the Problems tab first.</p>}
                {allProblems.map(p => {
                  const selected = formProblems.includes(String(p._id))
                  return (
                    <button key={p._id} type="button" onClick={() => toggleProblem(p._id)}
                      className={`w-full text-left rounded-lg border px-3 py-2.5 transition-colors ${selected ? 'border-indigo-500/40 bg-indigo-500/10' : 'border-white/10 bg-[#0a0a0a] hover:border-white/20'}`}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-white truncate">{p.title}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs font-medium ${diffColor[p.difficulty] || 'text-gray-400'}`}>{p.difficulty}</span>
                          {selected && <CheckCircle2 className="size-4 text-indigo-400" />}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <Button onClick={save} disabled={saving || !formTitle.trim()} className="bg-white text-black hover:bg-gray-200 flex-1">
                {saving ? 'Saving…' : editTarget ? 'Save Changes' : 'Create Exercise'}
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)} className="text-gray-400">Cancel</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState('problems')
  const [problems, setProblems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [tcTarget, setTcTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [importUrl, setImportUrl] = useState('')
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState('')

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
      await load(); setShowForm(false)
    } catch (e) { alert(e?.response?.data?.message || 'Save failed') }
    setSaving(false)
  }

  const deleteProblem = async (id) => {
    if (!confirm('Delete this problem?')) return
    await axios.delete(`${SERVER}/api/problems/${id}`, { headers: authHeaders() })
    await load()
  }

  const handleImport = async () => {
    if (!importUrl.trim()) return
    setImporting(true); setImportError('')
    try {
      await axios.post(`${SERVER}/api/problems/import-leetcode`, { url: importUrl }, { headers: authHeaders() })
      await load(); setShowImport(false); setImportUrl('')
    } catch (e) { setImportError(e?.response?.data?.message || 'Import failed') }
    setImporting(false)
  }

  const diffColor = { easy: 'text-emerald-400', medium: 'text-amber-400', hard: 'text-rose-400' }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-500">Admin</p>
          <h1 className="text-2xl font-semibold text-white mt-1">Content Management</h1>
        </div>
        {activeTab === 'problems' && (
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowImport(true)} variant="ghost" className="border border-white/10 text-gray-300 hover:text-white hover:border-white/20 flex items-center gap-2">
              <Import className="size-4" /> Import LeetCode
            </Button>
            <Button onClick={openCreate} className="bg-white text-black hover:bg-gray-200 flex items-center gap-2">
              <Plus className="size-4" /> New Problem
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10 mb-6 w-fit">
        {[['problems', 'Problems'], ['exercises', 'Exercises']].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === key ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Exercises tab */}
      {activeTab === 'exercises' && <ExerciseManager allProblems={problems} />}

      {/* Problems tab */}
      {activeTab === 'problems' && (
        <div className="space-y-3">
          {problems.length === 0 && (
            <Card className="border-border bg-[#111]">
              <CardContent className="p-8 text-center text-gray-500 text-sm">No problems yet. Create one to get started.</CardContent>
            </Card>
          )}
          {problems.map((p) => (
            <Card key={p._id} className="border-border bg-[#111] hover:border-white/20 transition-colors">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-white truncate">{p.title}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`text-xs font-medium ${diffColor[p.difficulty] || 'text-gray-400'}`}>{p.difficulty}</span>
                    {(p.tags || []).slice(0, 3).map(t => (
                      <span key={t} className="text-xs text-gray-500 bg-white/5 rounded-full px-2 py-0.5">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setTcTarget(p)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10" title="Test Cases"><ListChecks className="size-4" /></button>
                  <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10" title="Edit"><Pencil className="size-4" /></button>
                  <button onClick={() => deleteProblem(p._id)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10" title="Delete"><Trash2 className="size-4" /></button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <Modal title={editTarget ? 'Edit Problem' : 'New Problem'} onClose={() => setShowForm(false)}>
          <ProblemForm initial={editTarget || emptyProblem()} onSave={save} onCancel={() => setShowForm(false)} saving={saving} />
        </Modal>
      )}
      {tcTarget && <TestCaseManager problem={tcTarget} onClose={() => setTcTarget(null)} />}
      {showImport && (
        <Modal title="Import from LeetCode" onClose={() => { setShowImport(false); setImportError('') }}>
          <div className="space-y-4">
            <p className="text-sm text-gray-400">Paste a LeetCode problem URL or slug.</p>
            <Input className="bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-600"
              placeholder="https://leetcode.com/problems/two-sum/ or two-sum"
              value={importUrl} onChange={e => setImportUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleImport()} />
            {importError && <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{importError}</p>}
            <div className="flex gap-3">
              <Button onClick={handleImport} disabled={importing || !importUrl.trim()} className="bg-white text-black hover:bg-gray-200 flex-1">{importing ? 'Importing...' : 'Import Problem'}</Button>
              <Button variant="ghost" onClick={() => { setShowImport(false); setImportError('') }} className="text-gray-400">Cancel</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
