import { useEffect, useState } from "react"
import axios from "axios"
import { ArrowLeft, Braces, CheckCircle2, FileText, Play, Send } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import ProblemPanel from "@/components/practice/ProblemPanel"
import CodeWorkspace from "@/components/practice/CodeWorkspace"
import LoadingState from "@/components/practice/LoadingState"

const SUPPORTED_LANGUAGES = ["javascript", "python", "cpp", "java"]
const LANGUAGE_ALIASES = {
  js: "javascript",
  javascript: "javascript",
  node: "javascript",
  python: "python",
  py: "python",
  cpp: "cpp",
  "c++": "cpp",
  cxx: "cpp",
  java: "java",
}

const MOCK_PROBLEMS = {
  "two-sum": {
    id: "two-sum",
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Map"],
    statement: {
      paragraphs: [
        "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`.",
        "You may assume that each input has exactly one solution, and you may not use the same element twice.",
        "You can return the answer in any order.",
        "**Input format:** First line contains the array elements space-separated. Second line contains the target.",
        "**Output format:** Print the two indices space-separated.",
      ],
      examples: [
        {
          input: "nums = [2,7,11,15]\ntarget = 9",
          stdin: "2 7 11 15\n9",
          output: "0 1",
          explanation: "nums[0] + nums[1] = 2 + 7 = 9, so return [0, 1].",
        },
        {
          input: "nums = [3,2,4]\ntarget = 6",
          stdin: "3 2 4\n6",
          output: "1 2",
          explanation: "nums[1] + nums[2] = 2 + 4 = 6.",
        },
      ],
      constraints: [
        "2 <= nums.length <= 10^4",
        "-10^9 <= nums[i] <= 10^9",
        "-10^9 <= target <= 10^9",
        "Only one valid answer exists.",
      ],
    },
    allowedLanguages: ["javascript", "python", "cpp", "java"],
    defaultLanguage: "python",
    starterCode: {
      python: `nums = list(map(int, input().split()))\ntarget = int(input())\n\n# Write your solution here\n# Print the two indices: print(i, j)\n`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n')\nconst nums = lines[0].split(' ').map(Number)\nconst target = Number(lines[1])\n\n// Write your solution here\n// console.log(i, j)\n`,
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    vector<int> nums;\n    string line; getline(cin, line);\n    istringstream ss(line);\n    int x; while (ss >> x) nums.push_back(x);\n    int target; cin >> target;\n    // Write your solution here\n    // cout << i << " " << j << endl;\n    return 0;\n}\n`,
      java: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String[] parts = sc.nextLine().trim().split(" ");\n        int[] nums = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);\n        int target = sc.nextInt();\n        // Write your solution here\n        // System.out.println(i + " " + j);\n    }\n}\n`,
    },
  },
}

const normalizeLanguage = (language) => {
  if (!language) return ""
  return LANGUAGE_ALIASES[String(language).trim().toLowerCase()] || ""
}

