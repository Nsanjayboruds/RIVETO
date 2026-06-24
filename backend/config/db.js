import mongoose from "mongoose";
const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB connected");
    } catch (_error) {
        console.log("DB connection error");
    }
}

export default connectdb;
