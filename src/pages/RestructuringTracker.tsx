import { useState } from 'react';

export default function RestructuringTracker() {
  const [csisMonths] = useState(12);
  const totalMoratorium = 12; // 1 year after course
  
  return (
    <div>
      <h1 className="text-gradient" style={{ marginBottom: '8px' }}>Subsidies & Restructuring</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '32px' }}>
        Track Central Scheme of Interest Subsidy (CSIS) eligibility, EMI moratorium periods, and refinancing opportunities.
      </p>

      <div className="grid-2">
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* CSIS Tracker */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span>CSIS Interest Subsidy Tracker</span>
              <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>Active</span>
            </h3>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Under the Ministry of Education scheme, full interest subsidy is provided during the moratorium period (course period + 1 year). 
              Government has paid ₹1,45,000 in interest on your behalf so far.
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span>Moratorium Remaining</span>
              <span>{totalMoratorium - csisMonths} Months Left</span>
            </div>
            <div style={{ width: '100%', height: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
               <div style={{ 
                 width: `${(csisMonths/totalMoratorium)*100}%`, 
                 height: '100%', 
                 background: csisMonths >= totalMoratorium ? 'var(--danger)' : 'var(--gradient-primary)',
                 borderRadius: '8px'
               }} />
            </div>
            
            <div style={{ background: 'rgba(255,158,100,0.1)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--accent-secondary)' }}>
              <strong>Important Notice</strong>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>EMI payments of ₹38,400 will commence starting next month as your moratorium expires. Ensure your auto-debit mandate is active.</p>
            </div>
          </div>
          
          {/* Refinancing Options */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>Loan Restructuring & Refinancing</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Our AI has analyzed public and private sector bank rates to find optimized refinancing.
            </p>
            
            <div style={{ display: 'grid', gap: '16px' }}>
               <div style={{ background: 'rgba(158, 206, 106, 0.1)', border: '1px solid var(--success)', padding: '16px', borderRadius: '8px' }}>
                 <strong style={{ color: 'var(--success)', display: 'block', marginBottom: '4px' }}>Recommendation: Balance Transfer to Bank of Baroda</strong>
                 <p style={{ fontSize: '0.85rem' }}>BoB is offering 7.85% p.a for candidates from Premier Institutes (IIM/IIT/NIT). Switching from your current 8.5% SBI rate will save you ₹2,10,000 over the tenure.</p>
               </div>
               
               <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '8px' }}>
                 <strong style={{ display: 'block', marginBottom: '4px' }}>Alternative: Section 80E Tax Deduction Optimization</strong>
                 <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Instead of prepaying the principal, use the Section 80E Income Tax deduction on interest paid for 8 straight years to maximize total tax savings in the 30% slab rate.</p>
               </div>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--accent-secondary)' }}>
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
    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <strong style={{ fontSize: '0.9rem' }}>{title}</strong>
        <span style={{ fontSize: '0.8rem', color: days < 30 ? 'var(--warning)' : 'var(--text-muted)' }}>Due in {days}d</span>
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{desc}</p>
    </div>
  );
}
