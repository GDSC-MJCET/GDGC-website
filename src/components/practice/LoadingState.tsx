import { LoaderCircle } from "lucide-react"

const LoadingState = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050816] px-4 text-white">
      <div className="flex w-full max-w-xl flex-col items-center gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 p-4 text-cyan-200">
          <LoaderCircle className="size-8 animate-spin" />
        </div>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.38em] text-white/50">Preparing Workspace</p>
          <h1 className="text-2xl font-semibold tracking-tight">Loading problem and editor state</h1>
          <p className="text-sm leading-7 text-white/70">
            Pulling the problem details and getting the coding surface ready for you.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoadingState
