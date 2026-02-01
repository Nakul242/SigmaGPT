import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv/config';
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
    connectDB();
});

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connection successful with db");
    }
    catch(err) {
        console.log("Failed to connect with db", err);
    }
}

