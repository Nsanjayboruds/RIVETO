import rateLimit from "express-rate-limit";

const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;

const sharedOptions = {
  windowMs: WINDOW_MS,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "test",
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    });
  },
};

const createIpLimiter = (max, name) =>
  rateLimit({
    ...sharedOptions,
    max: Number(process.env[name]) || max,
  });

const createKeyLimiter = (max, name, keyGenerator) =>
  rateLimit({
    ...sharedOptions,
    max: Number(process.env[name]) || max,
    keyGenerator,
  });

export const globalIpLimiter = createIpLimiter(100, "RATE_LIMIT_GLOBAL_MAX");

export const authIpLimiter = createIpLimiter(10, "RATE_LIMIT_AUTH_MAX");

export const otpIpLimiter = createIpLimiter(5, "RATE_LIMIT_OTP_MAX");

export const botIpLimiter = createIpLimiter(30, "RATE_LIMIT_BOT_MAX");

export const userRateLimiter = createKeyLimiter(
  200,
  "RATE_LIMIT_USER_MAX",
  (req) => req.userId,
);

export const adminRateLimiter = createKeyLimiter(
  100,
  "RATE_LIMIT_ADMIN_MAX",
  (req) => req.adminEmail,
);
