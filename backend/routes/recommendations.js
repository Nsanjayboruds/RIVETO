import express from "express";
import { getRecommendations } from "../services/recommendationService.js";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import { decrypt } from "../utils/crypto.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { stack = "", level = "all", search = "", history = "" } = req.query;
    const userStack = stack
      ? stack
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];
    const historyTerms = history
      ? history
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    let githubToken = null;
    const { token } = req.cookies;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("+githubAccessToken");
        if (user && user.githubAccessToken) {
          githubToken = decrypt(user.githubAccessToken);
        }
      } catch (_err) {
        // Ignore invalid tokens for recommendations
      }
    }

    const results = await getRecommendations({
      stack: userStack,
      level,
      search,
      history: historyTerms,
      githubToken,
    });

    res.json({
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Failed to fetch recommendations:", error.message);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

export default router;
