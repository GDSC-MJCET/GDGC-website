import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const difficultyClassNames = {
  Easy: "border-emerald-400/30 bg-emerald-400/[0.12] text-emerald-200",
  Medium: "border-amber-400/30 bg-amber-400/[0.12] text-amber-200",
  Hard: "border-rose-400/30 bg-rose-400/[0.12] text-rose-200",
}

const CodeSample = ({ children }) => (
  <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 text-sm leading-7 text-gray-200">
    <code>{children}</code>
  </pre>
)

const ProblemPanel = ({ problem }) => {
  return (
    <Card className="h-full overflow-hidden rounded-2xl border-border bg-[#111111] shadow-none">
      <div className="flex h-full flex-col">
        <div className="border-b border-border px-5 py-5 md:px-7">
          <div className="flex flex-wrap items-center gap-3">
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
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-3xl">
            {problem.title}
          </h2>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto px-5 py-6 md:px-7">
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
                  <li
                    className="flex items-start gap-3 rounded-xl border border-border bg-background px-4 py-3"
                    key={constraint}
                  >
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
      </div>
    </Card>
  )
}

export default ProblemPanel
