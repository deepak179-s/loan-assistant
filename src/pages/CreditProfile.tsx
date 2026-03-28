import { ShieldCheck, CreditCard, Landmark, LineChart, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useUser } from '../context/UserContext';

export default function CreditProfile() {
  const { activeUser } = useUser();
  const [creditData, setCreditData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeUser?.id) return;
    
    // Set up a real-time listener for the user's credit profile
    const unsub = onSnapshot(doc(db, "credit_profiles", activeUser.id), (docSnap) => {
      if (docSnap.exists()) {
        setCreditData(docSnap.data());
      } else {
        setCreditData(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching credit profile:", error);
      setLoading(false);
    });

    return () => unsub();
  }, [activeUser.id]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading live CIBIL data from secure network...</div>;
  }

  if (!creditData) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Profile Not Synced</h2>
        <p style={{ color: 'var(--text-muted)' }}>We do not have credit data for {activeUser.name}.</p>
      </div>
    );
  }

  // Calculate simple util
  const totalLimit = (creditData.credit_cards || []).reduce((acc: number, card: any) => acc + card.limit, 0);
  const totalUtil = (creditData.credit_cards || []).reduce((acc: number, card: any) => acc + card.utilized, 0);
  const utilPercent = totalLimit > 0 ? Math.round((totalUtil / totalLimit) * 100) : 0;

  return (
    <div className="animate-fade-in">
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
             <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)', lineHeight: 1 }}>{creditData.cibil_score}</div>
             <div style={{ fontSize: '0.8rem', color: creditData.risk_band === 'High Risk' ? 'var(--danger)' : 'var(--success)' }}>{creditData.risk_band}</div>
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
            {(!creditData.active_loans || creditData.active_loans.length === 0) && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No active loans found.</div>
            )}
            
            {creditData.active_loans?.map((loan: any, i: number) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '1.1rem' }}>{loan.lender}</strong>
                  <span style={{ color: loan.interest_rate > 10 ? 'var(--danger)' : 'var(--accent-primary)', fontWeight: 'bold' }}>
                    ₹{loan.outstanding_balance.toLocaleString('en-IN')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>Interest: {loan.interest_rate}% p.a.</span>
                  <span>EMI: ₹{loan.emi.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ marginTop: '12px', width: '100%', height: '6px', background: 'rgba(0,0,0,0.5)', borderRadius: '3px' }}>
                   <div style={{ width: loan.percent_repaid + '%', height: '100%', background: loan.interest_rate > 10 ? 'var(--warning)' : 'var(--accent-primary)', borderRadius: '3px' }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right' }}>{loan.percent_repaid}% Repaid</div>
              </div>
            ))}
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
              {(!creditData.credit_cards || creditData.credit_cards.length === 0) && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No active credit cards found.</div>
              )}

              {creditData.credit_cards?.map((card: any, i: number) => (
                <div key={i} style={{ borderLeft: '3px solid ' + (i % 2 === 0 ? 'var(--accent-tertiary)' : 'var(--success)'), paddingLeft: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{card.issuer}</strong>
                    <span>₹{card.utilized.toLocaleString('en-IN')} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ ₹{card.limit.toLocaleString('en-IN')}</span></span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Next Bill: {card.next_bill}</div>
                </div>
              ))}
            </div>
            
            {totalLimit > 0 && (
              <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <LineChart color="var(--accent-primary)" />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Total Credit Utilization: {utilPercent}%</div>
                  <div style={{ fontSize: '0.8rem', color: utilPercent > 30 ? 'var(--warning)' : 'var(--success)' }}>
                    {utilPercent > 30 ? 'High - Try keeping below 30% to improve CIBIL.' : 'Excellent - Keeping below 30% improves CIBIL.'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {(creditData.active_loans || []).some((l: any) => l.interest_rate > 10) && (
            <div className="glass-panel" style={{ padding: '24px', background: 'rgba(247, 118, 142, 0.05)', border: '1px solid var(--danger)' }}>
               <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)' }}>
                 <AlertTriangle size={18} /> Deep Insights Risk Alert
               </h3>
               <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                 Warning: You have loans with high interest rates (&gt; 10%). The AI Debt Optimizer recommends transferring this balance or paying it off aggressively to avoid debt traps.
               </p>
               <button className="btn btn-secondary" style={{ marginTop: '16px', fontSize: '0.85rem' }}>Ask Optimizer Agent</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
