import { FiBell, FiSearch, FiMenu } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 flex items-center justify-between border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800/80 transition"
          onClick={onToggleSidebar}
        >
          <FiMenu className="h-4 w-4" />
        </button>
        <div className="relative">
          <FiSearch className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            className="pl-9 pr-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs md:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 min-w-[200px] md:min-w-[260px]"
            placeholder="Search across data..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative inline-flex items-center justify-center h-9 w-9 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800/80 transition">
          <FiBell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-medium text-slate-100">
                  {user?.name || "Product Owner"}
                </p>
                <p className="text-[11px] text-slate-500">
                  {user?.email || "you@company.com"} •{" "}
                  {user?.subscriptionStatus === "active"
                    ? `Plan: ${user.subscriptionPlan}`
                    : "Free tier"}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-400 text-slate-950 flex items-center justify-center text-xs font-semibold">
                {user?.name ? user.name[0].toUpperCase() : "S"}
              </div>
            </div>
          </div>
         
        </div>
      </div>
    </header>
  );
};

export default Navbar;
