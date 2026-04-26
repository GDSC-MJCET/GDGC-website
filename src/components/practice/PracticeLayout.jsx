// import { Braces, ChevronRight, Code2, FileCode2, FolderKanban, Menu, X } from "lucide-react"
// import { useMemo, useState } from "react"
// import { NavLink, Outlet, useLocation, useMatch } from "react-router-dom"
// import gdg from "@/assets/gdg-logo.png"
// import { getMockProblem } from "@/components/practice/mockProblems"
// import { cn } from "@/lib/utils"
// import { div } from "framer-motion/client";

// const navItemClassName = ({ isActive }) =>
//   cn(
//     "flex items-center gap-3 rounded-md px-3 py-2 text-[13px] transition-colors",
//     isActive
//       ? "bg-white text-black"
//       : "text-gray-300 hover:bg-gray-800 hover:text-white"
//   )

// const PracticeLayout = () => {
//   return (
//     <div>
//     </div>
//   )
  // const [sidebarOpen, setSidebarOpen] = useState(false)
  // const location = useLocation()
  // const problemMatch = useMatch("/practice/:problemId")
  // const activeProblem = getMockProblem(problemMatch?.params?.problemId)

  // const headerCopy = useMemo(() => {
  //   if (problemMatch) {
  //     return {
  //       title: activeProblem?.title || "Problem Workspace",
  //       description: "Solve, run, and submit inside the dashboard-style coding workspace.",
  //       badge: activeProblem ? "Workspace" : "Problem",
  //     }
  //   }

  //   return {
  //     title: "Practice Problems",
  //     description: "Browse the practice set and open any problem in the dedicated solve workspace.",
  //     badge: "Problems",
  //   }
  // }, [activeProblem, problemMatch])

  // return (
  //   <div className="relative noto-sans-mono flex h-screen overflow-hidden bg-background text-foreground">
  //     {sidebarOpen ? (
  //       <div
  //         className="fixed inset-0 z-40 bg-black/60 md:hidden"
  //         onClick={() => setSidebarOpen(false)}
  //       />
  //     ) : null}

  //     <aside
  //       className={cn(
  //         "fixed z-50 flex h-screen w-[250px] flex-shrink-0 flex-col border-r border-border bg-background transition-transform duration-300 ease-in-out md:relative md:z-auto md:w-[18%] md:min-w-[210px]",
  //         sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
  //       )}
  //     >
  //       <div className="flex h-14 items-center justify-between border-b border-border px-4">
  //         <div className="flex items-center gap-3">
  //           <img alt="GDGC" className="h-8 w-8 rounded-full" src={gdg} />
  //           <div>
  //             <p className="text-[11px] uppercase tracking-[0.28em] text-gray-500">
  //               Practice
  //             </p>
  //             <p className="text-sm font-medium text-white">Workspace</p>
  //           </div>
  //         </div>

  //         <button
  //           className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white md:hidden"
  //           onClick={() => setSidebarOpen(false)}
  //         >
  //           <X className="size-5" />
  //         </button>
  //       </div>

  //       <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-5">
  //         <div className="space-y-2">
  //           <p className="text-[11px] uppercase tracking-[0.26em] text-gray-500">
  //             Navigation
  //           </p>
  //           <nav className="flex flex-col gap-2">
  //             <NavLink className={navItemClassName} end onClick={() => setSidebarOpen(false)} to="/practice">
  //               <FolderKanban className="size-4 flex-shrink-0 text-gray-400" />
  //               <span>Problems</span>
  //             </NavLink>
  //             {problemMatch ? (
  //               <NavLink
  //                 className={navItemClassName}
  //                 onClick={() => setSidebarOpen(false)}
  //                 to={location.pathname}
  //               >
  //                 <FileCode2 className="size-4 flex-shrink-0 text-gray-400" />
  //                 <span className="truncate">{activeProblem?.title || "Workspace"}</span>
  //               </NavLink>
  //             ) : null}
  //           </nav>
  //         </div>

  //         <div className="space-y-3">
  //           <p className="text-[11px] uppercase tracking-[0.26em] text-gray-500">
  //             Current View
  //           </p>
  //           <div className="rounded-xl border border-white/10 bg-[#111111] px-4 py-4">
  //             <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-gray-500">
  //               <Code2 className="size-4" />
  //               <span>{headerCopy.badge}</span>
  //             </div>
  //             <p className="mt-3 text-sm font-medium text-white">{headerCopy.title}</p>
  //             <p className="mt-2 text-xs leading-6 text-gray-400">
  //               {problemMatch
  //                 ? "Use the workspace on the right to code, run samples, and inspect results."
  //                 : "Pick a problem from the list to open the dedicated solve view."}
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //     </aside>

  //     <div className="flex flex-1 flex-col overflow-hidden bg-background">
  //       <header className="flex h-15 flex-shrink-0 items-center justify-between border-b border-border px-5 text-foreground">
  //         <div className="flex items-center gap-4">
  //           <button
  //             className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-gray-800 hover:text-white md:hidden"
  //             onClick={() => setSidebarOpen(true)}
  //           >
  //             <Menu className="size-5" />
  //           </button>

  //           <div className="min-w-0">
  //             <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-gray-500">
  //               <Braces className="size-3.5" />
  //               <span>{headerCopy.badge}</span>
  //             </div>
  //             <div className="mt-1 flex min-w-0 items-center gap-2">
  //               <h1 className="truncate text-base font-semibold text-white md:text-lg">
  //                 {headerCopy.title}
  //               </h1>
  //               {problemMatch ? <ChevronRight className="hidden size-4 text-gray-500 md:block" /> : null}
  //             </div>
  //           </div>
  //         </div>

  //         <div className="hidden max-w-xl text-right md:block">
  //           <p className="text-sm text-gray-400">{headerCopy.description}</p>
  //         </div>
  //       </header>

  //       <div className="flex-1 overflow-y-auto bg-background">
  //         <Outlet />
  //       </div>
  //     </div>
  //   </div>
//   // )
// }

// export default PracticeLayout
