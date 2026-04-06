# Deep Insights & Loan Assistant Platform

An advanced, AI-powered Debt Optimization and Credit Management platform featuring a proprietary Multi-Agent debating system, real-time dynamic CIBIL data rendering, and a secure LoRA fine-tuning dataset generation pipeline.

## 🚀 Core Features

### 1. Multi-Agent AI Debating System
Instead of relying on a single, fallible LLM, this platform employs a dual-agent architecture powered by **llama-3.3-70b-versatile**:
*   **The Lead Strategist:** Ingests live Firebase CIBIL JSON data via Secure Context Injection. It creates structured debt repayment strategies based strictly on the user's outstanding principal, interest rates, and active loans.
*   **The Expert Critic:** A mathematical oversight agent that evaluates the Strategist's draft. It checks for hallucinated loans or math, enforces strict bounds, and generates a `confidenceScore` (0-100).
*   **Anti-Fraud Scam Detection:** If the Critic detects extreme irregularities (e.g., lottery scams, crypto windfalls, or accounts that don't exist in the DB), it forces the confidence score below 30.

### 2. Intelligent UI Routing & Safety
*   When the Critic returns `confidenceScore <= 30`, the React frontend intercepts the response.
*   It visually blocks the advice behind a glowing red 🚨 **High Risk / Scam Detected** warning.
*   Forces a strict **Human Handoff**, directing the user to connect with a physical financial advisor.

### 3. Continuous Learning (LoRA Pipeline)
*   Any multi-agent response that achieves a highly accurate verification score (`confidenceScore >= 80`) is automatically pipelined through `logToLoRADataset()`.
*   These verified interactions are appended in strict JSONL format to `lora-training-data.jsonl`, generating a proprietary corporate dataset used to fine-tune future models for specialized financial domains without relying heavily on massive parameter counts.

### 4. Dynamic Credit Profile Dashboard
The UI is not statically bound; it features true mathematical parity with the AI.
*   **Expandable Logic Cards:** Users click active loans to trigger a localized JS calculator that dynamically factors: Principal Paid, Estimated Interest Paid, and Remaining EMIs based on `percent_repaid`.
*   **Live Recharts Integration:** Automatically parses the user's current CIBIL score and renders a beautiful 6-month trajectory line graph.
*   **Intelligent Low CIBIL Advisory:** If a loaded profile hits `< 750` CIBIL, the app conditionally renders a dynamically scoped action plan based on their specific Utilization ratio.
*   **Regulatory Action:** Includes integrated "Report to RBI" buttons for instantaneous unauthorized loan disputes.

## 🛠 Tech Stack

*   **Frontend Data Rendering:** React.js, Vite, Recharts, Lucide Icons.
*   **Backend & Cloud Functions:** Node.js, Express, Vercel Serverless Functions (`api/index.js`).
*   **Database:** Firebase Firestore (DPDP secure user data routing).
*   **AI Engine:** Groq Cloud (`llama-3.3-70b-versatile`).

## ⚙️ Running Locally

1. Create a `.env` file containing your `GROQ_API_KEY`.
2. Start the Frontend: `npm run dev` (Runs on port 5173).
3. Start the Backend: `node server.js` (Runs on port 3001).
*(Running locally ensures the LoRA filesystem writing is successfully appending to your local JSONL).*
