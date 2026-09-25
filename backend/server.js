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
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST"],
  })
);

app.use(express.json({ limit: "2mb" }));

// Basic request logging (useful during a hackathon demo)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "ai-ui-generator-backend" });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

app.use("/api/generate", generateRoute);
app.use("/api/edit", editRoute);
app.use("/api/review", reviewRoute);
app.use("/api/fix", fixRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found." });
});

// Catch invalid JSON bodies etc.
app.use((err, req, res, next) => {
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON in request body." });
  }
  console.error("Unhandled server error:", err);
  return res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`AI UI Generator backend running on http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn(
      "WARNING: GEMINI_API_KEY is not set. Add it to backend/.env before using the API."
    );
  }
});
