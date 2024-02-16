import mongoose from "mongoose";

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL as string);
        console.log("Connected to database successfully.");
        return mongoose.connection;
    } catch (error) {
        throw error;
    }
};

export default connectToDatabase;