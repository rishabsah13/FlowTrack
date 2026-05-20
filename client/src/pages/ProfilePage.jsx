import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getCurrentUser, updateCurrentUser } from "../api/auth";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Spinner from "../components/common/Spinner";

const ProfilePage = () => {
  const { user: authUser, token, login } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({
    name: authUser?.name || "",
    email: authUser?.email || "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      setLoading(true);
      setError("");
      try {
        const data = await getCurrentUser(token);
        setForm({ name: data.user.name, email: data.user.email });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    setError("");
    setMessage("");
    try {
      const data = await updateCurrentUser(token, form);
      // update auth context with new user
      login(token, data.user);
      setMessage("Profile updated successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar */}
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

        <main className="flex-1 px-4 py-4 md:px-6 md:py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Header with avatar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-400 text-slate-950 flex items-center justify-center text-lg font-semibold">
                  {authUser?.name ? authUser.name[0].toUpperCase() : "U"}
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold">Profile</h1>
                  <p className="mt-1 text-xs md:text-sm text-slate-400">
                    Manage your personal information and workspace subscription.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-1 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/80 px-2 py-1 text-slate-200">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      authUser?.subscriptionStatus === "active"
                        ? "bg-emerald-400"
                        : "bg-slate-500"
                    }`}
                  />
                  {authUser?.subscriptionStatus === "active"
                    ? "Subscription active"
                    : "Free tier"}
                </span>
                <span className="text-slate-500">
                  Plan:{" "}
                  <span className="font-medium text-slate-100">
                    {authUser?.subscriptionPlan || "free"}
                  </span>
                </span>
              </div>
            </div>

            {/* Subscription block (kept, slightly wider) */}
            <div className="mt-2 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-4">
              <h2 className="text-sm font-semibold text-slate-200">
                Subscription
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Your current workspace plan and billing status.
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-slate-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {authUser?.subscriptionStatus === "active"
                    ? "Active"
                    : "Inactive"}
                </span>
                <span className="text-slate-400">
                  Plan:{" "}
                  <span className="font-medium text-slate-100">
                    {authUser?.subscriptionPlan || "free"}
                  </span>
                </span>
              </div>
            </div>

            {/* Profile form in card */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-5">
              <h2 className="text-sm font-semibold text-slate-200">
                Personal details
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                We use this information for communication.
              </p>

              {loading ? (
                <p className="mt-6 text-sm text-slate-400">
                  Loading profile...
                </p>
              ) : (
                <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                  {error && (
                    <p className="text-sm text-red-400 bg-red-950/40 border border-red-500/40 px-3 py-2 rounded">
                      {error}
                    </p>
                  )}
                  {message && (
                    <p className="text-sm text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 px-3 py-2 rounded">
                      {message}
                    </p>
                  )}

                  <div className="grid gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Name
                      </label>
                      <input
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Email
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 text-sm font-medium hover:bg-emerald-400 disabled:opacity-60 transition"
                    >
                      {saving ? (
                        <span className="inline-flex items-center gap-2">
                          <Spinner />
                          <span>Saving...</span>
                        </span>
                      ) : (
                        "Save changes"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
