import { useEffect, useState } from "react"
import axios from "axios"
import { Braces, FileText, Play, Send } from "lucide-react"
import { useParams } from "react-router-dom"
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
      ],
      examples: [
        {
          input: "nums = [2,7,11,15]\ntarget = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] equals 9, we return [0, 1].",
        },
        {
          input: "nums = [3,2,4]\ntarget = 6",
          output: "[1,2]",
          explanation: "The pair 2 and 4 adds up to 6.",
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
    defaultLanguage: "javascript",
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // Write your solution here\n  return []\n}`,
      python: `class Solution:\n    def twoSum(self, nums, target):\n        # Write your solution here\n        return []`,
      cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n        return {};\n    }\n};`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[] {};\n    }\n}`,
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
        input: example.input || example.stdin || "",
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
  const [runState, setRunState] = useState(emptyExecutionState)
  const [submitState, setSubmitState] = useState(emptyExecutionState)

  useEffect(() => {
    let cancelled = false

    const fetchProblem = async () => {
      const mockProblem = getMockProblem(problemId) // this program id we are getting from the url 

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
        const response = await axios.get(`${server}/api/v1/problems/${problemId}`)
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

        setError(
          fetchError?.response?.data?.message ||
            fetchError?.response?.data?.error ||
            "We couldn't load this problem right now."
        )
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
            status: "success",
            stdout: "Sample testcase passed.\nOutput: [0,1]",
            stderr: "",
            runtimeMs: 8,
          },
          error: "",
        })
        return
      }

      const response = await axios.post(`${server}/api/v1/problems/${problemId}/run`, {
        language: selectedLanguage,
        code: currentCode,
        customInput,
      })

      setRunState({
        status: "success",
        data: response.data,
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

      const response = await axios.post(`${server}/api/v1/problems/${problemId}/submit`, {
        language: selectedLanguage,
        code: currentCode,
      })

      setSubmitState({
        status: "success",
        data: response.data,
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

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(55,95,255,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(25,211,182,0.18),_transparent_24%),linear-gradient(180deg,_rgba(255,255,255,0.02),_transparent_36%)]" />

      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-3 py-3 sm:px-4 md:h-screen md:px-5 md:py-5">
        
        <main className="grid flex-1 gap-4 md:min-h-0 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]">
          <section className={activeMobilePane === "problem" ? "block md:min-h-0" : "hidden md:min-h-0 md:block"}>
            <ProblemPanel problem={problem} />
          </section>

          <section className={activeMobilePane === "problem" ? "hidden md:min-h-0 md:block" : "block md:min-h-0"}>
            <CodeWorkspace
              allowedLanguages={problem.allowedLanguages}
              code={currentCode}
              customInput={customInput}
              lastResultType={lastResultType}
              onCodeChange={updateCode}
              onCustomInputChange={setCustomInput}
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
