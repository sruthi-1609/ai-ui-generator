import { Router } from "express";
import { fixWebsite } from "../services/geminiService.js";
import { handleServiceError } from "../utils/handleServiceError.js";

const router = Router();

router.post("/", async (req, res) => {
  const { html, css, javascript, issues } = req.body || {};

  if (
    typeof html !== "string" ||
    typeof css !== "string" ||
    typeof javascript !== "string"
  ) {
    return res.status(400).json({
      error: "html, css, and javascript must all be provided as strings.",
    });
  }

  if (!Array.isArray(issues)) {
    return res.status(400).json({ error: "issues must be provided as an array." });
  }

  try {
    const result = await fixWebsite({ html, css, javascript, issues });
    return res.status(200).json(result);
  } catch (err) {
    return handleServiceError(err, res);
  }
});

export default router;
