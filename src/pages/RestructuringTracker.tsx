import { useState } from 'react';
import { useUser } from '../context/UserContext';

export default function RestructuringTracker() {
  const { creditProfile } = useUser();
  const totalEmi = creditProfile?.active_loans?.reduce((sum: number, l: any) => sum + l.emi, 0) || 38400;
  const [csisMonths] = useState(12);
  const totalMoratorium = 12; // 1 year after course
  
  return (
    <div>
      <div className="page-header" style={{ marginBottom: 32 }}>
        <h1 style={{ marginBottom: '8px' }}>Subsidies & Restructuring</h1>
        <p>
          Track Central Scheme of Interest Subsidy (CSIS) eligibility, EMI moratorium periods, and refinancing opportunities.
        </p>
      </div>

      <div className="grid-2">
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* CSIS Tracker */}
          <div className="card card-pad">
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span>CSIS Interest Subsidy Tracker</span>
              <span style={{ color: 'var(--emerald-bright)', fontWeight: 'bold' }}>Active</span>
            </h3>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Under the Ministry of Education scheme, full interest subsidy is provided during the moratorium period (course period + 1 year). 
              Government has paid ₹1,45,000 in interest on your behalf so far.
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span>Moratorium Remaining</span>
              <span>{totalMoratorium - csisMonths} Months Left</span>
            </div>
            <div style={{ width: '100%', height: '16px', background: 'var(--bg-raised)', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
               <div style={{ 
                 width: `${(csisMonths/totalMoratorium)*100}%`, 
                 height: '100%', 
                 background: csisMonths >= totalMoratorium ? 'var(--rose-bright)' : 'var(--electric)',
                 borderRadius: '8px'
               }} />
            </div>
            
            <div style={{ background: 'var(--gold-glow)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--gold-bright)' }}>
              <strong>Important Notice</strong>
              <p style={{ fontSize: '0.85rem', margin: '4px 0 0' }}>EMI payments of ₹{totalEmi.toLocaleString('en-IN')} will commence starting next month as your moratorium expires. Ensure your auto-debit mandate is active.</p>
            </div>
          </div>
          
          {/* Refinancing Options */}
          <div className="card card-pad">
            <h3 style={{ marginBottom: '16px' }}>Loan Restructuring & Refinancing</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Our AI has analyzed public and private sector bank rates to find optimized refinancing.
            </p>
            
            <div style={{ display: 'grid', gap: '16px' }}>
               <div style={{ background: 'var(--emerald-glow)', border: '1px solid var(--emerald-bright)', padding: '16px', borderRadius: '8px' }}>
                 <strong style={{ color: 'var(--emerald-bright)', display: 'block', marginBottom: '4px' }}>Recommendation: Balance Transfer to Bank of Baroda</strong>
                 <p style={{ fontSize: '0.85rem' }}>BoB is offering 7.85% p.a for candidates from Premier Institutes (IIM/IIT/NIT). Switching from your current 8.5% SBI rate will save you ₹2,10,000 over the tenure.</p>
               </div>
               
               <div style={{ background: 'var(--bg-raised)', padding: '16px', borderRadius: '8px' }}>
                 <strong style={{ display: 'block', marginBottom: '4px' }}>Alternative: Section 80E Tax Deduction Optimization</strong>
                 <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Instead of prepaying the principal, use the Section 80E Income Tax deduction on interest paid for 8 straight years to maximize total tax savings in the 30% slab rate.</p>
               </div>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card card-pad" style={{ borderTop: '4px solid var(--gold-bright)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Compliance Alerts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <AlertItem 
                title="Income Proof for CSIS" 
                desc="Submit updated EWS certificate to claim final year subsidy."
                days={14}
              />
              <AlertItem 
                title="NACH Mandate" 
                desc="Bank requires e-mandate validation for upcoming EMIs."
                days={5}
              />
              <AlertItem 
                title="ITR Filing (Sec 80E)" 
                desc="File returns to claim interest deduction."
                days={45}
              />
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
  );
}

function AlertItem({ title, desc, days }: { title: string, desc: string, days: number }) {
  return (
    <div style={{ background: 'var(--bg-raised)', padding: '16px', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <strong style={{ fontSize: '0.9rem' }}>{title}</strong>
        <span style={{ fontSize: '0.8rem', color: days < 30 ? 'var(--gold-bright)' : 'var(--text-secondary)' }}>Due in {days}d</span>
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{desc}</p>
    </div>
  );
}