const toList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (typeof value === "string") {
    return value
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

const normalizeExamples = (value) => {
  if (!Array.isArray(value)) return []

  return value
    .map((example, index) => {
      if (typeof example === "string") {
        return {
          id: `example-${index}`,
          input: example,
          output: "",
          explanation: "",
        }
      }

      return {
        id: example.id || `example-${index}`,
        input: example.input || "",           // human-readable display text
        stdin: example.stdin || example.input || "", // actual stdin piped to the container
        output: example.output || example.stdout || "",
        explanation: example.explanation || "",
      }
    })
    .filter((example) => example.input || example.output || example.explanation)
}

const normalizeProblem = (rawProblem, fallbackId) => {
  const source = rawProblem?.problem || rawProblem?.data?.problem || rawProblem?.data || rawProblem
  const starterCodeSource = source?.starterCode || source?.starter_code || {}
  const starterCode = {}

  Object.entries(starterCodeSource).forEach(([language, code]) => {
    const normalizedLanguage = normalizeLanguage(language)
    if (normalizedLanguage) {
      starterCode[normalizedLanguage] = typeof code === "string" ? code : ""
    }
  })

  const allowedLanguagesSource =
    source?.allowedLanguages ||
    source?.allowed_languages ||
    source?.languages ||
    Object.keys(starterCode)

  const allowedLanguages = toList(allowedLanguagesSource)
    .map(normalizeLanguage)
    .filter((language, index, array) => language && SUPPORTED_LANGUAGES.includes(language) && array.indexOf(language) === index)

  const orderedLanguages = SUPPORTED_LANGUAGES.filter((language) => allowedLanguages.includes(language))

  const statementSource = source?.statement || {}
  const paragraphs =
    statementSource.paragraphs ||
    statementSource.description ||
    source?.description ||
    source?.statementText ||
    source?.body ||
    []

  const normalizedStarterCode = {}
  orderedLanguages.forEach((language) => {
    normalizedStarterCode[language] = starterCode[language] || ""
  })

  const defaultLanguage =
    normalizeLanguage(source?.defaultLanguage || source?.default_language) ||
    orderedLanguages[0] ||
    "javascript"

  return {
    id: source?.id || source?._id || fallbackId,
    slug: source?.slug || fallbackId,
    title: source?.title || "Untitled Problem",
    difficulty: source?.difficulty || "Unrated",
    tags: toList(source?.tags || source?.topics),
    statement: {
      paragraphs: toList(paragraphs),
      examples: normalizeExamples(statementSource.examples || source?.examples),
      constraints: toList(statementSource.constraints || source?.constraints),
    },
    allowedLanguages: orderedLanguages.length ? orderedLanguages : ["javascript"],
    defaultLanguage,
    starterCode: normalizedStarterCode,
  }
}

const getMockProblem = (problemId) => {
  console.log("bloddy mock problem",MOCK_PROBLEMS[problemId]);
  return MOCK_PROBLEMS[problemId] || null
}

const wait = (ms) => new Promise((resolve) => {
  window.setTimeout(resolve, ms)
})

const emptyExecutionState = {
  status: "idle",
  data: null,
  error: "",
}

const PracticePage = () => {
  const { problemId } = useParams()
  const nav = useNavigate()
  const server = import.meta.env.VITE_SERVER?.replace(/\/$/, "")

  const [problem, setProblem] = useState(null)
  const [isMockProblem, setIsMockProblem] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [codeByLanguage, setCodeByLanguage] = useState({})
  const [resultTab, setResultTab] = useState("testcase")
  const [lastResultType, setLastResultType] = useState("run")
  const [customInput, setCustomInput] = useState("")
  const [activeMobilePane, setActiveMobilePane] = useState("problem")
  const [customRunState, setCustomRunState] = useState(emptyExecutionState)
  const [runState, setRunState] = useState(emptyExecutionState)
  const [submitState, setSubmitState] = useState(emptyExecutionState)

  useEffect(() => {
    let cancelled = false

    const fetchProblem = async () => {
      const mockProblem = getMockProblem(problemId) // this program id we are getting from the url 
      console.log("bloddy mock problem",mockProblem);
      if (!server) {
        if (mockProblem) {
          const normalizedProblem = normalizeProblem(mockProblem, problemId)
          const initialCode = {}

          normalizedProblem.allowedLanguages.forEach((language) => {
            initialCode[language] = normalizedProblem.starterCode[language] || ""
          })

          setProblem(normalizedProblem)
          setSelectedLanguage(normalizedProblem.defaultLanguage)
          setCodeByLanguage(initialCode)
          setCustomInput(normalizedProblem.statement.examples[0]?.input || "")
          setIsMockProblem(true)
          setLoading(false)
          return
        }

        setLoading(false)
        setError("VITE_SERVER is not configured for problem fetching.")
        return
      }

      setLoading(true)
      setError("")
      setProblem(null)
      setIsMockProblem(false)
      setRunState(emptyExecutionState)
      setSubmitState(emptyExecutionState)
      setLastResultType("run")
      setResultTab("testcase")
      setActiveMobilePane("problem")
      setCustomInput("")

      try {
        const response = await axios.get(`${server}/api/problems/${problemId}`)
        if (cancelled) return

        const normalizedProblem = normalizeProblem(response.data, problemId)
        const initialLanguage = normalizedProblem.defaultLanguage
        const initialCode = {}

        normalizedProblem.allowedLanguages.forEach((language) => {
          initialCode[language] = normalizedProblem.starterCode[language] || ""
        })

        setProblem(normalizedProblem)
        setSelectedLanguage(initialLanguage)
        setCodeByLanguage(initialCode)
        setCustomInput(normalizedProblem.statement.examples[0]?.input || "")
        setIsMockProblem(false)
      } catch (fetchError) {
        if (cancelled) return

        if (mockProblem) {
          const normalizedProblem = normalizeProblem(mockProblem, problemId)
          const initialCode = {}

          normalizedProblem.allowedLanguages.forEach((language) => {
            initialCode[language] = normalizedProblem.starterCode[language] || ""
          })

          setProblem(normalizedProblem)
          setSelectedLanguage(normalizedProblem.defaultLanguage)
          setCodeByLanguage(initialCode)
          setCustomInput(normalizedProblem.statement.examples[0]?.input || "")
          setIsMockProblem(true)
          setError("")
          return
        }
        if (fetchError) {
          console.log("we got an fetch error")
          // console.log(fetchError, "fetchError");
          console.log("do we not have a server here ?",server)
          console.log(mockProblem, "mockProblem this is it");
          console.log("we have a mock problem");
          if (mockProblem) {
            const normalizedProblem = normalizeProblem(mockProblem, problemId)
            const initialCode = {}
  
            normalizedProblem.allowedLanguages.forEach((language) => {
              initialCode[language] = normalizedProblem.starterCode[language] || ""
            })
  
            setProblem(normalizedProblem)
            setSelectedLanguage(normalizedProblem.defaultLanguage)
            setCodeByLanguage(initialCode)
            setCustomInput(normalizedProblem.statement.examples[0]?.input || "")
            setIsMockProblem(true)
            setLoading(false)
            return
          }
          
          setLoading(false)
          setError("VITE_SERVER is not configured for problem fetching.")
          return
          
          
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }

     
    }

    fetchProblem()

    return () => {
      cancelled = true
    }
  }, [problemId, server])

  const currentCode = codeByLanguage[selectedLanguage] || ""

  const updateCode = (value) => {
    setCodeByLanguage((currentState) => ({
      ...currentState,
      [selectedLanguage]: value,
    }))
  }

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language)
    setCodeByLanguage((currentState) => {
      if (currentState[language] !== undefined) {
        return currentState
      }

      return {
        ...currentState,
        [language]: problem?.starterCode?.[language] || "",
      }
    })
  }

  const handleCustomRun = async () => {
    if (!problem || !selectedLanguage) return
    setCustomRunState({ status: "loading", data: null, error: "" })
    setResultTab("testcase")
    setActiveMobilePane("result")

    try {
      if (isMockProblem || !server) {
        await wait(500)
        setCustomRunState({ status: "success", data: { stdout: "mock output\n", stderr: "", exitCode: 0, timedOut: false }, error: "" })
        return
      }
      const auth = JSON.parse(localStorage.getItem("AuthState"))
      const response = await axios.post(
        `${server}/api/submissions/custom-run`,
        { code: currentCode, language: selectedLanguage, input: customInput },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      )
      setCustomRunState({ status: "success", data: response.data, error: "" })
    } catch (err) {
      setCustomRunState({ status: "error", data: null, error: err?.response?.data?.message || "Custom run failed." })
    }
  }

  const handleRun = async () => {
    if (!problem || !selectedLanguage) return

    setRunState({
      status: "loading",
      data: null,
      error: "",
    })
    setResultTab("result")
    setLastResultType("run")
    setActiveMobilePane("result")

    try {
      if (isMockProblem || !server) {
        await wait(500)
        setRunState({
          status: "success",
          data: {
            results: [
              { index: 0, passed: false, stdout: "hello world\n", stderr: "", exitCode: 0, timedOut: false, input: "nums = [2,7,11,15]\ntarget = 9", expectedOutput: "[0,1]" },
            ],
          },
          error: "",
        })
        return
      }

      const auth = JSON.parse(localStorage.getItem("AuthState"))
      const response = await axios.post(
        `${server}/api/submissions/run`,
        { code: currentCode, language: selectedLanguage, problemId: problem.id },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      )

      setRunState({
        status: "success",
        data: { results: response.data.results },
        error: "",
      })
    } catch (runError) {
      setRunState({
        status: "error",
        data: runError?.response?.data || null,
        error:
          runError?.response?.data?.message ||
          runError?.response?.data?.error ||
          "Run failed. Please try again.",
      })
    }
  }

  const handleSubmit = async () => {
    if (!problem || !selectedLanguage) return

    setSubmitState({
      status: "loading",
      data: null,
      error: "",
    })
    setResultTab("result")
    setLastResultType("submit")
    setActiveMobilePane("result")

    try {
      if (isMockProblem || !server) {
        await wait(700)
        setSubmitState({
          status: "success",
          data: {
            status: "accepted",
            passedCount: 15,
            totalCount: 15,
            runtimeMs: 42,
            memoryKb: 18432,
            message: "Mock judge accepted this solution for UI preview mode.",
          },
          error: "",
        })
        return
      }

      const auth = JSON.parse(localStorage.getItem("AuthState"))
      const authHeaders = { Authorization: `Bearer ${auth?.token}` }

      const { data: createData } = await axios.post(
        `${server}/api/submissions`,
        { problemId: problem.id, code: currentCode, language: selectedLanguage },
        { headers: authHeaders }
      )
      const submissionId = createData.submissionId

      let done = false
      let verdict = "pending"
      for (let i = 0; i < 30 && !done; i++) {
        await new Promise((r) => setTimeout(r, 1000))
        const { data: statusData } = await axios.get(
          `${server}/api/submissions/${submissionId}/status`,
          { headers: authHeaders }
        )
        done = statusData.done
        verdict = statusData.verdict
      }

      const { data: fullData } = await axios.get(
        `${server}/api/submissions/${submissionId}`,
        { headers: authHeaders }
      )
      const results = fullData.submission?.results || []

      setSubmitState({
        status: "success",
        data: {
          status: verdict,
          passedCount: results.filter((r) => r.passed).length,
          totalCount: results.length,
          runtimeMs: null,
          memoryKb: null,
        },
        error: "",
      })
    } catch (submitError) {
      setSubmitState({
        status: "error",
        data: submitError?.response?.data || null,
        error:
          submitError?.response?.data?.message ||
          submitError?.response?.data?.error ||
          "Submission failed. Please try again.",
      })
    }
  }

  if (loading) {
    return <LoadingState />
  }

  if (error || !problem) {
    console.log(error, "error" , problem);
    return (
      <div className="min-h-screen bg-[#050816] px-4 py-6 text-white md:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-5 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="flex items-center gap-3 text-amber-300">
            <FileText className="size-5" />
            <p className="text-sm uppercase tracking-[0.28em] text-white/60">Problem Workspace</p>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            This problem workspace is not available right now
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-white/70 md:text-base">
            {error || "We couldn't find a problem payload for this route."}
          </p>
        </div>
      </div>
    )
  }

  const isSolved = submitState.status === 'success' && submitState.data?.status === 'accepted'

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(55,95,255,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(25,211,182,0.18),_transparent_24%),linear-gradient(180deg,_rgba(255,255,255,0.02),_transparent_36%)]" />

      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-3 py-3 sm:px-4 md:h-screen md:px-5 md:py-5">
        {/* Top bar: back button + solved banner */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => nav(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>

          {isSolved && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 text-sm text-emerald-300 font-medium animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle2 className="size-4" />
              Problem solved! Great work 🎉
            </div>
          )}
        </div>

        <main className="grid flex-1 gap-4 md:min-h-0 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]">
          <section className={activeMobilePane === "problem" ? "block md:min-h-0" : "hidden md:min-h-0 md:block"}>
            <ProblemPanel problem={problem} />
          </section>

          <section className={activeMobilePane === "problem" ? "hidden md:min-h-0 md:block" : "block md:min-h-0"}>
            <CodeWorkspace
              allowedLanguages={problem.allowedLanguages}
              code={currentCode}
              customInput={customInput}
              customRunState={customRunState}
              lastResultType={lastResultType}
              onCodeChange={updateCode}
              onCustomInputChange={setCustomInput}
              onCustomRun={handleCustomRun}
              onLanguageChange={handleLanguageChange}
              onResultTabChange={setResultTab}
              onRun={handleRun}
              onSubmit={handleSubmit}
              resultTab={resultTab}
              runState={runState}
              selectedLanguage={selectedLanguage}
              submitState={submitState}
            />
          </section>
        </main>
      </div>
    </div>
  )
}

export default PracticePage
