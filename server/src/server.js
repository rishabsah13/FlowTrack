import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); 
import { connectDB } from "./config/db.js";
import billingRoutes from "./routes/billingRoutes.js";
import authRoutes from "./routes/authRoutes.js";


connectDB();

const app = express();


const allowedOrigins = [
  "http://localhost:5173",
  "https://flow-track-brown.vercel.app", // old (optional)
  "https://flow-track-5symtv66b-rishabsah13s-projects.vercel.app", // new Vercel URL
];

// Plain JS: no type annotation here
const corsOptions = {
  origin: (origin, callback) => {
    // allow non-browser tools (no origin) and listed origins
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json());

// Simple health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// Auth routes
app.use("/api/auth", authRoutes);

//billing
app.use("/api/billing", billingRoutes);


// Example protected route
import { authRequired } from "./middleware/authMiddleware.js";
app.get("/api/protected", authRequired, (req, res) => {
  res.json({ message: "You accessed a protected route", user: req.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);