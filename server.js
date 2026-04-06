import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mock in-memory database linking Phone Numbers to OTPs
const otpStorage = new Map();

// Authentication Middleware to simulate checking "Sandbox API Keys"
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== 'mock_decentro_sandbox_key_123') {
    return res.status(401).json({ error: 'Unauthorized: Invalid Sandbox API Key' });
  }
  next();
};

app.post('/api/kyc/request-otp', authenticateApiKey, (req, res) => {
  const { name, pan, dob, mobile } = req.body;
  
  // Basic validation representing real Sandbox behavior
  if (!name || !pan || !dob || !mobile) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  if (pan.length !== 10) {
    return res.status(400).json({ error: 'Invalid PAN Format' });
  }

  // Generate a mock 6-digit OTP
  const generatedOtp = '123456'; // Static for sandbox testing, but in prod would be Math.random()
  otpStorage.set(mobile, generatedOtp);
  
  console.log(`[BUREAU SANDBOX] Sent OTP ${generatedOtp} to +91 ${mobile} for PAN ${pan}`);

  // Return success exactly like Decentro's Sandbox JSON
  res.json({
    status: 'success',
    message: 'OTP sent successfully to registered mobile number.',
    reference_id: `ref_${Date.now()}`
  });
});

app.post('/api/kyc/verify-otp', authenticateApiKey, (req, res) => {
  const { mobile, otp } = req.body;

  if (otpStorage.get(mobile) !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  // Clear OTP
  otpStorage.delete(mobile);

  // Return realistic mocked Credit Bureau JSON data
  res.json({
    status: 'success',
    message: 'Bureau Data Fetched Successfully',
    data: {
      cibil_score: 784,
      risk_band: 'Low Risk',
      active_loans: [
        {
          lender: 'SBI Education Loan',
          original_principal: 3823500,
          outstanding_balance: 3250000,
          emi: 38400,
          interest_rate: 8.5,
          tenure_months: 180,
          percent_repaid: 15
        },
        {
          lender: 'HDFC Personal Loan',
          original_principal: 763600,
          outstanding_balance: 420000,
          emi: 14500,
          interest_rate: 11.2,
          tenure_months: 60,
          percent_repaid: 45
        }
      ],
      credit_cards: [
        {
          issuer: 'ICICI Coral Credit Card',
          limit: 200000,
          utilized: 45200,
          next_bill: '12th Oct'
        },
        {
          issuer: 'Axis Bank Flipkart Card',
          limit: 150000,
          utilized: 12400,
          next_bill: '18th Oct'
        }
      ]
    }
  });
});

// Helper to log LoRA fine-tuning format
const logToLoRADataset = (systemPrompt, userQuery, aiResponse) => {
  const logEntry = {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userQuery },
      { role: "assistant", content: aiResponse }
    ]
  };
  try {
    fs.appendFileSync(path.join(__dirname, 'lora-training-data.jsonl'), JSON.stringify(logEntry) + '\n');
  } catch (err) {
    console.error("Failed to write to LoRA dataset", err);
  }
};

app.post('/api/chat', async (req, res) => {
  const { messages, agentType, userData } = req.body;
  
  if (!messages) {
    return res.status(400).json({ error: 'Missing messages' });
  }

  try {
    const userMessage = messages[messages.length - 1].text;
    const profileContext = userData ? `[CONFIDENTIAL CONTEXT] User Profile: ${JSON.stringify(userData, null, 2)}` : "No specific profile data available.";

    // ----------------------------------------------------
    // AGENT 1: THE STRATEGIST
    // ----------------------------------------------------
    const strategistSystemPrompt = `You are the Lead Financial Strategist. Your goal is to analyze the user's query and their exact numerical financial profile to propose a debt repayment strategy. Do not hallucinate math. Use exact numbers from the profile. 
${profileContext}`;

    const history1 = [
        { role: 'system', content: strategistSystemPrompt },
        { role: 'user', content: userMessage }
    ];

    const strategistResponse = await groq.chat.completions.create({
      messages: history1,
      model: "llama-3.1-8b-instant",
    });

    const strategistDraft = strategistResponse.choices[0]?.message?.content || "";

    // ----------------------------------------------------
    // AGENT 2: THE MATHEMATICIAN / CRITIC (Anti-Hallucination)
    // ----------------------------------------------------
    const criticSystemPrompt = `You are the Expert Financial Critic. Review the Lead Strategist's proposed plan against the user's REAL financial data. 
1. Check for any math hallucinations (e.g. referencing loans that don't exist, incorrect math).
2. Verify that the advice makes sense. If it's a general question, just formalize the response.
3. Provide a 'confidenceScore' between 0-100 indicating how certain you are. If the question is outside strict financial domains or anomalous, lower the score below 75. 100 means mathematically flawless.
Your ONLY output must be a raw JSON object with this exact structure:
{
  "confidenceScore": 95,
  "reasoning": "Brief explanation of verification.",
  "finalAdvice": "The actual detailed advice meant for the user. Fix the formatting."
}
NO OTHER TEXT ALLOWED. JUST JSON.
${profileContext}`;

    const criticHistory = [
      { role: 'system', content: criticSystemPrompt },
      { role: 'assistant', content: `Strategist's Draft: ${strategistDraft}` },
      { role: 'user', content: `Review the draft and finalize the JSON output for the original query: "${userMessage}"` }
    ];

    const criticResponse = await groq.chat.completions.create({
      messages: criticHistory,
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });

    let criticJsonText = criticResponse.choices[0]?.message?.content || "{}";
    let finalResult = {};

    try {
      finalResult = JSON.parse(criticJsonText);
    } catch(e) {
      console.error("Failed to parse Critic JSON", e);
      finalResult = {
        confidenceScore: 50,
        reasoning: "Failed to parse rigorous verification logic.",
        finalAdvice: strategistDraft
      };
    }

    // Save strictly formatted structural output for LoRA Fine-Tuning dataset IF confidence is high
    if (finalResult.confidenceScore && finalResult.confidenceScore >= 80) {
       logToLoRADataset(
         "You are an expert debt optimizer. Use strict numerical accuracy.", 
         `Current Data: ${profileContext}. Query: ${userMessage}`,
         finalResult.finalAdvice
       );
    }

    res.json(finalResult);
  } catch (error) {
    console.error("LLM Error:", error);
    res.status(500).json({ error: error.message || 'AI Processing Error' });
  }
});

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback route to serve index.html for SPA routing
// Using app.use() at the end avoids path-to-regexp compatibility issues in Express 5
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[Sandbox API Server] Running on http://localhost:${PORT}`);
  console.log(`Simulating fully compliant Credit Bureau fetches via Express`);
});
