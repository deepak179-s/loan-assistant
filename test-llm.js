import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  const models = ["gemini-1.5-pro-latest", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro", "gemini-1.0-pro-001"];
  
  for (const m of models) {
    console.log("Testing:", m);
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("hello");
      console.log("SUCCESS WITH MODEL:", m);
      return;
    } catch (error) {
      console.log("FAILED:", m, "->", error.message.split('\n')[0]);
    }
  }
}
test();
