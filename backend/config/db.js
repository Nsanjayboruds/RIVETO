import mongoose from "mongoose";
import logger from "./logger.js";

const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        logger.info("DB connected");
    } catch (_error) {
        logger.error("DB connection error", { error: _error.message });
    }
}

export default connectdb;