import CodeMirror from "@uiw/react-codemirror"
import { cpp } from "@codemirror/lang-cpp"
import { java } from "@codemirror/lang-java"
import { javascript } from "@codemirror/lang-javascript"
import { python } from "@codemirror/lang-python"
import { oneDark } from "@codemirror/theme-one-dark"
import { Play, Send } from "lucide-react"
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
  lastResultType,
  onCodeChange,
  onCustomInputChange,
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
  const runPending = runState.status === "loading"
  const submitPending = submitState.status === "loading"
  const actionsDisabled = runPending || submitPending

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
          >
            <Play className={`size-4 ${runPending ? "animate-pulse" : ""}`} />
            {runPending ? "Running" : "Run"}
          </Button>
          <Button
            className="rounded-lg border border-white/10 bg-white text-black hover:bg-gray-200"
            disabled={actionsDisabled}
            onClick={onSubmit}
            size="sm"
          >
            <Send className={`size-4 ${submitPending ? "animate-pulse" : ""}`} />
            {submitPending ? "Submitting" : "Submit"}
          </Button>
        </div>
      </div>

      <div className="grid flex-1 gap-4 xl:grid-rows-[minmax(0,1fr)_320px]">
        <div className="overflow-hidden rounded-2xl border border-border bg-[#111111] shadow-none">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-gray-600" />
              <span className="size-3 rounded-full bg-gray-500" />
              <span className="size-3 rounded-full bg-gray-400" />
            </div>
            <p className="text-xs uppercase tracking-[0.32em] text-gray-500">Solution</p>
          </div>

          <div className="practice-editor h-[420px] xl:h-full">
            <CodeMirror
              basicSetup={{
                autocompletion: true,
                bracketMatching: true,
                closeBrackets: true,
                highlightActiveLine: true,
                highlightActiveLineGutter: true,
                lineNumbers: true,
              }}
              className="h-full text-sm"
              extensions={[editorExtension]}
              height="100%"
              onChange={onCodeChange}
              theme={oneDark}
              value={code}
            />
          </div>
        </div>

        <ResultPanel
          customInput={customInput}
          lastResultType={lastResultType}
          onCustomInputChange={onCustomInputChange}
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
