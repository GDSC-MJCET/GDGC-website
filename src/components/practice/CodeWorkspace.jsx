import CodeMirror from "@uiw/react-codemirror"
import { cpp } from "@codemirror/lang-cpp"
import { java } from "@codemirror/lang-java"
import { javascript } from "@codemirror/lang-javascript"
import { python } from "@codemirror/lang-python"
import { oneDark } from "@codemirror/theme-one-dark"
import { Play, Send, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import LanguageSelector from "@/components/practice/LanguageSelector"
import ResultPanel from "@/components/practice/ResultPanel"

const languageExtensions = {
  javascript: javascript(),
  python: python(),
  cpp: cpp(),
  java: java(),
}

const CodeWorkspace = ({
  allowedLanguages,
  code,
  customInput,
  customRunState,
  lastResultType,
  onCodeChange,
  onCustomInputChange,
  onCustomRun,
  onLanguageChange,
  onResultTabChange,
  onRun,
  onSubmit,
  resultTab,
  runState,
  selectedLanguage,
  submitState,
}) => {
  const editorExtension = languageExtensions[selectedLanguage] || javascript()
  const customRunPending = customRunState?.status === "loading"
  const runPending = runState.status === "loading"
  const submitPending = submitState.status === "loading"
  const actionsDisabled = customRunPending || runPending || submitPending

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-[#111111] px-4 py-3 shadow-none md:px-5">
        <div className="flex flex-wrap items-center gap-3">
          <LanguageSelector languages={allowedLanguages} onValueChange={onLanguageChange} value={selectedLanguage} />
          <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs uppercase tracking-[0.28em] text-gray-400">
            {selectedLanguage || "language"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="rounded-lg border border-white/10 bg-background text-white hover:bg-white/8"
            disabled={actionsDisabled}
            onClick={onRun}
            size="sm"
            title="Run against sample test cases"
          >
            <Play className={`size-4 ${runPending ? "animate-pulse" : ""}`} />
            {runPending ? "Running…" : "Run"}
          </Button>
          <Button
            className="rounded-lg border border-white/10 bg-white text-black hover:bg-gray-200"
            disabled={actionsDisabled}
            onClick={onSubmit}
            size="sm"
          >
            <Send className={`size-4 ${submitPending ? "animate-pulse" : ""}`} />
            {submitPending ? "Submitting…" : "Submit"}
          </Button>
        </div>
      </div>

      <div className="grid flex-1 gap-4 xl:grid-rows-[minmax(0,1fr)_320px]">
        <div className="overflow-hidden p-2 border border-border bg-[#111111] shadow-none">
          <div className="practice-editor">
            <CodeMirror
              basicSetup={{
                autocompletion: true,
                bracketMatching: true,
                closeBrackets: true,
                highlightActiveLine: true,
                highlightActiveLineGutter: true,
                lineNumbers: true,
              }}
              className="text-md"
              extensions={[editorExtension]}
              onChange={onCodeChange}
              theme={oneDark}
              value={code}
            />
          </div>
        </div>

        <ResultPanel
          customInput={customInput}
          customRunState={customRunState}
          lastResultType={lastResultType}
          onCustomInputChange={onCustomInputChange}
          onCustomRun={onCustomRun}
          onResultTabChange={onResultTabChange}
          resultTab={resultTab}
          runState={runState}
          submitState={submitState}
        />
      </div>
    </div>
  )
}

export default CodeWorkspace
