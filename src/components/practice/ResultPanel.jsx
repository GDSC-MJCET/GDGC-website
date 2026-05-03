import { useEffect, useRef } from "react"
import { AlertCircle, CheckCircle2, Clock3, Play, Send, Terminal, TerminalSquare, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const statusStyles = {
  accepted: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  wrong_answer: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  compile_error: "border-rose-500/30 bg-rose-500/10 text-rose-200",
  runtime_error: "border-rose-500/30 bg-rose-500/10 text-rose-200",
  time_limit_exceeded: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200",
}

const formatStatus = (status) =>
  String(status || "idle")
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")

const isEofError = (stderr) =>
  typeof stderr === "string" && stderr.includes("EOFError")

// ─── per-example card used in Run results ───────────────────────────────────
const ExampleResult = ({ result, index }) => {
  const { passed, stdout, stderr, timedOut, exitCode, expectedOutput, input } = result
  const label = timedOut ? "Time Limit" : passed ? "Passed" : "Wrong Answer"
  const color = timedOut
    ? "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300"
    : passed
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
    : "border-amber-500/30 bg-amber-500/10 text-amber-300"

  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      {/* header */}
      <div className={cn("flex items-center justify-between px-4 py-2 text-sm font-medium border-b border-border", color)}>
        <span>Example {index + 1}</span>
        <span className="flex items-center gap-1.5">
          {passed ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
          {label}
        </span>
      </div>

      <div className="divide-y divide-border text-sm">
        {input ? (
          <div className="px-4 py-3">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Input</p>
            <pre className="text-gray-300 whitespace-pre-wrap break-all">{input}</pre>
          </div>
        ) : null}

        <div className="grid grid-cols-2 divide-x divide-border">
          <div className="px-4 py-3">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Expected</p>
            <pre className={cn("whitespace-pre-wrap break-all", passed ? "text-emerald-300" : "text-amber-300")}>
              {expectedOutput || <span className="italic text-gray-500">—</span>}
            </pre>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Your output</p>
            <pre className={cn("whitespace-pre-wrap break-all", passed ? "text-emerald-300" : "text-rose-300")}>
              {stdout?.trimEnd() || <span className="italic text-gray-500">no output</span>}
            </pre>
          </div>
        </div>

        {stderr ? (
          <div className="px-4 py-3">
            {isEofError(stderr) ? (
              <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-amber-200 text-xs mb-2">
                <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                <span>
                  <strong>No stdin provided.</strong> Your code calls <code className="rounded bg-white/10 px-1">input()</code> — go to the <strong>Testcase</strong> tab and add the input, then run again.
                </span>
              </div>
            ) : null}
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Stderr</p>
            <pre className="text-rose-300 whitespace-pre-wrap break-all text-xs">{stderr}</pre>
          </div>
        ) : null}
      </div>
    </div>
  )
}

// ─── main panel ─────────────────────────────────────────────────────────────
const ResultPanel = ({
  customInput,
  customRunState,
  lastResultType,
  onCustomInputChange,
  onCustomRun,
  onResultTabChange,
  resultTab,
  runState,
  submitState,
}) => {
  const activeExecution = lastResultType === "submit" ? submitState : runState
  const activeData = activeExecution.data || {}
  const runPending = runState.status === "loading"
  const submitPending = submitState.status === "loading"

  // For submit: derive overall verdict badge
  const submitStatus = activeData.status
  const submitResults = activeData.results || []

  // For run: array of per-example results
  const runResults = activeData.results || []
  const allRunPassed = runResults.length > 0 && runResults.every((r) => r.passed)

  const resultsRef = useRef(null)
  useEffect(() => {
    if (activeExecution.status === "success" && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [activeExecution.status])

  return (
    <div className="flex h-full min-h-[260px] flex-col rounded-2xl border border-border bg-[#111111]">
      {/* tab bar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-background p-1">
          <Button
            className={cn("rounded-lg px-4", resultTab === "testcase" ? "bg-white text-black hover:bg-white/90" : "text-gray-400")}
            onClick={() => onResultTabChange("testcase")}
            size="sm"
            variant="ghost"
          >
            <TerminalSquare className="size-4" />
            Testcase
          </Button>
          <Button
            className={cn("rounded-lg px-4", resultTab === "result" ? "bg-white text-black hover:bg-white/90" : "text-gray-400")}
            onClick={() => onResultTabChange("result")}
            size="sm"
            variant="ghost"
          >
            <CheckCircle2 className="size-4" />
            Result
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gray-500">
          {runPending && <Play className="size-4 animate-pulse text-gray-300" />}
          {submitPending && <Send className="size-4 animate-pulse text-gray-200" />}
          {lastResultType === "submit" ? "Judge Output" : "Run Output"}
        </div>
      </div>

      {/* body */}
      <div className="flex-1 overflow-y-auto p-4">
        {resultTab === "testcase" ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-white">Custom input</p>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                Type any input here and hit <strong>Run Custom</strong> to see raw output — no pass/fail, just whatever your code prints.
              </p>
            </div>
            <Textarea
              className="min-h-[100px] rounded-xl border-border bg-background px-4 py-4 font-mono text-sm text-gray-200 placeholder:text-gray-500 focus-visible:ring-white/20"
              onChange={(e) => onCustomInputChange(e.target.value)}
              placeholder={"2 7 11 15\n9"}
              value={customInput}
            />

            <Button
              className="w-full rounded-xl border border-white/10 bg-background text-white hover:bg-white/8"
              disabled={customRunState?.status === "loading"}
              onClick={onCustomRun}
              size="sm"
            >
              <Terminal className={`size-4 ${customRunState?.status === "loading" ? "animate-pulse" : ""}`} />
              {customRunState?.status === "loading" ? "Running…" : "Run Custom"}
            </Button>

            {/* custom run output */}
            {customRunState?.status === "success" && (
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-gray-500">Output</p>
                <pre className="min-h-[40px] overflow-x-auto rounded-xl border border-border bg-background p-4 text-sm leading-7 text-gray-200">
                  {customRunState.data?.stdout?.trimEnd() || <span className="italic text-gray-500">no output</span>}
                </pre>
                {customRunState.data?.stderr ? (
                  <>
                    <p className="text-xs uppercase tracking-widest text-rose-400">Stderr</p>
                    <pre className="overflow-x-auto rounded-xl border border-rose-500/25 bg-background p-3 text-xs text-rose-200">
                      {customRunState.data.stderr}
                    </pre>
                  </>
                ) : null}
              </div>
            )}
            {customRunState?.status === "error" && (
              <div className="flex items-start gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 p-3 text-sm text-rose-200">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                {customRunState.error}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4" ref={resultsRef}>
            {/* ── idle ── */}
            {activeExecution.status === "idle" && (
              <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-6 text-center">
                <CheckCircle2 className="size-10 text-gray-600" />
                <p className="mt-4 text-lg font-medium text-white">Run or submit to see results here</p>
                <p className="mt-2 max-w-md text-sm leading-7 text-gray-500">
                  Run tests your code against the sample examples. Submit runs all hidden test cases.
                </p>
              </div>
            )}

            {/* ── loading ── */}
            {activeExecution.status === "loading" && (
              <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-border bg-background px-6 text-center">
                <Clock3 className="size-10 animate-pulse text-gray-300" />
                <p className="mt-4 text-lg font-medium text-white">
                  {lastResultType === "submit" ? "Judging your solution…" : "Running against sample cases…"}
                </p>
              </div>
            )}

            {/* ── run results (per-example) ── */}
            {activeExecution.status === "success" && lastResultType === "run" && (
              <>
                <div className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium",
                  allRunPassed
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-200"
                )}>
                  {allRunPassed
                    ? <CheckCircle2 className="size-4" />
                    : <XCircle className="size-4" />}
                  {allRunPassed
                    ? `All ${runResults.length} sample case${runResults.length > 1 ? "s" : ""} passed`
                    : `${runResults.filter(r => r.passed).length} / ${runResults.length} sample cases passed`}
                </div>

                {runResults.map((r, i) => (
                  <ExampleResult key={i} result={r} index={i} />
                ))}
              </>
            )}

            {/* ── submit results ── */}
            {activeExecution.status === "success" && lastResultType === "submit" && (
              <>
                <div className={cn(
                  "flex items-center justify-between rounded-xl border px-4 py-4",
                  statusStyles[submitStatus] || "border-border bg-background text-white"
                )}>
                  <div className="flex items-center gap-3">
                    {submitStatus === "accepted"
                      ? <CheckCircle2 className="size-5" />
                      : <XCircle className="size-5" />}
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] opacity-70">Submission Status</p>
                      <p className="mt-1 text-lg font-semibold">{formatStatus(submitStatus)}</p>
                    </div>
                  </div>
                  {activeData.passedCount !== undefined && (
                    <p className="text-sm font-medium">
                      {activeData.passedCount}/{activeData.totalCount} cases
                    </p>
                  )}
                </div>

                {activeExecution.error && (
                  <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 p-4 text-sm leading-7 text-rose-100">
                    {activeExecution.error}
                  </div>
                )}
              </>
            )}

            {/* ── error (network / server) ── */}
            {activeExecution.status === "error" && (
              <div className="flex items-start gap-3 rounded-xl border border-rose-500/25 bg-rose-500/10 p-4 text-sm text-rose-100">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <p>{activeExecution.error || "Something went wrong. Please try again."}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ResultPanel
