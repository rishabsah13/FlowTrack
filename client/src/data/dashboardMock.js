export const kpiData = {
  mrr: 24980, // in INR
  mrrChangePct: 8.2,
  activeCustomers: 1248,
  activeCustomersChangePct: 3.1,
  churnRate: 2.4,
  churnChangePct: -0.3,
  avgResponseSeconds: 102, // 1m 42s
  avgResponseChangePct: 12
};

export const revenueSeries = [
  { label: "Jan", mrr: 18200 },
  { label: "Feb", mrr: 19500 },
  { label: "Mar", mrr: 21050 },
  { label: "Apr", mrr: 22800 },
  { label: "May", mrr: 23900 },
  { label: "Jun", mrr: 24980 }
];


export const activityLog = [
  {
    id: 1,
    time: "10:21 AM",
    title: "New annual subscription",
    description: "Acme Analytics upgraded to Growth plan",
    amount: "+₹19,990",
    type: "payment"
  },
  {
    id: 2,
    time: "09:54 AM",
    title: "New team member invited",
    description: "sara@microstack.io joined the workspace",
    amount: null,
    type: "user"
  },
  {
    id: 3,
    time: "09:12 AM",
    title: "Churned customer",
    description: "Loopdesk cancelled their subscription",
    amount: "-₹2,499",
    type: "churn"
  },
  {
    id: 4,
    time: "Yesterday",
    title: "MRR milestone",
    description: "Crossed ₹25k in monthly recurring revenue",
    amount: null,
    type: "milestone"
  }
];


export const recentClients = [
  {
    id: 1,
    name: "Acme Analytics",
    domain: "acmeanalytics.io",
    mrr: 12990,
    plan: "Growth",
    joinedAt: "2 days ago"
  },
  {
    id: 2,
    name: "Loopdesk",
    domain: "loopdesk.app",
    mrr: 2499,
    plan: "Starter",
    joinedAt: "5 days ago"
  },
  {
    id: 3,
    name: "Microstack",
    domain: "microstack.io",
    mrr: 7990,
    plan: "Growth",
    joinedAt: "1 week ago"
  }
];