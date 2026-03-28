import { useState } from 'react';

export default function ForgivenessTracker() {
  const [payments, setPayments] = useState(82);
  const totalRequired = 120;
  
  return (
    <div>
      <h1 className="text-gradient" style={{ marginBottom: '8px' }}>PSLF & Consolidation Strategy</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '32px' }}>
        Automated tracking for Public Service Loan Forgiveness compliance and eligible payment counts.
      </p>

      {/* Main Layout Grid */}
      <div className="grid-2">
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* PSLF Progress Main Card */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
              <span>PSLF Qualifying Payments</span>
              <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>{payments} / {totalRequired}</span>
            </h3>
            
            <div style={{ width: '100%', height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', position: 'relative' }}>
               <div style={{ 
                 width: `${(payments/totalRequired)*100}%`, 
                 height: '100%', 
                 background: 'var(--gradient-primary)',
                 borderRadius: '12px'
               }} />
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Based on your employment history in the DynamoDB state store, our algorithm predicts forgiveness eligibility by <strong>March 2029</strong>. 
              The system automatically flags missed certifications.
            </p>
            
            <button className="btn btn-primary" onClick={() => setPayments(payments + 1)}>Simulate Next Payment</button>
          </div>
          
          {/* Consolidation Options */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>Debt Portfolio Consolidation Analysis</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              The AI has analyzed your 5 separate Federal Direct Loans.
            </p>
            
            <div style={{ display: 'grid', gap: '16px' }}>
               <div style={{ background: 'rgba(158, 206, 106, 0.1)', border: '1px solid var(--success)', padding: '16px', borderRadius: '8px' }}>
                 <strong style={{ color: 'var(--success)', display: 'block', marginBottom: '4px' }}>Recommendation: Consolidate Now</strong>
                 <p style={{ fontSize: '0.85rem' }}>Consolidating under the IDR Waiver will apply your {payments} highest payment counts across all underlying loans, accelerating forgiveness on your newer Grad PLUS loans.</p>
               </div>
               
               <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '8px' }}>
                 <strong style={{ display: 'block', marginBottom: '4px' }}>Alternative: Do Not Consolidate</strong>
                 <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Maintaining separate loans. Your Subsidized loans will reach forgiveness 3 years earlier than your Unsubsidized loans based on independent payment tracks.</p>
               </div>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--accent-secondary)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Compliance Alerts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <AlertItem 
                title="Employer Cert Expiring" 
                desc="Your employment certification for ACME Non-Profit needs renewal."
                days={14}
              />
              <AlertItem 
                title="Income Recertification" 
                desc="Your IDR payment plan needs updated tax details."
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
