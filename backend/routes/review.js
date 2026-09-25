import { Router } from "express";
import { reviewWebsite } from "../services/geminiService.js";
import { handleServiceError } from "../utils/handleServiceError.js";

const router = Router();

router.post("/", async (req, res) => {
  const { html, css, javascript } = req.body || {};

  if (
    typeof html !== "string" ||
    typeof css !== "string" ||
    typeof javascript !== "string"
  ) {
    return res.status(400).json({
      error: "html, css, and javascript must all be provided as strings.",
    });
  }

  if (html.trim() === "" && css.trim() === "" && javascript.trim() === "") {
    return res.status(400).json({ error: "There is no code to review yet." });
  }

  try {
    const result = await reviewWebsite({ html, css, javascript });
    return res.status(200).json(result);
  } catch (err) {
    return handleServiceError(err, res);
  }
});

export default router;
