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

mongoose.set("bufferCommands", false);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connection successful with db");

    app.listen(PORT, () => {
      console.log(`server is running on ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect with db", err);
    process.exit(1); // stop server if DB fails
  }
};

startServer();

