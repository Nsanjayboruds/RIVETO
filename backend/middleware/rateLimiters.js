import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { createClient } from "redis";
import logger from "../config/logger.js";

const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;

let redisClient = null;

if (process.env.REDIS_URL) {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: { connectTimeout: 5000, reconnectStrategy: false, },
    });

    redisClient.on("error", (err) => {
      logger.error("Redis rate limiter connection error", { error: err.message });
    });

    await redisClient.connect();
    logger.info("Rate limiting using shared Redis store");
  } catch (err) {
    logger.error("Failed to connect to Redis, falling back to in-memory rate limiting", {
      error: err.message,
    });
    redisClient = null;
  }
} else {
  logger.info("REDIS_URL not set, using in-memory rate limiting (not shared across instances)");
}

const createRedisStore = (prefix) => {
  if (!redisClient) return undefined;
  return new RedisStore({
    prefix: `rl:${prefix}:`,
    sendCommand: (...args) => redisClient.sendCommand(args),
  });
};

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
    store: createRedisStore(name),
  });

const createKeyLimiter = (max, name, keyGenerator) =>
  rateLimit({
    ...sharedOptions,
    max: Number(process.env[name]) || max,
    keyGenerator,
    store: createRedisStore(name),
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