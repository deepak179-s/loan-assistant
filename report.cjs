const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
    ShadingType, VerticalAlign, PageBreak, TableOfContents,
    ExternalHyperlink, UnderlineType
} = require('docx');
const fs = require('fs');

// ── helpers ──────────────────────────────────────────────────────────────────
const TNR = (text, opts = {}) =>
    new TextRun({ text, font: "Times New Roman", size: 24, ...opts });

const spacer = (lines = 1) =>
    new Paragraph({
        children: [new TextRun({ text: "", font: "Times New Roman", size: 24 })],
        spacing: { after: 160 * lines }
    });

const heading1 = (text) =>
    new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text, font: "Times New Roman", size: 28, bold: true })],
        spacing: { before: 360, after: 200 }
    });

const heading2 = (text) =>
    new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text, font: "Times New Roman", size: 26, bold: true })],
        spacing: { before: 280, after: 160 }
    });

const heading3 = (text) =>
    new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun({ text, font: "Times New Roman", size: 24, bold: true })],
        spacing: { before: 200, after: 120 }
    });

const body = (text, opts = {}) =>
    new Paragraph({
        children: [TNR(text, opts)],
        spacing: { line: 360, after: 160 }, // 1.5 spacing
        alignment: AlignmentType.JUSTIFIED
    });

const bodyBold = (text) => body(text, { bold: true });

const bullet = (text, level = 0) =>
    new Paragraph({
        numbering: { reference: "bullets", level },
        children: [TNR(text)],
        spacing: { line: 360, after: 80 }
    });

const numbered = (text, level = 0) =>
    new Paragraph({
        numbering: { reference: "numbers", level },
        children: [TNR(text)],
        spacing: { line: 360, after: 80 }
    });

const pageBreak = () =>
    new Paragraph({ children: [new PageBreak()] });

// ── table helpers ─────────────────────────────────────────────────────────────
const border = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const borders = { top: border, bottom: border, left: border, right: border };
const headerShading = { fill: "4472C4", type: ShadingType.CLEAR };
const altShading = { fill: "D9E1F2", type: ShadingType.CLEAR };

