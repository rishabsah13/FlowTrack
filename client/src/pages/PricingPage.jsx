import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRazorpayScript } from "../hooks/useRazorpayScript";
import { createOrder, verifyPayment } from "../api/auth";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Spinner from "../components/common/Spinner";

const PLANS = [
  {
    key: "basic",
    name: "Starter",
    price: 499,
    description: "For solo builders validating their SaaS idea",
    features: ["Up to 1,000 customers", "Basic analytics", "Email support"],
  },
  {
    key: "growth",
    name: "Growth",
    price: 999,
    description: "For growing teams scaling MRR",
    features: [
      "Up to 10,000 customers",
      "Advanced analytics",
      "Priority support",
    ],
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: 1999,
    description: "For high-volume SaaS businesses",
    features: ["Unlimited customers", "Custom reports", "Dedicated CSM"],
  },
];

const PricingPage = () => {
  const { user, token, login } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const razorpayLoaded = useRazorpayScript();
  const [toast, setToast] = useState(null);

  const handleBuy = async (planKey) => {
    if (!token) {
      setError("You must be logged in to purchase a plan.");
      return;
    }

    if (!razorpayLoaded || !window.Razorpay) {
      setError(
        "Payment system is not ready. Please wait a moment and try again.",
      );
      return;
    }

    setError("");
    setMessage("");
    setLoadingPlan(planKey);

    try {
      // 1. Create order on backend
      const order = await createOrder(token, planKey);

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "FlowTrack",
        description: `Purchase ${order.plan} plan`,
        order_id: order.orderId,
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#22c55e",
        },
        handler: async function (response) {
          try {
            const verifyRes = await verifyPayment(token, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: order.plan,
            });

            // Update user in auth context so UI reflects new subscription
            login(token, verifyRes.user);
            setMessage("Payment successful! Subscription activated.");
            setToast({
              type: "success",
              message: "Payment successful – your subscription is now active.",
            });
          } catch (err) {
            console.error("Verify error:", err);
            setError(err.message || "Failed to verify payment.");
          } finally {
            setLoadingPlan("");
          }
        },
        modal: {
          ondismiss: function () {
            setLoadingPlan("");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Create order error:", err);
      setError(err.message || "Unable to start payment.");
      setLoadingPlan("");
    }
  };

  const currentPlan = user?.subscriptionPlan || "free";
  const isSubscribed = user?.subscriptionStatus === "active";

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="flex items-center gap-3 rounded-lg border border-emerald-500/40 bg-emerald-950/80 px-4 py-3 shadow-lg">
            <div className="h-7 w-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              ✓
            </div>
            <div>
              <p className="text-sm text-emerald-100">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-xs text-emerald-300 hover:text-emerald-100"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <Sidebar />
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-semibold">
                Choose the plan that grows with you
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Upgrade your account to unlock higher limits and advanced
                analytics.
              </p>
              {user?.subscriptionStatus === "active" && (
                <p className="mt-2 text-xs text-emerald-400">
                  Current plan: {user.subscriptionPlan}
                </p>
              )}
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-400 bg-red-950/40 border border-red-500/40 px-3 py-2 rounded">
                {error}
              </p>
            )}
            {message && (
              <p className="mt-4 text-sm text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 px-3 py-2 rounded">
                {message}
              </p>
            )}

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {PLANS.map((plan) => {
                const isFeatured = plan.key === "growth";
                const isCurrent =
                  isSubscribed &&
                  currentPlan === (plan.key === "basic" ? "pro" : plan.key);

                return (
                  <div
                    key={plan.key}
                    className={[
                      "border rounded-2xl p-5 flex flex-col shadow-sm transition-transform transition-shadow",
                      "hover:-translate-y-0.5 hover:shadow-lg",
                      isFeatured
                        ? "border-emerald-500/80 bg-slate-900/90"
                        : "border-slate-800 bg-slate-900/70 hover:border-slate-700",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h2 className="text-sm font-semibold text-slate-50">
                          {plan.name}
                        </h2>
                        <p className="mt-1 text-xs text-slate-400">
                          {plan.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {isFeatured && (
                          <span className="inline-flex self-end text-[10px] uppercase tracking-[0.16em] text-emerald-400 bg-emerald-500/10 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                            Most popular
                          </span>
                        )}
                        {isCurrent && (
                          <span className="inline-flex self-end text-[10px] uppercase tracking-[0.16em] text-slate-400 bg-slate-900/80 border border-slate-700 px-2 py-0.5 rounded-full">
                            Current plan
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-4 text-2xl font-semibold text-slate-50">
                      ₹{plan.price}
                      <span className="text-xs font-normal text-slate-500">
                        /month
                      </span>
                    </p>
                    <ul className="mt-4 space-y-2 text-xs text-slate-300">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2">
                          <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleBuy(plan.key)}
                      disabled={
                        !razorpayLoaded || loadingPlan === plan.key || isCurrent
                      }
                      className={
                        isCurrent
                          ? "mt-6 inline-flex items-center justify-center rounded-lg text-sm font-medium py-2 bg-slate-900/70 text-slate-500 border border-slate-800 cursor-default w-full"
                          : "mt-6 inline-flex items-center justify-center rounded-lg text-sm font-medium py-2 bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:opacity-60 transition w-full"
                      }
                    >
                      {isCurrent ? (
                        "Current plan"
                      ) : loadingPlan === plan.key ? (
                        <span className="inline-flex items-center gap-2">
                          <Spinner />
                          <span>Processing...</span>
                        </span>
                      ) : (
                        "Buy plan"
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PricingPage;
