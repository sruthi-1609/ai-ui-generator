import { Router } from "express";
import { generateWebsite } from "../services/geminiService.js";
import { handleServiceError } from "../utils/handleServiceError.js";

const router = Router();

router.post("/", async (req, res) => {
  const { prompt } = req.body || {};

  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt is required and cannot be empty." });
  }

  if (prompt.length > 4000) {
    return res.status(400).json({ error: "Prompt is too long (max 4000 characters)." });
  }

  try {
    const result = await generateWebsite(prompt.trim());
    return res.status(200).json(result);
  } catch (err) {
    return handleServiceError(err, res);
  }
});

export default router;