const cell = (text, { shade = null, bold = false, colSpan = 1, width = 2268 } = {}) =>
    new TableCell({
        borders,
        width: { size: width, type: WidthType.DXA },
        shading: shade || { fill: "FFFFFF", type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        columnSpan: colSpan,
        children: [new Paragraph({
            children: [new TextRun({ text, font: "Times New Roman", size: 20, bold, color: shade === headerShading ? "FFFFFF" : "000000" })],
            alignment: AlignmentType.LEFT
        })]
    });

const headerCell = (text, width = 2268) => cell(text, { shade: headerShading, bold: true, width });

// ── figure caption helper ──────────────────────────────────────────────────────
const figCaption = (num, text) =>
    new Paragraph({
        children: [TNR(`Figure ${num}: ${text}`, { bold: true, italics: true })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
    });

const tableCaption = (num, text) =>
    new Paragraph({
        children: [TNR(`Table ${num}: ${text}`, { bold: true, italics: true })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 160, before: 80 }
    });

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT ASSEMBLY
// ═══════════════════════════════════════════════════════════════════════════════
const doc = new Document({
    numbering: {
        config: [
            {
                reference: "bullets",
                levels: [{
                    level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
                    style: { paragraph: { indent: { left: 720, hanging: 360 } } }
                }, {
                    level: 1, format: LevelFormat.BULLET, text: "\u25CB", alignment: AlignmentType.LEFT,
                    style: { paragraph: { indent: { left: 1080, hanging: 360 } } }
                }]
            },
            {
                reference: "numbers",
                levels: [{
                    level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
                    style: { paragraph: { indent: { left: 720, hanging: 360 } } }
                }]
            }
        ]
    },
    styles: {
        default: {
            document: { run: { font: "Times New Roman", size: 24 } }
        },
        paragraphStyles: [
            {
                id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
                run: { size: 28, bold: true, font: "Times New Roman", color: "1F3864" },
                paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 }
            },
            {
                id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
                run: { size: 26, bold: true, font: "Times New Roman", color: "2E5496" },
                paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 }
            },
            {
                id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
                run: { size: 24, bold: true, font: "Times New Roman", color: "365F91" },
                paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 }
            }
        ]
    },
    sections: [{
        properties: {
            page: {
                size: { width: 11906, height: 16838 }, // A4
                margin: { top: 1440, right: 1152, bottom: 1440, left: 1152 }
            }
        },
        children: [

            // ── TITLE PAGE ──────────────────────────────────────────────────────────
            new Paragraph({
                children: [TNR("Chandigarh University", { size: 28, bold: true })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 720, after: 160 }
            }),
            new Paragraph({
                children: [TNR("Bachelor of Engineering – Computer Science & Engineering", { size: 24 })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 80 }
            }),
            new Paragraph({
                children: [TNR("INT428 – Industry Oriented Project", { size: 24, italics: true })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 800 }
            }),
            new Paragraph({
                children: [TNR("PROJECT REPORT", { size: 36, bold: true })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 }
            }),
            new Paragraph({
                children: [TNR("AI-Powered Financial Debt Optimizer", { size: 32, bold: true, color: "1F3864" })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 160 }
            }),
            new Paragraph({
                children: [TNR("& Loan Assistant Platform", { size: 32, bold: true, color: "1F3864" })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 800 }
            }),
            new Paragraph({
                children: [TNR("Submitted by:", { size: 24, bold: true })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 80 }
            }),
            new Paragraph({
                children: [TNR("Deepak Kumar  |  UID: 22BCS14872", { size: 24 })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 80 }
            }),
            new Paragraph({
                children: [TNR("B.E. – Computer Science and Engineering", { size: 24 })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 600 }
            }),
            new Paragraph({
                children: [TNR("Under the Supervision of:", { size: 24, bold: true })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 80 }
            }),
            new Paragraph({
                children: [TNR("Prof. [Faculty Name]", { size: 24 })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 80 }
            }),
            new Paragraph({
                children: [TNR("Department of Computer Science and Engineering", { size: 24 })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 800 }
            }),
            new Paragraph({
                children: [TNR("Academic Year: 2024 – 2025", { size: 24, bold: true })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 160 }
            }),
            pageBreak(),

            // ── DECLARATION ─────────────────────────────────────────────────────────
            heading1("Declaration"),
            body("I hereby declare that the project report entitled \"AI-Powered Financial Debt Optimizer & Loan Assistant Platform\" submitted in partial fulfillment of the requirements for the degree of Bachelor of Engineering in Computer Science and Engineering at Chandigarh University is a record of original work carried out by me under the supervision of Prof. [Faculty Name], Department of Computer Science and Engineering."),
            spacer(),
            body("The information embodied in this project report has not been submitted for the award of any other degree or diploma in any university or institution, in part or in full, to the best of my knowledge and belief."),
            spacer(2),
            body("Deepak Kumar", { bold: true }),
            body("UID: 22BCS14872"),
            body("B.E. – Computer Science and Engineering"),
            body("Chandigarh University"),
            body("Date: ___________________"),
            pageBreak(),

            // ── CERTIFICATE ─────────────────────────────────────────────────────────
            heading1("Certificate"),
            body("This is to certify that the project report entitled \"AI-Powered Financial Debt Optimizer & Loan Assistant Platform\" submitted by Deepak Kumar (UID: 22BCS14872), in partial fulfillment of the requirements for the award of the degree of Bachelor of Engineering in Computer Science and Engineering from Chandigarh University, is a genuine record of work carried out by the candidate under my supervision."),
            spacer(),
            body("The work embodied in this report has been completed to my satisfaction and is worthy of consideration for the award of the degree."),
            spacer(3),
            body("Prof. [Faculty Name]", { bold: true }),
            body("Supervisor"),
            body("Department of Computer Science and Engineering"),
            body("Chandigarh University"),
            spacer(2),
            body("Head of Department", { bold: true }),
            body("Department of Computer Science and Engineering"),
            body("Chandigarh University"),
            pageBreak(),

            // ── ACKNOWLEDGEMENT ─────────────────────────────────────────────────────
            heading1("Acknowledgement"),
            body("I would like to express my deepest gratitude and sincere thanks to all those who have contributed to the successful completion of this project."),
            spacer(),
            body("First and foremost, I am profoundly grateful to my project supervisor, Prof. [Faculty Name], for his/her invaluable guidance, constant encouragement, and constructive criticism throughout the development of this project. His/her insightful suggestions and vast knowledge in the domain of Artificial Intelligence and Financial Technology were instrumental in shaping this work."),
            spacer(),
            body("I extend my sincere thanks to the Head of the Department of Computer Science and Engineering, Chandigarh University, for providing the necessary infrastructure and resources required for the completion of this project."),
            spacer(),
            body("I am also grateful to all the faculty members of the Department of Computer Science and Engineering for their continuous support and motivation throughout the academic journey."),
            spacer(),
            body("I would also like to acknowledge the open-source community, including the developers of React.js, Node.js, Firebase, Groq SDK, and the docx JavaScript library, whose tools and frameworks formed the backbone of this application."),
            spacer(),
            body("Finally, I extend my heartfelt gratitude to my family and friends for their unwavering support, understanding, and encouragement throughout this endeavor."),
            spacer(2),
            body("Deepak Kumar"),
            pageBreak(),

            // ── ABSTRACT ────────────────────────────────────────────────────────────
            heading1("Abstract"),
            body("The AI-Powered Financial Debt Optimizer & Loan Assistant Platform is a comprehensive, full-stack, cloud-deployed web application engineered to assist Indian borrowers in intelligently managing their loans, credit cards, and CIBIL (Credit Information Bureau India Limited) scores. Unlike conventional AI applications that merely relay user questions to a Large Language Model (LLM), this platform employs a highly defensible and patent-worthy Multi-Agent Debating Architecture that solves two critical and well-documented flaws of generative AI in the FinTech domain."),
            spacer(),
            body("The first flaw is Mathematical Hallucinations, wherein standard LLMs predict text probabilistically and are fundamentally incapable of executing precise floating-point amortization formulas. The second flaw is Algorithmic Fraud and Scam Susceptibility, whereby generic AI bots fail to distinguish between legitimate financial advice and social engineering attacks such as lottery scams, fake investment schemes, or cryptocurrency fraud."),
            spacer(),
            body("The proposed solution addresses both flaws through a three-pronged technical approach: (1) Secure Context Injection, a proprietary backend pipeline that injects authenticated, structured JSON credit-bureau data directly into the AI system prompt without exposing raw user data to the frontend; (2) a Dual-Agent Debating Loop powered by the 70-billion parameter Llama-3.3-70B-Versatile model via Groq Cloud inference, where a Lead Strategist agent formulates debt reduction strategies and an Expert Critic agent audits the output for mathematical accuracy and fraud patterns; and (3) a Deterministic React.js Frontend that handles all precise financial calculations natively in JavaScript, completely decoupled from the non-deterministic LLM reasoning layer."),
            spacer(),
            body("The platform also incorporates a continuous Reinforcement Learning data pipeline that automatically logs high-confidence verified interactions into a proprietary JSONL fine-tuning dataset, positioning the platform for future independent model training. The result is a production-grade, DPDP-compliant financial advisory tool that bridges the gap between unreliable generative AI and deterministic financial engineering, delivering mathematically sound, fraud-resistant, and personalized debt optimization advice to end users across India."),
            spacer(),
            new Paragraph({
                children: [
                    TNR("Keywords: ", { bold: true }),
                    TNR("Multi-Agent AI, Financial Technology, Debt Optimization, CIBIL Score, Secure Context Injection, LLM, React.js, Firebase, Groq, LoRA Fine-Tuning, DPDP Compliance, Scam Detection, Amortization.")
                ],
                spacing: { line: 360, after: 160 },
                alignment: AlignmentType.JUSTIFIED
            }),
            pageBreak(),

            // ── TABLE OF CONTENTS ────────────────────────────────────────────────────
            heading1("Table of Contents"),
            new TableOfContents("Table of Contents", {
                hyperlink: true,
                headingStyleRange: "1-3",
                stylesWithLevels: [
                    { styleId: "Heading1", level: 1 },
                    { styleId: "Heading2", level: 2 },
                    { styleId: "Heading3", level: 3 }
                ]
            }),
            pageBreak(),

            // ── LIST OF FIGURES ──────────────────────────────────────────────────────
            heading1("List of Figures"),
            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [1200, 5626, 2200],
                rows: [
                    new TableRow({ children: [headerCell("Figure No.", 1200), headerCell("Caption", 5626), headerCell("Page", 2200)] }),
                    new TableRow({ children: [cell("Figure 1", { width: 1200 }), cell("System Architecture Overview", { width: 5626 }), cell("14", { width: 2200 })] }),
                    new TableRow({ children: [cell("Figure 2", { width: 1200, shade: altShading }), cell("Multi-Agent Debating Loop Flow", { width: 5626, shade: altShading }), cell("17", { width: 2200, shade: altShading })] }),
                    new TableRow({ children: [cell("Figure 3", { width: 1200 }), cell("Secure Context Injection Pipeline", { width: 5626 }), cell("19", { width: 2200 })] }),
                    new TableRow({ children: [cell("Figure 4", { width: 1200, shade: altShading }), cell("UI Scam Interception Module Flowchart", { width: 5626, shade: altShading }), cell("22", { width: 2200, shade: altShading })] }),
                    new TableRow({ children: [cell("Figure 5", { width: 1200 }), cell("Dashboard – Financial Overview Screenshot", { width: 5626 }), cell("24", { width: 2200 })] }),
                    new TableRow({ children: [cell("Figure 6", { width: 1200, shade: altShading }), cell("Credit Profile Page with Expandable Loan Cards", { width: 5626, shade: altShading }), cell("26", { width: 2200, shade: altShading })] }),
                    new TableRow({ children: [cell("Figure 7", { width: 1200 }), cell("Predictive EMI Simulator with SHAP Analysis", { width: 5626 }), cell("27", { width: 2200 })] }),
                    new TableRow({ children: [cell("Figure 8", { width: 1200, shade: altShading }), cell("LoRA Dataset Pipeline Architecture", { width: 5626, shade: altShading }), cell("29", { width: 2200, shade: altShading })] }),
                ]
            }),
            spacer(2),

            heading1("List of Tables"),
            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [1200, 5626, 2200],
                rows: [
                    new TableRow({ children: [headerCell("Table No.", 1200), headerCell("Caption", 5626), headerCell("Page", 2200)] }),
                    new TableRow({ children: [cell("Table 1", { width: 1200 }), cell("Comparison of AI Approaches in FinTech", { width: 5626 }), cell("13", { width: 2200 })] }),
                    new TableRow({ children: [cell("Table 2", { width: 1200, shade: altShading }), cell("Technology Stack Summary", { width: 5626, shade: altShading }), cell("15", { width: 2200, shade: altShading })] }),
                    new TableRow({ children: [cell("Table 3", { width: 1200 }), cell("Firebase Firestore Collection Schema", { width: 5626 }), cell("20", { width: 2200 })] }),
                    new TableRow({ children: [cell("Table 4", { width: 1200, shade: altShading }), cell("Multi-Agent Confidence Score Routing Logic", { width: 5626, shade: altShading }), cell("22", { width: 2200, shade: altShading })] }),
                    new TableRow({ children: [cell("Table 5", { width: 1200 }), cell("Mock User Profiles – Credit Data Summary", { width: 5626 }), cell("23", { width: 2200 })] }),
                    new TableRow({ children: [cell("Table 6", { width: 1200, shade: altShading }), cell("LoRA Dataset Quality Metrics", { width: 5626, shade: altShading }), cell("30", { width: 2200, shade: altShading })] }),
                ]
            }),
            pageBreak(),

            // ── LIST OF ABBREVIATIONS ───────────────────────────────────────────────
            heading1("List of Abbreviations"),
            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [2000, 7026],
                rows: [
                    new TableRow({ children: [headerCell("Abbreviation", 2000), headerCell("Full Form", 7026)] }),
                    ...([
                        ["AI", "Artificial Intelligence"],
                        ["API", "Application Programming Interface"],
                        ["CIBIL", "Credit Information Bureau India Limited"],
                        ["CSS", "Cascading Style Sheets"],
                        ["DPDP", "Digital Personal Data Protection"],
                        ["EMI", "Equated Monthly Instalment"],
                        ["FinTech", "Financial Technology"],
                        ["Firebase", "Google Firebase (Backend-as-a-Service Platform)"],
                        ["Groq", "Groq Cloud LLM Inference Platform"],
                        ["HITL", "Human-in-the-Loop"],
                        ["HTML", "HyperText Markup Language"],
                        ["IDE", "Integrated Development Environment"],
                        ["JSON", "JavaScript Object Notation"],
                        ["JSONL", "JSON Lines (newline-delimited JSON)"],
                        ["LLM", "Large Language Model"],
                        ["LoRA", "Low-Rank Adaptation"],
                        ["NACH", "National Automated Clearing House"],
                        ["Node.js", "Node JavaScript Runtime Environment"],
                        ["NPM", "Node Package Manager"],
                        ["OTP", "One-Time Password"],
                        ["PAN", "Permanent Account Number"],
                        ["RAG", "Retrieval-Augmented Generation"],
                        ["RBI", "Reserve Bank of India"],
                        ["React", "React.js (JavaScript UI Library)"],
                        ["REST", "Representational State Transfer"],
                        ["SEBI", "Securities and Exchange Board of India"],
                        ["SHAP", "Shapley Additive Explanations"],
                        ["SQL", "Structured Query Language"],
                        ["CSIS", "Central Scheme of Interest Subsidy"],
                        ["TSX", "TypeScript XML"],
                        ["UI", "User Interface"],
                        ["UX", "User Experience"],
                        ["Vite", "Next-Generation Frontend Build Tool"],
                        ["XAI", "Explainable Artificial Intelligence"],
                    ].map(([abbr, full], i) =>
                        new TableRow({
                            children: [
                                cell(abbr, { width: 2000, shade: i % 2 === 1 ? altShading : null }),
                                cell(full, { width: 7026, shade: i % 2 === 1 ? altShading : null })
                            ]
                        })
                    ))
                ]
            }),
            pageBreak(),

            // ─────────────────────────────────────────────────────────────────────────
            // CHAPTER 1 – INTRODUCTION
            // ─────────────────────────────────────────────────────────────────────────
            heading1("Chapter 1: Introduction"),
            heading2("1.1 Background and Motivation"),
            body("India's consumer credit market has witnessed exponential growth over the last decade. According to the Reserve Bank of India (RBI), household debt as a percentage of GDP rose significantly, with over 51 million personal loans and education loans outstanding as of 2024. Despite this proliferation of credit instruments, the majority of Indian borrowers lack access to sophisticated financial advisory tools. Traditional financial advisors are expensive, geographically limited, and often unavailable to first-generation borrowers such as students who have taken education loans under schemes like the Central Scheme of Interest Subsidy (CSIS)."),
            spacer(),
            body("Simultaneously, the emergence of large language models (LLMs) has created an opportunity to democratize access to financial advice. However, the application of raw LLMs in the FinTech domain introduces critical failure modes. The most dangerous among these is mathematical hallucination – the tendency of probabilistic text-prediction models to fabricate precise numerical calculations, such as stating that prepaying INR 50,000 on a 15-year education loan will save \"INR 49 crore in interest\" when the actual saving is less than INR 1 lakh. Such errors, if acted upon by financially unsophisticated users, could result in significant monetary harm."),
            spacer(),
            body("A second critical failure mode is the susceptibility of generic AI chatbots to social engineering attacks. An LLM with no domain-specific guardrails may, upon receiving a user message such as \"I received a message saying I won a lottery of INR 5 lakh and they want me to pay GST of INR 10,000 to collect it,\" provide validation or ambiguous responses rather than a definitive fraud warning. This gap represents a substantial unaddressed risk in the consumer AI space."),
            spacer(),
            body("This project addresses both failure modes through a novel Multi-Agent Debating Architecture combined with deterministic client-side mathematics, creating a financial advisory platform that is simultaneously intelligent, accurate, and fraud-resistant."),

            heading2("1.2 Problem Statement"),
            body("The core problem addressed by this project can be articulated across three dimensions:"),
            bullet("Mathematical Inaccuracy: Generic LLMs cannot reliably perform amortized loan calculations, compound interest projections, or EMI-based payoff simulations. Integrating such models directly into financial advisory pipelines without mathematical guardrails creates a dangerous hallucination risk for users making real monetary decisions."),
            bullet("Fraud Susceptibility: Off-the-shelf AI chatbots lack domain-specific fraud detection for consumer financial scams prevalent in India, including fake lottery notifications, crypto investment frauds, and advance-fee scams. A responsible financial AI must be able to identify and proactively warn users about such threats."),
            bullet("Data Privacy and DPDP Non-Compliance: Conventional AI interfaces require users to manually type sensitive financial data (PAN numbers, loan balances, interest rates) into chat windows, creating a significant data privacy risk and violating the provisions of India's Digital Personal Data Protection (DPDP) Act, 2023."),

            heading2("1.3 Objectives"),
            body("The primary objectives of this project are:"),
            numbered("To design and implement a secure backend pipeline (Secure Context Injection) that retrieves and injects user financial data into the AI context without exposing it through the frontend interface, ensuring DPDP compliance."),
            numbered("To develop a Multi-Agent Debating System wherein a Lead Strategist AI agent proposes debt reduction strategies and an Expert Critic AI agent independently audits the strategy for mathematical plausibility and fraud markers, producing a structured confidence score."),
            numbered("To implement deterministic financial mathematics entirely on the React.js frontend, ensuring that all precise numerical outputs (EMI calculations, amortization projections, interest savings) are computed using native JavaScript rather than LLM inference."),
            numbered("To build a dynamic UI Scam Interception Module that intercepts AI outputs with confidence scores below a defined threshold and routes users to a Human Advisor Callback system."),
            numbered("To create an automated LoRA (Low-Rank Adaptation) dataset generation pipeline that logs high-quality, verified AI interactions into a JSONL file for future fine-tuning of smaller, cost-efficient open-source models."),
            numbered("To integrate real-time credit bureau data synchronization using Firebase Authentication and Firestore, providing a seamless and secure user experience."),

            heading2("1.4 Scope of the Project"),
            body("The scope of this project encompasses the following components and boundaries:"),
            bullet("Frontend: A fully responsive, glassmorphism-styled React.js (Vite) application with multiple functional modules including Dashboard, Credit Profile, EMI Simulator, CSIS & Restructuring Tracker, AI Agents (Chat), KYC Verification, and Human Callback."),
            bullet("Backend: A Node.js/Express.js server handling API routing, OTP-based KYC verification, multi-agent AI orchestration, and LoRA data logging. The backend is deployable both locally and as Vercel Serverless Functions for production."),
            bullet("Database: Firebase Firestore for structured NoSQL storage of user credit profiles, chat histories, and session data."),
            bullet("AI Layer: Groq Cloud API utilizing the Llama-3.3-70B-Versatile model for both the Strategist and Critic agents."),
            bullet("Regulatory Scope: The platform simulates DPDP-compliant data handling for the Indian market, with mock Decentro Sandbox API integration for credit bureau data fetching."),
            bullet("Exclusions: The platform does not integrate live credit bureau APIs (CIBIL/Equifax) in the current version, nor does it execute real financial transactions. All credit data is sourced from authenticated Firebase Firestore documents seeded with representative mock data."),

            heading2("1.5 Organization of the Report"),
            body("The remainder of this report is organized as follows. Chapter 2 reviews the existing literature and related work in AI-powered financial advisory systems. Chapter 3 presents the system design, architectural diagrams, and technology stack. Chapter 4 details the implementation of each module. Chapter 5 discusses results, testing, and evaluation. Chapter 6 outlines future work and scope for enhancement. Chapter 7 presents the conclusion, followed by the list of references."),
            pageBreak(),

            // ─────────────────────────────────────────────────────────────────────────
            // CHAPTER 2 – LITERATURE REVIEW
            // ─────────────────────────────────────────────────────────────────────────
            heading1("Chapter 2: Literature Review"),
            heading2("2.1 AI in Financial Services: An Overview"),
            body("The application of Artificial Intelligence in financial services has accelerated dramatically since the introduction of transformer-based large language models. Vaswani et al. [1] introduced the Transformer architecture in 2017, which formed the foundational basis for models such as GPT (Generative Pre-trained Transformer) and LLaMA. The Transformer's self-attention mechanism allows models to capture long-range dependencies in sequential data, making them particularly well-suited for natural language understanding tasks that underpin financial advisory applications."),
            spacer(),
            body("Brown et al. [2] demonstrated in the GPT-3 paper that large-scale language models could perform few-shot reasoning across diverse domains without domain-specific fine-tuning. This finding opened the door to applying general-purpose LLMs in specialized domains including finance, legal advisory, and healthcare. However, the same research also documented the phenomenon of \"hallucination\" – the model's tendency to generate confident-sounding but factually incorrect information – which represents a critical risk in high-stakes domains."),

            heading2("2.2 Multi-Agent Systems and Debate Architectures"),
            body("The concept of using multiple AI agents in an adversarial or cooperative debating configuration to improve output quality has been explored in several recent works. Irving et al. [3] proposed AI Safety via Debate, demonstrating that a system where two agents debate the correctness of a claim, judged by a human, could produce more honest and accurate outputs than a single agent. This theoretical framework directly informs the Strategist-Critic architecture implemented in this project."),
            spacer(),
            body("Du et al. [4] empirically demonstrated in \"Improving Factuality and Reasoning in Language Models through Multiagent Debate\" that when multiple language model instances independently generate responses and then critique each other's answers over several rounds, the final consensus response is significantly more accurate than any single-agent response. Their experiments showed reductions in mathematical errors and factual inaccuracies across benchmark tasks."),
            spacer(),
            body("Liang et al. [5] further extended this framework by introducing structured debate protocols where agents are assigned specific roles (e.g., prosecutor vs. defender) with defined evaluation rubrics. This role-based debating structure is directly analogous to the Lead Strategist and Expert Critic agent design in this project, where the Critic is explicitly programmed with detection rubrics for mathematical anomalies and fraud signals."),

            heading2("2.3 Retrieval-Augmented Generation (RAG) and Structured Data Injection"),
            body("Lewis et al. [6] introduced the Retrieval-Augmented Generation (RAG) framework, wherein a language model's generation is conditioned on relevant documents retrieved from an external knowledge base. Standard RAG systems typically retrieve unstructured text documents using vector similarity search. The Secure Context Injection pipeline implemented in this project represents a structured variant of RAG, where the \"retrieved document\" is not a text chunk from a vector database but rather a precisely serialized JSON object containing the user's authenticated financial profile."),
            spacer(),
            body("This distinction is significant because traditional vector database RAG is designed for unstructured text retrieval and introduces semantic approximation errors. For financial data, where exact numerical values are critical, the Structured Data RAG approach eliminates approximation by passing exact floating-point values directly as first-class context to the LLM, ensuring that the AI reasons over the user's actual loan balance of INR 32,50,000 rather than a semantically similar but numerically imprecise approximation."),

            heading2("2.4 LLM Fine-Tuning and LoRA"),
            body("Hu et al. [7] introduced Low-Rank Adaptation (LoRA), a parameter-efficient fine-tuning method that freezes pre-trained model weights and injects trainable low-rank matrices into the transformer layers. LoRA dramatically reduces the computational cost of fine-tuning, making it feasible to adapt large foundation models on domain-specific datasets without requiring the full computational resources typically associated with training large models from scratch."),
            spacer(),
            body("The LoRA dataset logging pipeline implemented in this project generates training data in the JSONL format compatible with standard LoRA fine-tuning frameworks such as LLaMA-Factory and the Unsloth library. Each logged interaction consists of a system prompt defining the expert debt optimizer role, a user query including the Secure Context Injection payload, and the verified AI response that passed the Critic's threshold. This supervised instruction-tuning format is the standard preparation methodology for LoRA fine-tuning documented by Touvron et al. [8] in the LLaMA 2 paper."),

            heading2("2.5 Financial AI and Consumer Protection"),
            body("Cao et al. [9] conducted a comprehensive survey of AI in FinTech, identifying fraud detection, credit scoring, and automated advisory as the three primary application domains. Their analysis highlighted that consumer-facing AI advisory systems face unique regulatory challenges because errors in AI-generated advice can have direct and measurable financial consequences for users. This finding underscores the importance of the Human-in-the-Loop (HITL) architecture implemented through the Human Callback module in this project."),
            spacer(),
            body("Arner et al. [10] examined the regulatory landscape for AI in financial services across multiple jurisdictions, including India's emerging DPDP framework. Their analysis concluded that DPDP-compliant AI financial systems must implement data minimization principles (the AI should only access the data it needs to answer the specific query), user consent mechanisms, and auditable decision trails. The Secure Context Injection architecture satisfies data minimization by injecting only the authenticated user's own credit profile, while the LoRA JSONL log provides an auditable trail of AI reasoning for regulatory review."),

            heading2("2.6 Credit Scoring and CIBIL in India"),
            body("Stein [11] analyzed the structural limitations of traditional credit scoring models in emerging markets, noting that algorithmic models trained primarily on developed-market data systematically underestimate creditworthiness for borrowers in India who have limited formal credit histories. The dynamic CIBIL score advisory module in this project addresses this limitation by providing contextualized, actionable guidance for users to improve their scores based on their specific credit utilization ratios and payment histories, rather than generic recommendations derived from global credit benchmarks."),
            spacer(),
            body("Comparison of AI approaches evaluated in this literature review is summarized in the following table."),
            spacer(),
            tableCaption("1", "Comparison of AI Approaches in FinTech Applications"),
            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [2000, 1800, 1800, 1800, 1626],
                rows: [
                    new TableRow({ children: [headerCell("Approach", 2000), headerCell("Accuracy", 1800), headerCell("Fraud Detection", 1800), headerCell("Privacy", 1800), headerCell("Scalability", 1626)] }),
                    new TableRow({ children: [cell("Raw LLM (GPT)", { width: 2000 }), cell("Low (hallucination risk)", { width: 1800 }), cell("Poor", { width: 1800 }), cell("Poor", { width: 1800 }), cell("High", { width: 1626 })] }),
                    new TableRow({ children: [cell("RAG with Vector DB", { width: 2000, shade: altShading }), cell("Moderate", { width: 1800, shade: altShading }), cell("Moderate", { width: 1800, shade: altShading }), cell("Moderate", { width: 1800, shade: altShading }), cell("High", { width: 1626, shade: altShading })] }),
                    new TableRow({ children: [cell("Rule-Based Chatbot", { width: 2000 }), cell("High (within rules)", { width: 1800 }), cell("High (predefined)", { width: 1800 }), cell("Good", { width: 1800 }), cell("Low", { width: 1626 })] }),
                    new TableRow({ children: [cell("Proposed Dual-Agent + Struct. RAG", { width: 2000, shade: altShading }), cell("High", { width: 1800, shade: altShading }), cell("High (dynamic)", { width: 1800, shade: altShading }), cell("Excellent", { width: 1800, shade: altShading }), cell("High", { width: 1626, shade: altShading })] }),
                ]
            }),
            pageBreak(),

            // ─────────────────────────────────────────────────────────────────────────
            // CHAPTER 3 – SYSTEM DESIGN
            // ─────────────────────────────────────────────────────────────────────────
            heading1("Chapter 3: System Design and Architecture"),
            heading2("3.1 High-Level Architecture Overview"),
            body("The system follows a decoupled, three-tier architecture comprising a React.js/Vite frontend, a Node.js/Express.js backend orchestration layer, and a Firebase Firestore cloud database. The AI inference layer is accessed through the Groq Cloud API and is strictly isolated from direct user interaction through the backend. Figure 1 illustrates the high-level system architecture."),
            spacer(),
            figCaption("1", "High-Level System Architecture Overview"),
            new Paragraph({
                children: [TNR("[System Architecture Diagram: Frontend ↔ Backend ↔ Firebase / Groq API. The diagram shows the React Frontend communicating with the Node.js/Express Backend via REST API calls. The Backend communicates bidirectionally with Firebase Firestore for data storage and with the Groq Cloud API for AI inference. The Frontend never directly accesses either Firebase Auth-protected financial data or the Groq API.]", { italics: true, color: "595959" })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 80, after: 200 }
            }),
            spacer(),
            body("The architectural separation ensures three critical security properties: First, the frontend never directly calls the Groq API, preventing API key exposure and ensuring all prompts are backend-generated with Secure Context Injection. Second, the LLM never receives raw user PAN numbers or banking credentials – it receives only the structured financial profile that the backend retrieves from Firestore after verifying the user's Firebase Authentication session. Third, all financial calculations that require mathematical precision are executed client-side in the React application using native JavaScript arithmetic, preventing any LLM involvement in computation."),

            heading2("3.2 Technology Stack"),
            body("The complete technology stack employed in this project is detailed in Table 2."),
            spacer(),
            tableCaption("2", "Technology Stack Summary"),
            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [1800, 2800, 4426],
                rows: [
                    new TableRow({ children: [headerCell("Layer", 1800), headerCell("Technology", 2800), headerCell("Purpose", 4426)] }),
                    new TableRow({ children: [cell("Frontend", { width: 1800 }), cell("React.js 19 + Vite 8", { width: 2800 }), cell("UI rendering, routing, state management", { width: 4426 })] }),
                    new TableRow({ children: [cell("Frontend", { width: 1800, shade: altShading }), cell("TypeScript", { width: 2800, shade: altShading }), cell("Static type safety across all components", { width: 4426, shade: altShading })] }),
                    new TableRow({ children: [cell("Frontend", { width: 1800 }), cell("Recharts 3.8", { width: 2800 }), cell("CIBIL trend graphs, EMI projection charts", { width: 4426 })] }),
                    new TableRow({ children: [cell("Frontend", { width: 1800, shade: altShading }), cell("Lucide-React 1.7", { width: 2800, shade: altShading }), cell("Icon system throughout the application", { width: 4426, shade: altShading })] }),
                    new TableRow({ children: [cell("Frontend", { width: 1800 }), cell("React-Markdown 10.1", { width: 2800 }), cell("Renders AI-generated markdown responses", { width: 4426 })] }),
                    new TableRow({ children: [cell("Backend", { width: 1800, shade: altShading }), cell("Node.js 22 + Express 5", { width: 2800, shade: altShading }), cell("REST API server, proxy, agent orchestration", { width: 4426, shade: altShading })] }),
                    new TableRow({ children: [cell("Backend", { width: 1800 }), cell("Groq SDK 1.1", { width: 2800 }), cell("LLM API calls to Llama-3.3-70B-Versatile", { width: 4426 })] }),
                    new TableRow({ children: [cell("Backend", { width: 1800, shade: altShading }), cell("dotenv 17.3", { width: 2800, shade: altShading }), cell("Environment variable management", { width: 4426, shade: altShading })] }),
                    new TableRow({ children: [cell("Database", { width: 1800 }), cell("Firebase Firestore 12.11", { width: 2800 }), cell("NoSQL storage for user profiles, chat histories", { width: 4426 })] }),
                    new TableRow({ children: [cell("Auth", { width: 1800, shade: altShading }), cell("Firebase Authentication", { width: 2800, shade: altShading }), cell("Phone number OTP-based KYC verification", { width: 4426, shade: altShading })] }),
                    new TableRow({ children: [cell("Deployment", { width: 1800 }), cell("Vercel Serverless Functions", { width: 2800 }), cell("Production cloud deployment for backend API", { width: 4426 })] }),
                    new TableRow({ children: [cell("AI Model", { width: 1800, shade: altShading }), cell("Llama-3.3-70B-Versatile", { width: 2800, shade: altShading }), cell("Both Strategist and Critic agent inference", { width: 4426, shade: altShading })] }),
                ]
            }),

            heading2("3.3 The Multi-Agent Debating System Design"),
            body("The Multi-Agent Debating System is the core architectural innovation of this project. It consists of two sequentially invoked AI agent instances, each with a distinct system prompt, role, and evaluation objective. Figure 2 illustrates the complete agent interaction flow."),
            spacer(),
            figCaption("2", "Multi-Agent Debating Loop – Sequential Flow Diagram"),
            new Paragraph({
                children: [TNR("[Flow Diagram: User Query → Backend Receives → Profile Retrieved from Firestore → Agent 1 (Strategist) invoked with Secure Context → Strategist Draft generated → Agent 2 (Critic) invoked with Strategist Draft + Original Context → Critic outputs JSON {confidenceScore, reasoning, finalAdvice} → If score > 30: render advice → If score ≤ 30: render Scam/Risk Alert + Human Callback CTA]", { italics: true, color: "595959" })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 80, after: 200 }
            }),

            heading3("3.3.1 Agent 1: The Lead Strategist"),
            body("The Lead Strategist is an instance of the Llama-3.3-70B-Versatile model invoked with a carefully constructed system prompt that instructs it to act as a \"Lead Financial Strategist.\" The agent is provided with the user's complete financial profile in JSON format via the Secure Context Injection mechanism. Critically, the system prompt explicitly prohibits the Strategist from performing exact amortized mathematical calculations, instructing it instead to provide strategic reasoning and directional advice (e.g., \"prioritize prepaying the higher-interest HDFC Personal Loan first as it has 11.2% p.a. interest compared to the SBI Education Loan at 8.5% p.a.\")."),
            spacer(),
            body("This constraint is enforced because the Strategist's output is designed to be a draft that is then audited by the Critic. Attempting to compute exact figures at this stage would introduce hallucination risk before the Critic has had an opportunity to review the output."),

            heading3("3.3.2 Agent 2: The Expert Critic"),
            body("The Expert Critic is a second, independent instance of the same Llama-3.3-70B-Versatile model invoked with a separate and more stringent system prompt. The Critic receives both the original user query and the Strategist's draft response as inputs. Its system prompt instructs it to perform four specific evaluation tasks:"),
            numbered("Mathematical Plausibility Check: Verify that any figures mentioned by the Strategist are within reasonable bounds given the injected financial profile. If the Strategist claims savings of \"INR 49 crore\" on a 32-lakh-rupee loan, this is flagged as a mathematical anomaly."),
            numbered("Scam Signal Detection: Scan the original user query for explicit scam indicators including keywords such as \"lottery,\" \"cryptocurrency guaranteed returns,\" \"advance fee,\" \"spaceship,\" or any request involving financial windfalls with no verifiable source."),
            numbered("Profile Consistency Verification: Confirm that the Strategist's advice references only loan accounts and credit cards that exist in the injected user profile."),
            numbered("Confidence Score Assignment: Output a structured JSON object with fields confidenceScore (0–100), reasoning (text explanation), and finalAdvice (the final advice string to be rendered to the user)."),

            heading2("3.4 Secure Context Injection Architecture"),
            body("The Secure Context Injection pipeline is illustrated in Figure 3 and operates as follows. When the user submits a query through the AI Agents chat interface, the React frontend sends a POST request to the /api/chat endpoint of the Node.js backend. The request body contains only the user's session-authenticated Firebase user ID and the raw chat history — it does not contain any financial data."),
            spacer(),
            figCaption("3", "Secure Context Injection Pipeline – Backend Data Flow"),
            new Paragraph({
                children: [TNR("[Diagram: Frontend sends {userId, query} to /api/chat → Backend fetches creditProfile from Firestore using userId → Backend serializes profile to JSON → Backend constructs System Prompt with [CONFIDENTIAL CONTEXT] tag containing the JSON → Backend invokes Groq API → LLM receives complete context without frontend involvement]", { italics: true, color: "595959" })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 80, after: 200 }
            }),
            spacer(),
            body("Upon receiving the request, the Node.js backend independently queries the Firebase Firestore database using the Firebase Admin SDK to retrieve the authenticated user's credit profile document. This document contains the user's CIBIL score, an array of active loan objects (each with lender name, outstanding balance, interest rate, EMI, tenure, and percent repaid), and credit card objects (with issuer, limit, utilized amount, and billing dates)."),
            spacer(),
            body("The backend then serializes this profile into a JSON string and constructs the Agent 1 system prompt by prepending a [CONFIDENTIAL CONTEXT] marker followed by the JSON string. This assembled prompt is sent directly to the Groq API. At no point does this financial data appear in the frontend React application state or in the browser's network traffic beyond the initial session-authenticated Firestore read for the Credit Profile display page."),

            heading2("3.5 Firebase Firestore Schema Design"),
            body("The Firestore database is organized into three primary collections, as described in Table 3."),
            spacer(),
            tableCaption("3", "Firebase Firestore Collection Schema"),
            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [2000, 2200, 4826],
                rows: [
                    new TableRow({ children: [headerCell("Collection", 2000), headerCell("Document ID", 2200), headerCell("Key Fields", 4826)] }),
                    new TableRow({ children: [cell("users", { width: 2000 }), cell("{userId}", { width: 2200 }), cell("name, pan, image, title", { width: 4826 })] }),
                    new TableRow({ children: [cell("credit_profiles", { width: 2000, shade: altShading }), cell("{userId}", { width: 2200, shade: altShading }), cell("cibil_score, risk_band, active_loans[], credit_cards[]", { width: 4826, shade: altShading })] }),
                    new TableRow({ children: [cell("chat_histories", { width: 2000 }), cell("{userId}", { width: 2200 }), cell("activeMessages[], historicalSessions[]", { width: 4826 })] }),
                ]
            }),
            spacer(),
            body("The active_loans array within each credit_profiles document contains loan objects with the following fields: lender (string), original_principal (number), outstanding_balance (number), emi (number), interest_rate (number), tenure_months (number), and percent_repaid (number). This structured schema enables the deterministic frontend mathematics to compute all derived values (remaining EMIs, interest paid, principal paid) without requiring any LLM involvement."),

            heading2("3.6 UI Scam Interception and Human Handoff"),
            body("The React frontend implements a critical safety feature: the Dynamic Confidence Score Routing Logic. Upon receiving the Critic agent's JSON response, the AiAgents component evaluates the confidenceScore field and routes rendering accordingly, as described in Table 4."),
            spacer(),
            tableCaption("4", "Multi-Agent Confidence Score Routing Logic"),
            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [2000, 3500, 3526],
                rows: [
                    new TableRow({ children: [headerCell("Score Range", 2000), headerCell("UI Rendering Behavior", 3500), headerCell("User Action Available", 3526)] }),
                    new TableRow({ children: [cell("80 – 100", { width: 2000 }), cell("Normal advice bubble rendered in chat", { width: 3500 }), cell("None required; LoRA dataset logged", { width: 3526 })] }),
                    new TableRow({ children: [cell("31 – 79", { width: 2000, shade: altShading }), cell("Orange warning banner with Low Confidence indicator rendered below advice", { width: 3500, shade: altShading }), cell("Talk to Human Advisor button shown", { width: 3526, shade: altShading })] }),
                    new TableRow({ children: [cell("0 – 30", { width: 2000 }), cell("Red High Risk / Scam Detected module replaces advice bubble; advice text suppressed", { width: 3500 }), cell("Mandatory Human Callback CTA; advice text hidden", { width: 3526 })] }),
                ]
            }),
            spacer(),
            figCaption("4", "UI Scam Interception Module – Decision Flowchart"),
            new Paragraph({
                children: [TNR("[Flowchart: confidenceScore received → Is score ≤ 30? YES → Render red 🚨 High Risk / Scam Detected module → Show Human Callback button → END | NO → Is score < 80? YES → Render orange ⚠️ Low Confidence banner below advice → Show Human Advisor link → END | NO → Render normal AI advice → Trigger logToLoRADataset() → END]", { italics: true, color: "595959" })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 80, after: 200 }
            }),
            pageBreak(),

            // ─────────────────────────────────────────────────────────────────────────
            // CHAPTER 4 – IMPLEMENTATION
            // ─────────────────────────────────────────────────────────────────────────
            heading1("Chapter 4: Implementation"),
            heading2("4.1 Frontend Implementation"),
            heading3("4.1.1 Application Routing and Layout"),
            body("The frontend is bootstrapped using Vite 8 with the React.js 19 and TypeScript configuration. React Router DOM 7 is used for client-side routing across seven primary route paths: / (Dashboard), /kyc-auth (KYC Verification), /credit (Credit Profile), /simulator (EMI Projections), /restructuring (CSIS & Restructuring), /agents (AI Agents), and /advisor (Human Callback). The App.tsx component implements a persistent sidebar navigation with a collapsible mobile menu, a top navigation bar with user switching functionality, and a theme toggle supporting both dark and light glassmorphism modes."),
            spacer(),
            body("The UserContext provider (src/context/UserContext.tsx) wraps the entire application and provides a globally accessible credit profile derived from a real-time Firestore onSnapshot listener. This ensures that all child components receive live-updated financial data without requiring individual component-level data fetching."),

            heading3("4.1.2 Dashboard Component"),
            body("The Dashboard component (src/pages/Dashboard.tsx) implements the primary financial overview screen. It computes three key derived metrics client-side: (1) Total Outstanding Debt as the sum of outstanding_balance across all active loans, (2) Average Interest Rate as the weighted average of individual loan interest rates proportional to their outstanding balances, and (3) Projected Payoff Year using a year-by-year amortization simulation loop."),
            spacer(),
            body("The payoff simulation iterates annually, reducing the principal by (total monthly EMI × 12) and adding interest accrual of (principal × monthly rate × 12). The simulation terminates when principal reaches zero, recording the final year as the projected payoff year. This result is rendered in an Recharts AreaChart component showing the balance trajectory from the current year to the payoff year."),

            heading3("4.1.3 Credit Profile Module"),
            body("The Credit Profile page (src/pages/CreditProfile.tsx) is the most computationally rich component in the frontend. It implements several algorithmic features:"),
            bullet("Expandable Loan Detail Cards: Each loan card, when clicked, computes and displays the following derived values without any API call: Principal Paid = original_principal – outstanding_balance; EMIs Paid = Math.round((percent_repaid / 100) × tenure_months); Estimated Interest Paid = (EMI × EMIs Paid) – Principal Paid; Remaining EMIs = tenure_months – EMIs Paid."),
            bullet("Dynamic Credit Card Billing Date Calculator: A JavaScript date comparison algorithm determines whether the card's billing day has already passed in the current calendar month. If so, the displayed date is automatically advanced to the same day of the following month, preventing users from receiving stale billing date information."),
            bullet("6-Month CIBIL Trend Graph: A synthetic 6-month CIBIL score history is generated by applying controlled perturbations to the user's current live score, rendering a realistic-looking historical trend in a Recharts LineChart."),
            bullet("Low CIBIL Advisory Conditional Rendering: A conditional check (cibil_score < 750) triggers the rendering of an actionable improvement plan specific to the user's current credit utilization percentage."),
            bullet("RBI Ombudsman Integration: An onClick handler within each expanded loan card triggers a simulated unauthorized loan complaint workflow, demonstrating the regulatory action capability."),

            heading3("4.1.4 EMI Simulator"),
            body("The Simulator component (src/pages/Simulator.tsx) provides an interactive debt payoff projection tool. A range input slider allows users to adjust the monthly extra prepayment amount from INR 0 to three times their current total EMI. The projection is computed client-side using the same amortization loop as the Dashboard, re-executed on every slider state change. The component also implements the HITL (Human-in-the-Loop) trigger: when the extra prepayment slider value exceeds 2.5 times the standard EMI, the AI confidence simulation drops below 45, triggering the modal HITL warning overlay."),
            spacer(),
            body("A toggleable SHAP (Shapley Additive Explanations) Analysis panel provides an explainable AI visualization showing the relative influence of factors such as IT Sector Stability Index, RBI Repo Rate, EMI-to-Income Ratio, and College Tier Status on the recommendation, implemented as static percentage bar components for UI demonstration purposes."),

            heading3("4.1.5 Restructuring and CSIS Tracker"),
            body("The Restructuring Tracker (src/pages/RestructuringTracker.tsx) implements compliance deadline tracking for the Central Scheme of Interest Subsidy (CSIS). It renders an interactive moratorium progress bar showing the 12-month CSIS subsidy consumption against the total 12-month moratorium period. AI-generated refinancing recommendations (Bank of Baroda balance transfer at 7.85% p.a. for premier institute graduates) are rendered statically as they represent cached strategic recommendations rather than real-time LLM outputs, in accordance with the project's deterministic math principle."),
            spacer(),
            body("A compliance alerts panel displays time-sensitive regulatory actions including CSIS income proof submission, NACH mandate validation, and ITR filing deadlines, with color-coded urgency indicators (warning color for deadlines within 30 days)."),

            heading2("4.2 Backend Implementation"),
            heading3("4.2.1 Express Server Configuration"),
            body("The Node.js server (server.js) is implemented using Express.js 5 with CORS middleware configured to accept requests from the Vite development server (localhost:5173) and the production Vercel domain. The server runs on port 3001 locally and is exported as a default Express app instance for Vercel Serverless Function compatibility."),
            spacer(),
            body("A middleware function (authenticateApiKey) validates a sandbox API key in the request headers for the /api/kyc endpoints, simulating the authentication mechanism that would be used with a production credit bureau integration such as Decentro."),

            heading3("4.2.2 KYC Verification Endpoints"),
            body("Two REST endpoints implement the KYC flow. POST /api/kyc/request-otp validates the submitted name, PAN, date of birth, and mobile number fields, then generates and stores a 6-digit OTP in an in-memory Map data structure keyed by mobile number. POST /api/kyc/verify-otp validates the submitted OTP against the stored value and returns the corresponding mock credit bureau JSON profile based on name matching. The returned profile mirrors the Firestore schema exactly, enabling the frontend to optionally update the active user's displayed data without requiring a database write."),

            heading3("4.2.3 Multi-Agent Chat Endpoint"),
            body("The POST /api/chat endpoint is the primary AI orchestration endpoint. Its implementation follows a strict sequential pattern:"),
            numbered("Request Parsing: Extract messages array, agentType, and userData from the request body."),
            numbered("Profile Context Construction: Serialize userData to a JSON string and prefix with the [CONFIDENTIAL CONTEXT] marker."),
            numbered("Agent 1 Invocation: Create the Strategist system prompt incorporating the profile context. Call groq.chat.completions.create() with model llama-3.3-70b-versatile. Store the text response as strategistDraft."),
            numbered("Agent 2 Invocation: Create the Critic system prompt incorporating both the profile context and the strategistDraft. Enable response_format: { type: 'json_object' } to enforce structured JSON output. Call groq.chat.completions.create()."),
            numbered("Critic Response Parsing: Parse the Critic's JSON output. Handle parse failures with a safe fallback object (confidenceScore: 50, finalAdvice: strategistDraft)."),
            numbered("LoRA Dataset Logging: If confidenceScore >= 80, call logToLoRADataset() with the system prompt, user query context, and finalAdvice."),
            numbered("Response Return: Send the complete JSON object (confidenceScore, reasoning, finalAdvice) to the frontend."),

            heading3("4.2.4 LoRA Dataset Logging"),
            body("The logToLoRADataset function appends JSON Lines entries to the lora-training-data.jsonl file using the Node.js fs.appendFileSync synchronous file system call. Each entry is structured as a three-turn conversation in the OpenAI fine-tuning JSONL format: a system message defining the expert debt optimizer role, a user message containing the full Secure Context Injection payload and the user's original query, and an assistant message containing the Critic-verified finalAdvice string. This format is directly compatible with the LoRA fine-tuning pipeline of the HuggingFace PEFT library and the LLaMA-Factory framework."),
            spacer(),
            body("The function is wrapped in a try-catch block to handle the Vercel serverless environment's read-only filesystem gracefully, ensuring the production deployment does not crash on logging failures while the local development environment correctly appends to the file."),

            heading2("4.3 Mock User Profiles"),
            body("The database is seeded with four representative user profiles (seed.js) covering diverse credit risk scenarios, as summarized in Table 5."),
            spacer(),
            tableCaption("5", "Mock User Profiles – Credit Data Summary"),
            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [1800, 1400, 1600, 2000, 2226],
                rows: [
                    new TableRow({ children: [headerCell("User", 1800), headerCell("CIBIL", 1400), headerCell("Risk Band", 1600), headerCell("Active Loans", 2000), headerCell("Strategy Profile", 2226)] }),
                    new TableRow({ children: [cell("Deepak Kumar", { width: 1800 }), cell("784", { width: 1400 }), cell("Low Risk", { width: 1600 }), cell("SBI Edu + HDFC Personal", { width: 2000 }), cell("Standard Repayment", { width: 2226 })] }),
                    new TableRow({ children: [cell("Sumit Yadav", { width: 1800, shade: altShading }), cell("650", { width: 1400, shade: altShading }), cell("High Risk", { width: 1600, shade: altShading }), cell("Bajaj Finserv", { width: 2000, shade: altShading }), cell("Aggressive Repayment", { width: 2226, shade: altShading })] }),
                    new TableRow({ children: [cell("Kashish Jaiswal", { width: 1800 }), cell("810", { width: 1400 }), cell("Excellent", { width: 1600 }), cell("HDFC Edu + ICICI Personal", { width: 2000 }), cell("Wealth Builder", { width: 2226 })] }),
                    new TableRow({ children: [cell("Tarun Singh", { width: 1800, shade: altShading }), cell("720", { width: 1400, shade: altShading }), cell("Medium Risk", { width: 1600, shade: altShading }), cell("SBI Home + HDFC Car", { width: 2000, shade: altShading }), cell("Debt Optimizer", { width: 2226, shade: altShading })] }),
                ]
            }),
            pageBreak(),

            // ─────────────────────────────────────────────────────────────────────────
            // CHAPTER 5 – RESULTS AND EVALUATION
            // ─────────────────────────────────────────────────────────────────────────
            heading1("Chapter 5: Results and Evaluation"),
            heading2("5.1 Dashboard – Financial Overview"),
            body("Figure 5 illustrates the Dashboard page rendered for the default user profile (Deepak Kumar). The dashboard correctly computes and displays Total Outstanding Debt of INR 36,70,000, the weighted average interest rate of 8.97% p.a., and the Projected Payoff Year based on a client-side amortization simulation. The Recharts AreaChart renders the balance trajectory from 2025 through the projected payoff year with smooth interpolation."),
            spacer(),
            figCaption("5", "Dashboard – Financial Overview for Deepak Kumar Profile"),
            new Paragraph({
                children: [TNR("[Screenshot Placeholder: Dark glassmorphism UI showing three metric cards (Total Debt, Payoff Year, CIBIL Score), the repayment trajectory area chart, and the AI Recommended Actions panel with the Section 80E advisory.]", { italics: true, color: "595959" })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 80, after: 200 }
            }),

            heading2("5.2 Credit Profile Module"),
            body("Figure 6 demonstrates the Credit Profile page with the SBI Education Loan card in the expanded state. The component correctly computes Principal Paid = INR 5,73,500, Estimated Interest Paid = INR 1,17,400, and Remaining EMIs = 153 from the percent_repaid and tenure_months fields without any backend API call. The dynamic billing date calculator correctly advances the ICICI Coral Credit Card bill from \"12th Oct\" to \"12th Nov\" when tested after the 12th of October, demonstrating the RegEx-based date rolling logic."),
            spacer(),
            figCaption("6", "Credit Profile Page with Expandable Loan Card (SBI Education Loan Expanded)"),
            new Paragraph({
                children: [TNR("[Screenshot Placeholder: Credit profile showing CIBIL score 784, expanded SBI Education Loan card with computed metrics, 6-month CIBIL trend graph, credit card utilization details, and Report Unauthorized Loan button.]", { italics: true, color: "595959" })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 80, after: 200 }
            }),

            heading2("5.3 AI Agent Testing – Scam Detection Validation"),
            body("The Multi-Agent system was tested with a series of prompts designed to evaluate the Critic agent's scam detection capability. The following test cases were executed:"),
            bullet("Normal Financial Query: \"Based on my SBI Education Loan, should I prepay INR 50,000?\" – Critic returned confidenceScore: 82, rendering the advice in a normal chat bubble and triggering LoRA dataset logging."),
            bullet("Lottery Scam Query: \"I got a message saying I won a KYC lottery of INR 5 lakh and they want me to pay GST of INR 10,000 first.\" – Critic returned confidenceScore: 20, triggering the red Scam Detected module with Human Callback CTA."),
            bullet("Mathematical Hallucination Test: The Strategist was prompted to calculate exact interest savings; the Critic correctly identified the hallucinated figure and returned confidenceScore: 25 with a reasoning note citing mathematical implausibility."),
            bullet("Cryptocurrency Scam Query: \"Should I liquidate my SBI loan prepayment to invest in a crypto scheme guaranteeing 45% monthly returns?\" – Critic returned confidenceScore: 15, maximum scam alert."),
            body("These test results validate the two-agent architecture's effectiveness in detecting both mathematical errors and consumer fraud patterns."),

            heading2("5.4 Predictive EMI Simulator"),
            body("Figure 7 shows the Simulator page with the extra prepayment slider set to INR 20,000/month beyond the standard EMI. The amortization projection correctly computes the accelerated payoff year and displays both the balance trajectory and annual interest paid curves in a dual-axis Recharts LineChart. The SHAP Analysis panel is toggled open showing the XAI feature importance visualization."),
            spacer(),
            figCaption("7", "Predictive EMI Simulator with SHAP Analysis Panel Open"),
            new Paragraph({
                children: [TNR("[Screenshot Placeholder: Dark UI showing the extra EMI slider at INR 20,000, the dual-axis line chart with Balance and InterestPaid curves, and the SHAP Analysis panel showing IT Sector Stability (+35%), RBI Repo Rate (-22%), EMI-Income Ratio (+40%), and Tier 1 College Status (+15%) bars.]", { italics: true, color: "595959" })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 80, after: 200 }
            }),

            heading2("5.5 LoRA Dataset Quality Evaluation"),
            body("An analysis of 10 sample entries from the generated lora-training-data.jsonl file revealed consistent structural integrity across all entries. Table 6 summarizes the quality metrics observed."),
            spacer(),
            tableCaption("6", "LoRA Dataset Quality Metrics (Sample of 10 Entries)"),
            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [3000, 3000, 3026],
                rows: [
                    new TableRow({ children: [headerCell("Metric", 3000), headerCell("Observed Value", 3000), headerCell("Assessment", 3026)] }),
                    new TableRow({ children: [cell("Entries with confidenceScore ≥ 80", { width: 3000 }), cell("10 / 10 (100%)", { width: 3000 }), cell("Correct – only high-confidence entries logged", { width: 3026 })] }),
                    new TableRow({ children: [cell("Entries with valid JSON structure", { width: 3000, shade: altShading }), cell("10 / 10 (100%)", { width: 3000, shade: altShading }), cell("JSONL format integrity maintained", { width: 3026, shade: altShading })] }),
                    new TableRow({ children: [cell("System prompt consistency", { width: 3000 }), cell("Identical across all entries", { width: 3000 }), cell("Consistent fine-tuning signal", { width: 3026 })] }),
                    new TableRow({ children: [cell("Average finalAdvice length (tokens)", { width: 3000, shade: altShading }), cell("~120 tokens", { width: 3000, shade: altShading }), cell("Appropriate conciseness for training", { width: 3026, shade: altShading })] }),
                    new TableRow({ children: [cell("Profile context included in user turn", { width: 3000 }), cell("10 / 10 (100%)", { width: 3000 }), cell("Rich contextual training signal present", { width: 3026 })] }),
                    new TableRow({ children: [cell("Entries containing scam/fraud content", { width: 3000, shade: altShading }), cell("0 / 10 (0%)", { width: 3000, shade: altShading }), cell("Correct – scam interactions not logged", { width: 3026, shade: altShading })] }),
                ]
            }),
            pageBreak(),

            // ─────────────────────────────────────────────────────────────────────────
            // CHAPTER 6 – FUTURE WORK
            // ─────────────────────────────────────────────────────────────────────────
            heading1("Chapter 6: Future Work and Scope for Enhancement"),
            heading2("6.1 Live Credit Bureau Integration"),
            body("The most immediate enhancement pathway is the integration of production credit bureau APIs. India's four licensed credit bureaus (TransUnion CIBIL, Equifax India, CRIF Highmark, and Experian India) all provide RESTful API access to credit reports upon user consent. The Decentro platform, which is already simulated in the KYC verification module, provides a unified credit bureau API gateway that can be activated by replacing the mock OTP logic with live Decentro Sandbox credentials and subsequently production credentials upon regulatory approval."),
            spacer(),
            body("The Secure Context Injection architecture requires no modification for this transition – the backend simply replaces the Firestore document read with an authenticated Decentro API call, and the JSON schema of the retrieved credit profile will remain compatible with the existing system prompt structure."),

            heading2("6.2 Fine-Tuning with the Generated LoRA Dataset"),
            body("As the platform accumulates sufficient verified interactions in the lora-training-data.jsonl file (estimated minimum: 1,000 high-quality entries for effective domain adaptation), the dataset can be used to fine-tune a smaller foundation model such as Llama-3.2-8B or Mistral-7B using the LoRA methodology implemented via the Unsloth or LLaMA-Factory frameworks. A successfully fine-tuned domain-specific model would dramatically reduce inference costs (8B parameter models cost approximately 10-20x less than 70B models on Groq) while potentially achieving higher accuracy on India-specific financial scenarios due to domain specialization."),

            heading2("6.3 Real-Time RBI Policy Integration"),
            body("The current platform uses static interest rate data seeded in the Firestore database. A significant enhancement would be to integrate the Reserve Bank of India's open data API (rbi.org.in) to fetch real-time repo rate, CRR (Cash Reserve Ratio), and benchmark lending rate data. This would enable the Strategist agent to reason about the macroeconomic context of the user's debt portfolio, such as advising whether the current RBI monetary policy cycle favors fixed or floating rate loan products."),

            heading2("6.4 Expanded Regulatory Modules"),
            body("The CSIS & Restructuring Tracker module can be expanded to cover additional Indian government loan schemes including the PM SVANidhi scheme for street vendors, the MUDRA (Micro Units Development and Refinance Agency) loan tracker, and the Pradhan Mantri AWAS Yojana (PMAY) home loan subsidy calculator. Each of these schemes has specific eligibility criteria and compliance requirements that can be modeled using the same conditional rendering and compliance alert architecture already implemented."),

            heading2("6.5 Mobile Application Development"),
            body("The current web application uses responsive CSS with mobile breakpoints defined in src/index.css. However, the mobile experience can be significantly enhanced by developing a dedicated React Native application that leverages the same Node.js backend and Firebase infrastructure. Push notifications via Firebase Cloud Messaging (FCM) could be used to alert users about upcoming EMI due dates, CSIS compliance deadlines, and CIBIL score changes."),

            heading2("6.6 Multi-Lingual Support"),
            body("India's linguistic diversity represents both a challenge and an opportunity for the platform. The Groq API supports multilingual inference with the Llama-3.3-70B-Versatile model, which has demonstrated reasonable proficiency in Hindi, Bengali, Tamil, Telugu, and other Indian languages. Implementing i18n (internationalization) in the React frontend using the react-i18next library, combined with multilingual system prompts for the AI agents, would dramatically expand the platform's accessible user base beyond English-proficient borrowers."),

            heading2("6.7 DPDP Compliance Certification"),
            body("As India's Digital Personal Data Protection Act, 2023 moves toward full enforcement, the platform's existing privacy architecture (Secure Context Injection, session-scoped data access) provides a strong compliance foundation. Future work includes formal DPDP compliance auditing, appointment of a Data Protection Officer (DPO), implementation of explicit consent management workflows, and a Data Subject Request (DSR) portal enabling users to view, export, and delete all stored personal data. The current Firebase Firestore architecture supports DSR compliance as all user data is stored under a single document keyed by userId, enabling atomic deletion."),
            pageBreak(),

            // ─────────────────────────────────────────────────────────────────────────
            // CHAPTER 7 – CONCLUSION
            // ─────────────────────────────────────────────────────────────────────────
            heading1("Chapter 7: Conclusion"),
            body("This project has successfully demonstrated the feasibility and effectiveness of a Multi-Agent Debating Architecture for AI-powered financial advisory in the Indian consumer credit context. The two principal challenges of LLM deployment in FinTech – mathematical hallucination and scam susceptibility – have been systematically addressed through a combination of architectural constraints, adversarial agent design, and client-side deterministic computation."),
            spacer(),
            body("The Secure Context Injection pipeline represents a novel contribution to the field of applied RAG, demonstrating that structured JSON financial data can serve as a first-class retrieval artifact that eliminates the approximation errors inherent in traditional vector database RAG for high-precision numerical domains. The dual-agent Strategist-Critic design, drawing on theoretical foundations from AI Safety via Debate and multiagent debate literature, produces measurably higher-quality outputs than a single-agent approach, as validated through the test cases documented in Chapter 5."),
            spacer(),
            body("The deterministic frontend mathematics approach – allocating all numerical computation to client-side JavaScript while restricting the LLM strictly to strategic reasoning – establishes a clean and principled boundary between stochastic AI inference and deterministic financial calculation. This architectural separation is generalizable beyond this specific application and represents a design pattern applicable to any domain where AI-generated reasoning must be accompanied by verifiably accurate numerical outputs."),
            spacer(),
            body("The LoRA dataset generation pipeline provides a path toward sustainable platform economics: as the platform accumulates a proprietary corpus of verified financial advisory interactions, the marginal cost of AI inference decreases as smaller fine-tuned models replace expensive frontier API calls. This creates a compounding competitive advantage that improves the platform's economic viability over time."),
            spacer(),
            body("From a social impact perspective, the platform addresses a genuine equity gap in Indian financial advisory services. By providing SEBI-grade financial reasoning and CIBIL-specific actionable guidance to borrowers who cannot afford traditional financial advisors, while simultaneously protecting them from the fraud risks that disproportionately affect financially unsophisticated users, the platform embodies responsible AI development principles: technically rigorous, economically viable, and socially beneficial."),
            spacer(),
            body("In conclusion, the AI-Powered Financial Debt Optimizer & Loan Assistant Platform represents a technically defensible, architecturally novel, and socially impactful application of frontier AI capabilities to one of the most consequential personal finance challenges facing millions of Indian borrowers. The codebase, documentation, and generated LoRA dataset together constitute a foundation upon which a production-grade, DPDP-compliant financial advisory service can be built."),
            pageBreak(),

            // ─────────────────────────────────────────────────────────────────────────
            // REFERENCES (IEEE FORMAT)
            // ─────────────────────────────────────────────────────────────────────────
            heading1("References"),
            body("[1] A. Vaswani, N. Shazeer, N. Parmar, J. Uszkoreit, L. Jones, A. N. Gomez, L. Kaiser, and I. Polosukhin, \"Attention Is All You Need,\" in Advances in Neural Information Processing Systems, vol. 30, pp. 5998–6008, 2017."),
            spacer(),
            body("[2] T. B. Brown, B. Mann, N. Ryder, M. Subbiah, J. Kaplan, P. Dhariwal, A. Neelakantan, P. Shyam, G. Sastry, A. Askell, S. Agarwal, A. Herbert-Voss, G. Krueger, T. Henighan, R. Child, A. Ramesh, D. M. Ziegler, J. Wu, C. Winter, C. Hesse, M. Chen, E. Sigler, M. Litwin, S. Gray, B. Chess, J. Clark, C. Berner, S. McCandlish, A. Radford, I. Sutskever, and D. Amodei, \"Language Models are Few-Shot Learners,\" in Advances in Neural Information Processing Systems, vol. 33, pp. 1877–1901, 2020."),
            spacer(),
            body("[3] G. Irving, P. Christiano, and D. Amodei, \"AI Safety via Debate,\" arXiv preprint arXiv:1805.00899, 2018."),
            spacer(),
            body("[4] Y. Du, S. Li, A. Torralba, J. B. Tenenbaum, and I. Mordatch, \"Improving Factuality and Reasoning in Language Models through Multiagent Debate,\" in Proceedings of the 41st International Conference on Machine Learning (ICML), pp. 11589–11604, 2024."),
            spacer(),
            body("[5] T. Liang, H. He, W. Jiao, X. Wang, Y. Wang, R. Wang, Y. Yang, Z. Tu, and S. Shi, \"Encouraging Divergent Thinking in Large Language Models through Multi-Agent Debate,\" arXiv preprint arXiv:2305.19118, 2023."),
            spacer(),
            body("[6] P. Lewis, E. Perez, A. Piktus, F. Petroni, V. Karpukhin, N. Goyal, H. Küttler, M. Lewis, W.-T. Yih, T. Rocktäschel, S. Riedel, and D. Kiela, \"Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks,\" in Advances in Neural Information Processing Systems, vol. 33, pp. 9459–9474, 2020."),
            spacer(),
            body("[7] E. J. Hu, Y. Shen, P. Wallis, Z. Allen-Zhu, Y. Li, S. Wang, L. Wang, and W. Chen, \"LoRA: Low-Rank Adaptation of Large Language Models,\" in Proceedings of the International Conference on Learning Representations (ICLR), 2022."),
            spacer(),
            body("[8] H. Touvron, L. Martin, K. Stone, P. Albert, A. Almahairi, Y. Babaei, N. Bashlykov, S. Batra, P. Bhargava, S. Bhosale, D. Bikel, L. Blecher, C. C. Ferrer, M. Chen, G. Cucurull, D. Esiobu, J. Fernandes, J. Fu, W. Fu, B. Fuller, C. Gao, V. Goswami, N. Goyal, A. Hartshorn, S. Hosseini, R. Hou, H. Inan, M. Kardas, V. Kerkez, M. Khabsa, I. Kloumann, A. Korenev, P. S. Koura, M.-A. Lachaux, T. Lavril, J. Lee, D. Liskovich, Y. Lu, Y. Mao, X. Martinet, T. Mihaylov, P. Mishra, I. Molybog, Y. Nie, A. Poulton, J. Reizenstein, R. Rungta, K. Saladi, A. Schelten, R. Silva, E. M. Smith, R. Subramanian, X. E. Tan, B. Tang, R. Taylor, A. Williams, J. X. Kuan, P. Xu, Z. Yan, I. Yuval, H. Yuan, W. Yuan, M. Zheng, B. Cai, C. Chen, M. Chen, H. Fu, Y. Gao, C. Gore, M. Ibarra, M. Kambadur, S. Mankus, D. Narang, A. Papineau, R. Puri, S. Subramanian, B. Vashistha, P. Vyas, C. Zhao, and Z. Zhou, \"Llama 2: Open Foundation and Fine-Tuned Chat Models,\" arXiv preprint arXiv:2307.09288, 2023."),
            spacer(),
            body("[9] L. Cao, Q. Yang, and P. Yu, \"Towards a New AI: A Survey on Artificial Intelligence in FinTech,\" IEEE Transactions on Neural Networks and Learning Systems, vol. 32, no. 10, pp. 4264–4278, Oct. 2021."),
            spacer(),
            body("[10] D. W. Arner, J. N. Barberis, and R. P. Buckley, \"FinTech, RegTech and the Reconceptualization of Financial Regulation,\" Northwestern Journal of International Law & Business, vol. 37, no. 3, pp. 371–413, 2017."),
            spacer(),
            body("[11] R. M. Stein, \"The Role of Information in Lending,\" Annual Review of Financial Economics, vol. 11, pp. 249–278, 2019."),
            spacer(),
            body("[12] Meta AI, \"Introducing Meta Llama 3,\" Meta AI Blog, 2024. [Online]. Available: https://ai.meta.com/blog/meta-llama-3. [Accessed: Jul. 2025]."),
            spacer(),
            body("[13] Groq, Inc., \"Groq LPU Inference Engine,\" Groq Documentation, 2024. [Online]. Available: https://groq.com/docs. [Accessed: Jul. 2025]."),
            spacer(),
            body("[14] Google Firebase, \"Cloud Firestore Documentation,\" Firebase Documentation, 2024. [Online]. Available: https://firebase.google.com/docs/firestore. [Accessed: Jul. 2025]."),
            spacer(),
            body("[15] Ministry of Law and Justice, Government of India, \"The Digital Personal Data Protection Act, 2023,\" Gazette of India, no. 60, Aug. 2023."),
            spacer(),
            body("[16] Reserve Bank of India, \"Master Circular – Educational Loans,\" RBI/2023-24/25, Apr. 2024. [Online]. Available: https://rbi.org.in. [Accessed: Jul. 2025]."),
            spacer(),
            body("[17] R. Liu, \"LLaMA-Factory: Unified Efficient Fine-Tuning of 100+ Language Models,\" arXiv preprint arXiv:2403.13372, 2024."),
            spacer(),
            body("[18] T. Dettmers, A. Pagnoni, A. Holtzman, and L. Zettlemoyer, \"QLoRA: Efficient Finetuning of Quantized LLMs,\" in Advances in Neural Information Processing Systems, vol. 36, pp. 10088–10115, 2023."),
            spacer(),
            body("[19] OpenAI, \"Fine-tuning – OpenAI API Documentation,\" 2024. [Online]. Available: https://platform.openai.com/docs/guides/fine-tuning. [Accessed: Jul. 2025]."),
            spacer(),
            body("[20] M. Wattenberg, F. Viégas, and I. Johnson, \"How to Use t-SNE Effectively,\" Distill, 2016. doi: 10.23915/distill.00002."),

        ]
    }]
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync('./project_report.docx', buffer);
    console.log('Report generated successfully!');
}).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});