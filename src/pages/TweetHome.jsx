import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Home, Settings, SquarePen, UserRound, Feeds } from "lucide-react";
import SidebarLink from "../components/SideBarLink";
const navItems = [
  { label: "Feed", to: "/tweets", icon: Home },
  { label: "My Tweets", to: "/tweets/me", icon: Feeds },
  { label: "My Profile", to: "/tweets/profile", icon: UserRound },
  { label: "Create Tweet", to: "/tweets/create", icon: SquarePen },
  { label: "Settings", to: "/tweets/settings", icon: Settings },
];



export default function TweetHomeLayout() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const authState = useMemo(() => {
    try {
      const raw = localStorage.getItem("AuthState");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const token = authState?.token;

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setCheckingAuth(false);
  }, [authState, navigate]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-sm text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-zinc-950/80 px-5 py-6 md:flex md:flex-col">
          <div className="mb-8">
            <div className="text-lg font-semibold tracking-tight text-white">GDGC Tweets</div>
            <div className="mt-1 text-xs text-zinc-500">Casual discussions</div>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <SidebarLink key={item.to} to={item.to} icon={item.icon}>
                {item.label}
              </SidebarLink>
            ))}
          </nav>

          <div className="mt-auto pt-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-medium text-white">Logged in</p>
              <p className="mt-1 text-xs text-zinc-400">
                Your token is available in localStorage.AuthState
              </p>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="border-b border-white/10 px-5 py-4 md:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-white">Home</h1>
                <p className="mt-1 text-sm text-zinc-400">Feed and tweet tools live here</p>
              </div>
              <div className="md:hidden">
                <select
                  className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none"
                  defaultValue="/tweets"
                  onChange={(e) => navigate(e.target.value)}
                >
                  {navItems.map((item) => (
                    <option key={item.to} value={item.to}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="px-5 py-6 md:px-8">
            {/* Default child route should render the feed here */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}


