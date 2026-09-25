import { Router } from "express";
import { editWebsite } from "../services/geminiService.js";
import { handleServiceError } from "../utils/handleServiceError.js";

const router = Router();

router.post("/", async (req, res) => {
  const { instruction, html, css, javascript } = req.body || {};

  if (!instruction || typeof instruction !== "string" || instruction.trim() === "") {
    return res.status(400).json({ error: "Instruction is required and cannot be empty." });
  }

  if (
    typeof html !== "string" ||
    typeof css !== "string" ||
    typeof javascript !== "string"
  ) {
    return res.status(400).json({
      error: "Current html, css, and javascript code must all be provided as strings.",
    });
  }

  try {
    const result = await editWebsite({
      instruction: instruction.trim(),
      html,
      css,
      javascript,
    });
    return res.status(200).json(result);
  } catch (err) {
    return handleServiceError(err, res);
  }
});

export default router;
