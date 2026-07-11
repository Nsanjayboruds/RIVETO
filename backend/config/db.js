import mongoose from "mongoose";

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000;
const MAX_DELAY_MS = 30000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectWithRetry = async (retries = 0) => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    if (retries >= MAX_RETRIES) {
      console.error(`❌ MongoDB connection failed after ${MAX_RETRIES} retries`);
      throw error;
    }

    const delay = Math.min(BASE_DELAY_MS * Math.pow(2, retries), MAX_DELAY_MS);
    const jitter = Math.random() * 1000;
    const totalDelay = delay + jitter;

    console.warn(
      `⚠️ MongoDB connection attempt ${retries + 1} failed: ${error.message}. ` +
        `Retrying in ${Math.round(totalDelay)}ms... (attempt ${retries + 2}/${MAX_RETRIES})`
    );

    await sleep(totalDelay);
    return connectWithRetry(retries + 1);
  }
};

const connectdb = async () => {
  mongoose.connection.on("connected", () => {
    console.log("📡 MongoDB connection established");
  });

  mongoose.connection.on("error", (err) => {
    console.error("🔴 MongoDB connection error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("🔌 MongoDB disconnected");
  });

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("🛑 MongoDB connection closed due to app termination");
    process.exit(0);
  });

  return connectWithRetry();
};

export default connectdb;