// for testing 1st way using sdk ( npm way )
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function testGemini() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Say hello in one sentence",
  });

  console.log(response.text);
}

testGemini();
