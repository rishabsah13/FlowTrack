import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getProtected } from "../api/auth";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import StatsGrid from "../components/dashboard/StatsGrid";
import {
  revenueSeries,
  activityLog,
  recentClients,
} from "../data/dashboardMock";

const DashboardPage = () => {
  const { user, token, logout } = useAuth();
  const [message, setMessage] = useState("Loading protected data...");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  console.log("revenueSeries:", revenueSeries);
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProtected(token);
        setMessage(data.message);
      } catch (err) {
        setMessage("Failed to load protected data");
      }
    };
    load();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar (very simple overlay) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="w-64">
            <Sidebar />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />

        <main className="flex-1 px-4 py-4 md:px-8 md:py-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-400">
                Today
              </p>
              <h1 className="mt-1 text-xl md:text-2xl font-semibold text-slate-50">
                Welcome back 👋 <br /><br/>
                Here’s what’s happening with your business today
              </h1>
              <p className="mt-1 text-sm text-slate-400 max-w-xl">
                Monitor your MRR, customer activity, and churn in one place.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={logout}
                className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-slate-800 text-xs md:text-sm text-slate-300 hover:bg-slate-900/80 transition"
              >
                Log out
              </button>
              <button className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-emerald-500 text-slate-950 text-xs md:text-sm font-medium hover:bg-emerald-400 shadow-sm transition">
                New report
              </button>
            </div>
          </div>

          <StatsGrid />

          <section className="grid grid-cols-1 lg:grid-cols-[2fr_1.2fr] gap-4">
            {/* Revenue trend */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-200">
                    Revenue trend
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Last 6 months of MRR
                  </p>
                </div>
                <p className="text-xs text-slate-400">
                  Current MRR:{" "}
                  <span className="font-medium text-slate-100">
                    ₹
                    {revenueSeries[revenueSeries.length - 1].mrr.toLocaleString(
                      "en-IN",
                    )}
                  </span>
                </p>
              </div>

              <div className="flex items-end gap-2 h-32 bg-slate-950/40 rounded-lg px-2 py-2">
                {revenueSeries.map((month, index) => {
                  const max = Math.max(...revenueSeries.map((m) => m.mrr));
                  const normalized = month.mrr / max; // 0–1
                  const heightPx = 12 + normalized * 64; // between 12px and ~76px

                  return (
                    <div
                      key={month.label}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <div
                        className="w-3 md:w-4 rounded-full bg-emerald-500"
                        style={{ height: `${heightPx}px` }}
                      />
                      <span className="text-[10px] text-slate-500">
                        {month.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Activity log (same as you already have) */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-200">
                  Activity
                </h2>
                <span className="text-[11px] text-slate-500">
                  Last 24 hours
                </span>
              </div>
              <ul className="space-y-3">
                {activityLog.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <span className="mt-1 text-[11px] text-slate-500 w-16">
                      {item.time}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-100">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {item.description}
                      </p>
                    </div>
                    {item.amount && (
                      <span
                        className={`text-[11px] font-medium ${
                          item.amount.startsWith("+")
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }`}
                      >
                        {item.amount}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-200">
                  Recent clients
                </h2>
                <button className="text-[11px] text-emerald-400 hover:text-emerald-300">
                  View all
                </button>
              </div>
              <div className="divide-y divide-slate-800/80">
                {recentClients.map((client) => (
                  <div
                    key={client.id}
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center text-[11px] font-semibold text-slate-100">
                        {client.name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-100">
                          {client.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {client.domain}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-slate-100">
                        ₹{client.mrr.toLocaleString("en-IN")}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {client.plan} • {client.joinedAt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-4">
              <h2 className="text-sm font-semibold text-slate-200">
                Subscription
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Status:{" "}
                <span className="font-medium text-slate-100">
                  {user?.subscriptionStatus || "inactive"}
                </span>
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Plan: {user?.subscriptionPlan || "free"}
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
