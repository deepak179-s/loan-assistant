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
  
  console.log(`[BUREAU SANDBOX] Sent OTP ${generatedOtp} to +91 ${mobile} for PAN ${pan}`);

  // Return success exactly like Decentro's Sandbox JSON
  res.json({
    status: 'success',
    message: 'OTP sent successfully to registered mobile number.',
    reference_id: `ref_${Date.now()}`
  });
});

app.post('/api/kyc/verify-otp', authenticateApiKey, (req, res) => {
  const { mobile, otp, name } = req.body;

  if (otp !== '123456') {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  const lowerName = (name || '').toLowerCase();
  let pan = 'DEEPAK';
  if (lowerName.includes('sumit')) pan = 'SUMIT1234Y';
  else if (lowerName.includes('kashish')) pan = 'KASHI1234J';
  else if (lowerName.includes('tarun')) pan = 'TARUN1234S';
  let cibil_score = 784;
  let risk_band = 'Low Risk';
  let active_loans = [];
  let credit_cards = [];

  if (pan === 'SUMIT1234Y') {
    cibil_score = 650;
    risk_band = 'High Risk';
    active_loans = [
      { lender: 'Bajaj Finserv', original_principal: 500000, outstanding_balance: 450000, emi: 18000, interest_rate: 14.5, tenure_months: 36, percent_repaid: 10 }
    ];
    credit_cards = [
      { issuer: 'SBI SimplyClick', limit: 100000, utilized: 90000, next_bill: '10th Oct' }
    ];
  } else if (pan === 'KASHI1234J') {
    cibil_score = 810;
    risk_band = 'Excellent';
    active_loans = [
      { lender: 'HDFC Education Loan', original_principal: 1500000, outstanding_balance: 1200000, emi: 18000, interest_rate: 9.5, tenure_months: 120, percent_repaid: 20 },
      { lender: 'ICICI Personal Loan', original_principal: 500000, outstanding_balance: 400000, emi: 15000, interest_rate: 12.0, tenure_months: 48, percent_repaid: 20 }
    ]; // Added per request
    credit_cards = [
      { issuer: 'HDFC Regalia', limit: 500000, utilized: 50000, next_bill: '5th Nov' }
    ];
  } else if (pan === 'TARUN1234S') {
    cibil_score = 720;
    risk_band = 'Medium Risk';
    active_loans = [
      { lender: 'SBI Home Loan', original_principal: 5000000, outstanding_balance: 4800000, emi: 45000, interest_rate: 8.7, tenure_months: 240, percent_repaid: 4 },
      { lender: 'HDFC Car Loan', original_principal: 800000, outstanding_balance: 600000, emi: 15000, interest_rate: 9.5, tenure_months: 60, percent_repaid: 25 }
    ];
    credit_cards = [];
  } else {
    // Default (Deepak)
    active_loans = [
      { lender: 'SBI Education Loan', original_principal: 3823500, outstanding_balance: 3250000, emi: 38400, interest_rate: 8.5, tenure_months: 180, percent_repaid: 15 },
      { lender: 'HDFC Personal Loan', original_principal: 763600, outstanding_balance: 420000, emi: 14500, interest_rate: 11.2, tenure_months: 60, percent_repaid: 45 }
    ];
    credit_cards = [
      { issuer: 'ICICI Coral Credit Card', limit: 200000, utilized: 45200, next_bill: '12th Oct' },
      { issuer: 'Axis Bank Flipkart Card', limit: 150000, utilized: 12400, next_bill: '18th Oct' }
    ];
  }

  // Return realistic mocked Credit Bureau JSON data
  res.json({
    status: 'success',
    message: 'Bureau Data Fetched Successfully',
    data: {
      cibil_score,
      risk_band,
      active_loans,
      credit_cards
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
    // Note: Vercel serverless has a read-only filesystem, so this will catch the error in production
    // but work beautifully when run locally via `node api/index.js` or `server.js`.
    fs.appendFileSync(path.join(__dirname, '..', 'lora-training-data.jsonl'), JSON.stringify(logEntry) + '\n');
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
    const strategistSystemPrompt = `You are the Lead Financial Strategist. Your goal is to analyze the user's query and their exact numerical financial profile to propose a debt repayment strategy. Do not hallucinate math. Use exact numbers from the profile to calculate savings accurately.
${profileContext}`;

    const history1 = [
        { role: 'system', content: strategistSystemPrompt },
        { role: 'user', content: userMessage }
    ];

    const strategistResponse = await groq.chat.completions.create({
      messages: history1,
      model: "llama-3.3-70b-versatile",
    });

    const strategistDraft = strategistResponse.choices[0]?.message?.content || "";

    // ----------------------------------------------------
    // AGENT 2: THE MATHEMATICIAN / CRITIC (Anti-Hallucination)
    // ----------------------------------------------------
    const criticSystemPrompt = `You are the Expert Financial Critic. Review the Lead Strategist's proposed plan against the user's REAL financial data. 
1. Check for math hallucinations. If the strategist claims saving millions/crores on a small loan, it's a hallucination. Set confidenceScore to 20.
2. Verify that the advice makes sense.
3. [CRITICAL SCAM DETECTOR]: If the user's prompt mentions a "lottery", "looter message", winning massive money from nowhere, guaranteed crypto returns, "spaceship", or ANY obvious internet scam/unverifiable windfall, or asks about accounts that DO NOT EXIST in their profile, you MUST set confidenceScore to 20 or lower! This forces human verification.
4. Provide a 'confidenceScore' between 0-100. 100 means mathematically flawless regarding user's real loans. 
Your ONLY output must be a raw JSON object with this exact structure:
{
  "confidenceScore": 20,
  "reasoning": "Explain why this is verified or flagged as an anomaly/scam.",
  "finalAdvice": "The actual advice meant for the user. (e.g. telling them it's a scam/anomaly)"
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
      model: "llama-3.3-70b-versatile",
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

// Export for Vercel serverless function
export default app;
