import { ShieldCheck, CreditCard, Landmark, LineChart, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CreditProfile() {
  const [cibilScore, setCibilScore] = useState(700); // Default placeholder
  
  useEffect(() => {
    const savedData = localStorage.getItem('cibilData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.cibil_score) {
          setCibilScore(parsed.cibil_score);
        }
      } catch (e) {
        console.error("Failed to parse CIBIL data", e);
      }
    }
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 className="text-gradient">Financial Portfolio & Credit Profile</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '8px' }}>
            Comprehensive view of your CIBIL score, active loans, and credit cards.
          </p>
        </div>
        <div style={{ padding: '12px 24px', background: 'rgba(158, 206, 106, 0.1)', border: '1px solid var(--success)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
           <div>
             <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>CIBIL Score</div>
             <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)', lineHeight: 1 }}>{cibilScore}</div>
           </div>
           <ShieldCheck size={40} color="var(--success)" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Active Loans */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Landmark color="var(--accent-primary)" />
            Active Loans
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ fontSize: '1.1rem' }}>SBI Education Loan</strong>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>₹32,50,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>Interest: 8.5% p.a.</span>
                <span>EMI: ₹38,400</span>
              </div>
              <div style={{ marginTop: '12px', width: '100%', height: '6px', background: 'rgba(0,0,0,0.5)', borderRadius: '3px' }}>
                 <div style={{ width: '15%', height: '100%', background: 'var(--accent-primary)', borderRadius: '3px' }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right' }}>15% Repaid</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ fontSize: '1.1rem' }}>HDFC Personal Loan</strong>
                <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>₹4,20,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>Interest: 11.2% p.a.</span>
                <span>EMI: ₹14,500</span>
              </div>
              <div style={{ marginTop: '12px', width: '100%', height: '6px', background: 'rgba(0,0,0,0.5)', borderRadius: '3px' }}>
                 <div style={{ width: '45%', height: '100%', background: 'var(--warning)', borderRadius: '3px' }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right' }}>45% Repaid</div>
            </div>
          </div>
        </div>

        {/* Credit Cards & Utilization */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CreditCard color="var(--accent-tertiary)" />
              Credit Cards
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderLeft: '3px solid var(--accent-tertiary)', paddingLeft: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>ICICI Coral Credit Card</strong>
                  <span>₹45,200 <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ ₹2,00,000</span></span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Next Bill: 12th Oct</div>
              </div>

              <div style={{ borderLeft: '3px solid var(--success)', paddingLeft: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Axis Bank Flipkart Card</strong>
                  <span>₹12,400 <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ ₹1,50,000</span></span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Next Bill: 18th Oct</div>
              </div>
            </div>
            
            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <LineChart color="var(--accent-primary)" />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Total Credit Utilization: 16%</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Excellent - Keeping below 30% improves CIBIL.</div>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', background: 'rgba(247, 118, 142, 0.05)', border: '1px solid var(--danger)' }}>
             <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)' }}>
               <AlertTriangle size={18} /> Deep Insights Risk Alert
             </h3>
             <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
               Your HDFC Personal Loan has a high interest rate of 11.2%. The AI Debt Optimizer recommends transferring this balance or paying it off aggressively before clearing the SBI Education Loan.
             </p>
             <button className="btn btn-secondary" style={{ marginTop: '16px', fontSize: '0.85rem' }}>Ask Optimizer Agent</button>
          </div>

        </div>

      </div>
    </div>
  );
}
