import { AlertCircle, CheckCircle2, Clock3, Play, Send, TerminalSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const statusStyles = {
  accepted: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  wrong_answer: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  compile_error: "border-rose-500/30 bg-rose-500/10 text-rose-200",
  runtime_error: "border-rose-500/30 bg-rose-500/10 text-rose-200",
  time_limit_exceeded: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200",
}

const formatStatus = (status) => {
  if (!status) return "Idle"
  return String(status)
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

const MetricCard = ({ label, value }) => (
  <div className="rounded-xl border border-border bg-background px-4 py-3">
    <p className="text-xs uppercase tracking-[0.24em] text-gray-500">{label}</p>
    <p className="mt-2 text-lg font-semibold text-white">{value}</p>
  </div>
)

const ResultPanel = ({
  customInput,
  lastResultType,
  onCustomInputChange,
  onResultTabChange,
  resultTab,
  runState,
  submitState,
}) => {
  const activeExecution = lastResultType === "submit" ? submitState : runState
  const activeData = activeExecution.data || {}
  const activeStatus = activeData.status || (activeExecution.status === "error" ? "runtime_error" : "idle")
  const runPending = runState.status === "loading"
  const submitPending = submitState.status === "loading"

  return (
    <div className="flex h-full min-h-[260px] flex-col rounded-2xl border border-border bg-[#111111]">
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
          {runPending ? <Play className="size-4 animate-pulse text-gray-300" /> : null}
          {submitPending ? <Send className="size-4 animate-pulse text-gray-200" /> : null}
          {lastResultType === "submit" ? "Judge Output" : "Run Output"}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {resultTab === "testcase" ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-white">Custom testcase input</p>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                Use this for quick manual runs. Submission ignores this field and uses the judge cases instead.
              </p>
            </div>
            <Textarea
              className="min-h-[170px] rounded-xl border-border bg-background px-4 py-4 font-mono text-sm text-gray-200 placeholder:text-gray-500 focus-visible:ring-white/20"
              onChange={(event) => onCustomInputChange(event.target.value)}
              placeholder="Example: 5\n1 2 3 4 5"
              value={customInput}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {activeExecution.status === "idle" ? (
              <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-6 text-center">
                <CheckCircle2 className="size-10 text-gray-600" />
                <p className="mt-4 text-lg font-medium text-white">Run or submit to see results here</p>
                <p className="mt-2 max-w-md text-sm leading-7 text-gray-500">
                  Sample execution output, compilation feedback, and judge results will appear in this panel.
                </p>
              </div>
            ) : activeExecution.status === "loading" ? (
              <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-border bg-background px-6 text-center">
                <Clock3 className="size-10 animate-pulse text-gray-300" />
                <p className="mt-4 text-lg font-medium text-white">
                  {lastResultType === "submit" ? "Submitting your solution" : "Running your code"}
                </p>
                <p className="mt-2 text-sm leading-7 text-gray-500">
                  Waiting for the backend to finish execution and return the result payload.
                </p>
              </div>
            ) : (
              <>
                <div
                  className={cn(
                    "flex items-center justify-between rounded-xl border px-4 py-4",
                    statusStyles[activeStatus] || "border-border bg-background text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {activeExecution.status === "error" ? (
                      <AlertCircle className="size-5" />
                    ) : (
                      <CheckCircle2 className="size-5" />
                    )}
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] opacity-70">
                        {lastResultType === "submit" ? "Submission Status" : "Run Status"}
                      </p>
                      <p className="mt-1 text-lg font-semibold">{formatStatus(activeStatus)}</p>
                    </div>
                  </div>
                  {activeData.passedCount !== undefined && activeData.totalCount !== undefined ? (
                    <p className="text-sm font-medium">
                      {activeData.passedCount}/{activeData.totalCount} cases
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <MetricCard label="Runtime" value={activeData.runtimeMs !== undefined ? `${activeData.runtimeMs} ms` : "N/A"} />
                  <MetricCard label="Memory" value={activeData.memoryKb !== undefined ? `${activeData.memoryKb} KB` : "N/A"} />
                  <MetricCard label="Mode" value={lastResultType === "submit" ? "Judge" : "Custom / Sample"} />
                </div>

                {activeExecution.error || activeData.message ? (
                  <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 p-4 text-sm leading-7 text-rose-100">
                    {activeExecution.error || activeData.message}
                  </div>
                ) : null}

                {activeData.stdout ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-white">Standard output</p>
                    <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 text-sm leading-7 text-gray-200">
                      <code>{activeData.stdout}</code>
                    </pre>
                  </div>
                ) : null}

                {activeData.stderr ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-white">Standard error</p>
                    <pre className="overflow-x-auto rounded-xl border border-rose-500/25 bg-background p-4 text-sm leading-7 text-rose-100">
                      <code>{activeData.stderr}</code>
                    </pre>
                  </div>
                ) : null}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ResultPanel
