import dotenv from 'dotenv';
dotenv.config();
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function run() {
  try {
    const messages = [
      { role: 'system', content: 'You are a test agent.' },
      { role: 'user', content: 'hello!' }
    ];
    
    console.log("Testing Llama 3.1 with Key:", process.env.GROQ_API_KEY.substring(0, 10));
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.1-8b-instant", 
    });
    console.log("SUCCESS:", chatCompletion.choices[0]?.message?.content);
  } catch (e) {
    console.error("GROQ ERROR:", e);
  }
}
run();
