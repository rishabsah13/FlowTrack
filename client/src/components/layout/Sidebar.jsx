import { NavLink } from "react-router-dom";
import { FiHome, FiUsers, FiBarChart2, FiCreditCard, FiSettings } from "react-icons/fi";

const navItems = [
  { label: "Overview", icon: FiHome, to: "/dashboard" },
  { label: "Profile", icon: FiUsers, to: "/profile" },
  { label: "Pricing", icon: FiCreditCard, to: "/pricing" },
  { label: "Settings", icon: FiSettings, to: "/settings" }
];

const Sidebar = () => {
  return (
    <aside className="hidden md:flex md:flex-col w-60 bg-slate-950 border-r border-slate-800">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-semibold">
            S
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-slate-50">
              FlowTrack
            </span>
            <span className="text-[11px] text-slate-500">
              Founder workspace
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                [
                  "group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition",
                  "border border-transparent",
                  isActive
                    ? "bg-slate-900 text-slate-50 border-slate-700 shadow-sm"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/70 hover:border-slate-800"
                ].join(" ")
              }
            >
              <Icon className="h-4 w-4 text-slate-500 group-hover:text-slate-100" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-slate-800 text-[11px] text-slate-500">
        <p className="flex items-center justify-between">
          <span>Usage</span>
          <span className="text-slate-300 font-medium">72%</span>
        </p>
        <div className="mt-2 h-1.5 w-full rounded-full bg-slate-900 overflow-hidden">
          <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-cyan-400" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;