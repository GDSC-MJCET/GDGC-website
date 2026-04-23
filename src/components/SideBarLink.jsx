export default function SidebarLink({ to, icon: Icon, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition",
          "border border-transparent hover:border-white/10 hover:bg-white/5",
          isActive ? "bg-white/10 text-white" : "text-zinc-400",
        ].join(" ")
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="font-medium tracking-wide">{children}</span>
    </NavLink>
  );
}