import { FiTrendingUp, FiUsers, FiDollarSign, FiClock } from "react-icons/fi";
import { kpiData } from "../../data/dashboardMock";

const formatCurrency = (value) => `₹${value.toLocaleString("en-IN")}`;

const formatDuration = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
};

const StatsGrid = () => {
  const stats = [
    {
      label: "Monthly recurring revenue",
      value: formatCurrency(kpiData.mrr),
      change: `${kpiData.mrrChangePct > 0 ? "+" : ""}${kpiData.mrrChangePct.toFixed(1)}%`,
      positive: kpiData.mrrChangePct >= 0,
      icon: FiDollarSign,
    },
    {
      label: "Active customers",
      value: kpiData.activeCustomers.toLocaleString("en-IN"),
      change: `${kpiData.activeCustomersChangePct > 0 ? "+" : ""}${kpiData.activeCustomersChangePct.toFixed(1)}%`,
      positive: kpiData.activeCustomersChangePct >= 0,
      icon: FiUsers,
    },
    {
      label: "Churn rate",
      value: `${kpiData.churnRate.toFixed(1)}%`,
      change: `${kpiData.churnChangePct > 0 ? "+" : ""}${kpiData.churnChangePct.toFixed(1)} pts`,
      positive: kpiData.churnChangePct <= 0, // lower churn is good
      icon: FiTrendingUp,
    },
    {
      label: "Avg. response time",
      value: formatDuration(kpiData.avgResponseSeconds),
      change: `${kpiData.avgResponseChangePct > 0 ? "+" : ""}${kpiData.avgResponseChangePct.toFixed(0)}%`,
      positive: kpiData.avgResponseChangePct <= 0, // lower response is good
      icon: FiClock,
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950/80 px-4 py-4 flex flex-col gap-4 shadow-sm transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-700"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-2 text-xl font-semibold text-slate-50 tabular-nums">
                  {stat.value}
                </p>
              </div>
              <div className="h-9 w-9 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-center text-emerald-400">
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${
                  stat.positive
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-rose-500/10 text-rose-400"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    stat.positive ? "bg-emerald-400" : "bg-rose-400"
                  }`}
                />
                {stat.change}
              </span>
              <span className="text-slate-500">vs last 30 days</span>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default StatsGrid;
