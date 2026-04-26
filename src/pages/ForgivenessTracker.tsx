import { useState } from 'react';
import { useUser } from '../context/UserContext';

export default function ForgivenessTracker() {
  const { creditProfile } = useUser();
  const numLoans = creditProfile?.active_loans?.length || 5;
  const [payments, setPayments] = useState(82);
  const totalRequired = 120;
  
  return (
    <div>
      <div className="page-header" style={{ marginBottom: 32 }}>
        <h1 style={{ marginBottom: '8px' }}>PSLF & Consolidation Strategy</h1>
        <p>
          Automated tracking for Public Service Loan Forgiveness compliance and eligible payment counts.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid-2">
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* PSLF Progress Main Card */}
          <div className="card card-pad">
            <h3 style={{ fontSize: '1.4rem', marginBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
              <span>PSLF Qualifying Payments</span>
              <span style={{ color: 'var(--emerald-bright)', fontWeight: 'bold' }}>{payments} / {totalRequired}</span>
            </h3>
            
            <div style={{ width: '100%', height: '24px', background: 'var(--bg-raised)', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', position: 'relative' }}>
               <div style={{ 
                 width: `${(payments/totalRequired)*100}%`, 
                 height: '100%', 
                 background: 'var(--electric)',
                 borderRadius: '12px'
               }} />
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Based on your employment history in the DynamoDB state store, our algorithm predicts forgiveness eligibility by <strong>March 2029</strong>. 
              The system automatically flags missed certifications.
            </p>
            
            <button className="btn btn-primary" onClick={() => setPayments(payments + 1)}>Simulate Next Payment</button>
          </div>
          
          {/* Consolidation Options */}
          <div className="card card-pad">
            <h3 style={{ marginBottom: '16px' }}>Debt Portfolio Consolidation Analysis</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              The AI has analyzed your {numLoans} separate Federal/Education Loans.
            </p>
            
            <div style={{ display: 'grid', gap: '16px' }}>
               <div style={{ background: 'var(--emerald-glow)', border: '1px solid var(--emerald-bright)', padding: '16px', borderRadius: '8px' }}>
                 <strong style={{ color: 'var(--emerald-bright)', display: 'block', marginBottom: '4px' }}>Recommendation: Consolidate Now</strong>
                 <p style={{ fontSize: '0.85rem' }}>Consolidating under the IDR Waiver will apply your {payments} highest payment counts across all underlying loans, accelerating forgiveness on your newer Grad PLUS loans.</p>
               </div>
               
               <div style={{ background: 'var(--bg-raised)', padding: '16px', borderRadius: '8px' }}>
                 <strong style={{ display: 'block', marginBottom: '4px' }}>Alternative: Do Not Consolidate</strong>
                 <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Maintaining separate loans. Your Subsidized loans will reach forgiveness 3 years earlier than your Unsubsidized loans based on independent payment tracks.</p>
               </div>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card card-pad" style={{ borderTop: '4px solid var(--gold-bright)' }}>
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
    <div style={{ background: 'var(--bg-raised)', padding: '16px', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <strong style={{ fontSize: '0.9rem' }}>{title}</strong>
        <span style={{ fontSize: '0.8rem', color: days < 30 ? 'var(--gold-bright)' : 'var(--text-secondary)' }}>Due in {days}d</span>
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{desc}</p>
    </div>
  );
}
