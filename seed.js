import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCcTTvU3MLLB85A-VP5T03gXG3X906IXEs",
  authDomain: "loan-assistant-daf0b.firebaseapp.com",
  projectId: "loan-assistant-daf0b",
  storageBucket: "loan-assistant-daf0b.firebasestorage.app",
  messagingSenderId: "842536025713",
  appId: "1:842536025713:web:d10cd93270f567975d65d0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const users = [
  {
    id: 'deepak', name: 'Deepak Kumar', pan: 'DEEPAK', image: '/me.png', title: 'B.Tech · Standard Repayment',
    profile: {
      cibil_score: 784, risk_band: 'Low Risk',
      active_loans: [
        { lender: 'SBI Education Loan', original_principal: 3823500, outstanding_balance: 3250000, emi: 38400, interest_rate: 8.5, tenure_months: 180, percent_repaid: 15 },
        { lender: 'HDFC Personal Loan', original_principal: 763600, outstanding_balance: 420000, emi: 14500, interest_rate: 11.2, tenure_months: 60, percent_repaid: 45 }
      ],
      credit_cards: [
        { issuer: 'ICICI Coral Credit Card', limit: 200000, utilized: 45200, next_bill: '12th Oct' },
        { issuer: 'Axis Bank Flipkart Card', limit: 150000, utilized: 12400, next_bill: '18th Oct' }
      ]
    }
  },
  {
    id: 'sumit', name: 'Sumit Yadav', pan: 'SUMIT1234Y', image: '/sumit.jpeg', title: 'M.Tech · Aggressive Repayment',
    profile: {
      cibil_score: 650, risk_band: 'High Risk',
      active_loans: [
        { lender: 'Bajaj Finserv', original_principal: 500000, outstanding_balance: 450000, emi: 18000, interest_rate: 14.5, tenure_months: 36, percent_repaid: 10 }
      ],
      credit_cards: [
        { issuer: 'SBI SimplyClick', limit: 100000, utilized: 90000, next_bill: '10th Oct' }
      ]
    }
  },
  {
    id: 'kashish', name: 'Kashish Jaiswal', pan: 'KASHI1234J', image: '/kashish.jpeg', title: 'B.Des · Wealth Builder',
    profile: {
      cibil_score: 810, risk_band: 'Excellent',
      active_loans: [
        { lender: 'HDFC Education Loan', original_principal: 1500000, outstanding_balance: 1200000, emi: 18000, interest_rate: 9.5, tenure_months: 120, percent_repaid: 20 },
        { lender: 'ICICI Personal Loan', original_principal: 500000, outstanding_balance: 400000, emi: 15000, interest_rate: 12.0, tenure_months: 48, percent_repaid: 20 }
      ],
      credit_cards: [
        { issuer: 'HDFC Regalia', limit: 500000, utilized: 50000, next_bill: '5th Nov' }
      ]
    }
  },
  {
    id: 'tarun', name: 'Tarun Singh', pan: 'TARUN1234S', image: '/tarun.png', title: 'MBA · Debt Optimizer',
    profile: {
      cibil_score: 720, risk_band: 'Medium Risk',
      active_loans: [
        { lender: 'SBI Home Loan', original_principal: 5000000, outstanding_balance: 4800000, emi: 45000, interest_rate: 8.7, tenure_months: 240, percent_repaid: 4 },
        { lender: 'HDFC Car Loan', original_principal: 800000, outstanding_balance: 600000, emi: 15000, interest_rate: 9.5, tenure_months: 60, percent_repaid: 25 }
      ],
      credit_cards: []
    }
  }
];

async function seed() {
  console.log("Starting database seed...");
  try {
    for (const u of users) {
      await setDoc(doc(db, "users", u.id), {
        id: u.id,
        name: u.name,
        pan: u.pan,
        image: u.image,
        title: u.title
      });
      
      await setDoc(doc(db, "credit_profiles", u.id), u.profile);
      console.log(`Seeded ${u.name}`);
    }
    console.log("Database seed complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding auth data:", error);
    process.exit(1);
  }
}

seed();
