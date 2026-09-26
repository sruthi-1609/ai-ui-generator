import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import generateRoute from "./routes/generate.js";
import editRoute from "./routes/edit.js";
import reviewRoute from "./routes/review.js";
import fixRoute from "./routes/fix.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://sruthi-ai-afg24s0hj-sruthi20.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "2mb" }));

// Request logging
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} ${req.method} ${req.path}`
  );
  next();
});

// Basic health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "ai-ui-generator-backend",
  });
});

// API health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// API routes
app.use("/api/generate", generateRoute);
app.use("/api/edit", editRoute);
app.use("/api/review", reviewRoute);
app.use("/api/fix", fixRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not found.",
  });
});

// Error handler
app.use((err, req, res, next) => {
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Invalid JSON in request body.",
    });
  }

  console.error("Unhandled server error:", err);

  return res.status(500).json({
    error: "Internal server error.",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(
    `AI UI Generator backend running on http://localhost:${PORT}`
  );

  if (!process.env.GEMINI_API_KEY) {
    console.warn(
      "WARNING: GEMINI_API_KEY is not set."
    );
  }
});