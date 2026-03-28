import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import path from 'path';
import { fileURLToPath } from 'url';

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
  otpStorage.set(mobile, { otp: generatedOtp, pan });
  
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
  const stored = otpStorage.get(mobile);

  if (!stored || stored.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  // Clear OTP
  otpStorage.delete(mobile);

  const pan = stored.pan;
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
    active_loans = []; // Wealth Builder, no loans
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

app.post('/api/chat', async (req, res) => {
  const { messages, agentType, userData } = req.body;
  
  if (!messages || !agentType) {
    return res.status(400).json({ error: 'Missing messages or agentType' });
  }

  try {
    let systemInstruction = "";
    if (agentType === 'Optimizer') {
      systemInstruction = "You are the Debt Optimizer Agent. Your expertise is in Indian Education Loans, personal loans, EMI calculations, CSIS Subsidy, Section 80E tax deductions, and RBI repo rates. Be concise, act like a highly analytical AI core, and prioritize minimizing loan interest. Use the provided [CONFIDENTIAL CONTEXT] to give specific, numeric advice if available. Always respond in plain text or simple markdown.";
    } else if (agentType === 'Tracker') {
      systemInstruction = "You are the Savings Tracker Agent. Your expertise is in Indian investments like Public Provident Fund (PPF), SIPs, mutual funds, and fixed deposits. Be encouraging, act like a highly analytical AI core, and prioritize long-term compound interest. Use the provided [CONFIDENTIAL CONTEXT] to give specific, numeric advice if available. Always respond in plain text or simple markdown.";
    } else if (agentType === 'WealthBuilder') {
      systemInstruction = "You are the Wealth Builder Agent. Your expertise is in macro-wealth strategies for Indians, including the National Pension System (NPS), ELSS tax-saving funds, and CIBIL score optimization. Be strategic, act like a highly analytical AI core, and balance debt repayment with wealth accumulation. Use the provided [CONFIDENTIAL CONTEXT] to give specific, numeric advice if available. Always respond in plain text or simple markdown.";
    }

    systemInstruction += "\n\n[CRITICAL CONSTRAINT]: Be EXTREMELY concise and direct. ONLY answer the exact question asked by the user. Do NOT volunteer extra information, unprompted calculations, long-winded explanations, or formulas unless the user explicitly requests them. Give them exactly what they asked for and nothing more. NEVER wrap your response in ```markdown or ``` code blocks.";

    if (userData) {
      systemInstruction += `\n\n[CONFIDENTIAL CONTEXT]: You have verified DPDP-compliant access to the user's live financial data. Use this data EXACTLY when answering their questions so you give highly personalized numeric advice. The user's live profile data is:\n${JSON.stringify(userData, null, 2)}`;
    }

    // Format history for Groq
    const formattedHistory = messages.slice(1).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));
    
    // Add system instruction at the beginning
    formattedHistory.unshift({ role: 'system', content: systemInstruction });

    const chatCompletion = await groq.chat.completions.create({
      messages: formattedHistory,
      model: "llama-3.1-8b-instant", 
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "";

    res.json({ text: responseText });
  } catch (error) {
    console.error("LLM Error:", error);
    res.status(500).json({ error: error.message || 'AI Processing Error' });
  }
});

// Export for Vercel serverless function
export default app;
