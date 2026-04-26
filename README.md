# AI-Powered Financial Debt Optimizer & Loan Assistant Platform 🚀

An advanced, AI-powered Debt Optimization and Credit Management platform. Unlike traditional AI wrappers that simply forward user questions to an LLM, this platform utilizes a highly defensible **Multi-Agent Debating Architecture** and deterministic client-side mathematics to solve critical flaws in generative AI FinTech: Mathematical Hallucinations and Algorithmic Fraud/Scams.

---

## 🌟 Core Differentiators

### 1. The Multi-Agent Debating System
Instead of relying on a single, fallible LLM, this platform employs a dual-agent architecture powered by **Groq** and the **llama-3.3-70b-versatile** model:
* **Agent 1 (The Lead Strategist):** Ingests live CIBIL JSON data via Secure Context Injection. It creates structured debt repayment strategies based strictly on the user's outstanding principal, interest rates, and active loans.
* **Agent 2 (The Expert Critic):** A mathematical oversight agent that evaluates the Strategist's draft. It checks for hallucinated loans or math, enforces strict bounds, and generates a `confidenceScore` (0-100).
* **Anti-Fraud Scam Detection:** If the Critic detects extreme irregularities (e.g., lottery scams, crypto windfalls, or accounts that don't exist in the DB), it forces the confidence score below 30.

### 2. Intelligent UI Interception & Human Handoff
* When the Critic returns `confidenceScore <= 30`, the React frontend intercepts the response.
* It visually blocks the advice behind a glowing red 🚨 **High Risk / Scam Detected** warning.
* It creates a hard systemic off-ramp, forcing a strict **Human Handoff** and directing the user to connect with a physical, SEBI-registered financial advisor.

### 3. Digital Personal Data Protection (DPDP) Compliance
* **Secure Context Injection:** The Node.js backend simulates a secure fetch from a Credit Bureau. The user's exact JSON profile is injected directly into a hidden system prompt on the backend.
* The frontend never passes raw financial data to the LLM directly through user input fields, guaranteeing strict DPDP compliance and zero PII leakage.

### 4. Deterministic Frontend Mathematics
To completely eradicate math hallucinations, the workload is split. The AI provides the *strategy*, but the React frontend calculates the *exact numbers* using deterministic JavaScript functions.
* **Expandable Logic Cards:** Users click active loans to trigger localized calculators that dynamically calculate: Remaining EMIs, Principal Paid, and Estimated Interest Paid based on amortization formulas.

### 5. Automated Corporate IP Generation (LoRA Pipeline)
* Any multi-agent response that achieves a mathematically flawless verification score (`confidenceScore >= 80`) is automatically pipelined through `logToLoRADataset()`.
* These verified interactions are appended in strict JSONL format to a local `lora-training-data.jsonl` file.
* This generates a highly valuable proprietary corporate dataset used to fine-tune future, cheaper open-source models (like Llama 8B) for specialized financial domains, reducing reliance on expensive frontier APIs.

---

## 🎨 Modern UI/UX & Design System

* **Adaptive Global Theming:** The entire platform uses a scalable CSS variable system (`src/index.css`) to support seamless Dark Mode and Light Mode toggling without hardcoded colors.
* **Glassmorphism & Card System:** Clean, modern `.card` components that adapt their background elevations, border glows (e.g., `--emerald-glow`), and text contrasts based on the active theme.
* **Dynamic Recharts Integrations:** Automatically parses the user's current CIBIL score and renders a beautiful 6-month trajectory line graph that seamlessly inverts colors for light/dark visibility.
* **Algorithmic Billing UI:** Intelligently calculates the next credit card bill date dynamically (e.g., automatically rolling over dates to the next valid month).
* **Regulatory Action UI:** Includes integrated "Report to RBI Ombudsman" buttons for instantaneous unauthorized loan disputes.

---

## 🛠 Technology Stack

* **Frontend:** React.js, Vite, Vanilla CSS Design System, Recharts (Data Visualization), Lucide-React (Icons), React-Markdown.
* **Backend:** Node.js, Express.js.
* **Cloud / Serverless:** Vercel Serverless Functions (`api/index.js` architecture).
* **Database:** Firebase Firestore (NoSQL) for user profiles and chat history persistence.
* **AI Engine:** Groq Cloud Inference API (`llama-3.3-70b-versatile`).

---

## ⚙️ Getting Started / Local Setup

1. **Clone the Repository** and navigate to the project directory.
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Environment Variables:**
   Create a `.env` file in the root directory containing your API keys:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   VITE_FIREBASE_API_KEY=your_firebase_key_here
   ```
4. **Run the Backend (API):**
   ```bash
   node server.js
   ```
   *(Runs the Express server on port 3001 and enables local LoRA JSONL logging).*
5. **Run the Frontend:**
   ```bash
   npm run dev
   ```
   *(Runs the Vite development server on port 5173).*

---

### 📝 Note on Context Data
This repository includes local files like `LLM_Project_Instructions.txt` and `LLM_Report_Context_Data.txt` which provide additional deep architectural context for LLM agents or contributors interacting with this codebase.
