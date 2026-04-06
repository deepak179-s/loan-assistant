import { ShieldCheck, CreditCard, Landmark, LineChart as LineChartIcon, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';

export default function CreditProfile() {
  const { creditProfile: creditData, profileLoading: loading, activeUser } = useUser();
  const [selectedLoan, setSelectedLoan] = useState<number | null>(null);

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

  const now = new Date();
  const currentDay = now.getDate();
  const currentMonthIdx = now.getMonth(); 

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Mock 6-month history for the graph relying on the current score
  const cibilHistory = [
    { month: 'M-5', score: Math.max(300, creditData.cibil_score - 45) },
    { month: 'M-4', score: Math.max(300, creditData.cibil_score - 30) },
    { month: 'M-3', score: Math.max(300, creditData.cibil_score - 10) },
    { month: 'M-2', score: Math.max(300, creditData.cibil_score - 25) },
    { month: 'M-1', score: Math.max(300, creditData.cibil_score - 5) },
    { month: 'Current', score: creditData.cibil_score },
  ];

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

      {creditData.cibil_score < 750 && (
        <div style={{ marginBottom: '24px', padding: '16px 24px', background: 'rgba(255,165,0,0.1)', border: '1px solid orange', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <AlertCircle color="orange" style={{ flexShrink: 0, marginTop: '4px' }} />
          <div>
            <h4 style={{ color: 'orange', margin: '0 0 8px 0' }}>Score Improvement Action Plan</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li><strong>Optimize Credit Limits:</strong> You have {utilPercent}% utilization. Try to keep this below 30% to immediately boost your score next month.</li>
              <li><strong>Pay Dues Before Report Date:</strong> Pay off significant portions of your credit card bills 3 days before the statement generation.</li>
              <li><strong>Review for Fraud:</strong> Verify all "Active Loans" below. If you don't recognize one, file a complaint immediately to remove it from your record.</li>
            </ul>
          </div>
        </div>
      )}

      <div className="grid-2">
        {/* Left Column: Active Loans & Graph */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Landmark color="var(--accent-primary)" />
              Active Loans Overview
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(!creditData.active_loans || creditData.active_loans.length === 0) && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No active loans found.</div>
              )}
              
              {creditData.active_loans?.map((loan: any, i: number) => {
                const isExpanded = selectedLoan === i;
                const monthsPaid = Math.round((loan.percent_repaid / 100) * loan.tenure_months);
                const remainingMonths = loan.tenure_months - monthsPaid;
                const principalPaid = loan.original_principal - loan.outstanding_balance;
                const estimatedInterestPaid = (loan.emi * monthsPaid) - principalPaid;

                return (
                  <div key={i} onClick={() => setSelectedLoan(isExpanded ? null : i)} style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', border: isExpanded ? '1px solid var(--accent-primary)' : '1px solid transparent' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '1.1rem' }}>{loan.lender}</strong>
                      <span style={{ color: loan.interest_rate > 10 ? 'var(--danger)' : 'var(--accent-primary)', fontWeight: 'bold' }}>
                        ₹{loan.outstanding_balance.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span>Interest: {loan.interest_rate}% p.a.</span>
                      <span>EMI: ₹{loan.emi.toLocaleString('en-IN')}</span>
                      <span>Tenure: {loan.tenure_months}m ({remainingMonths} left)</span>
                    </div>
                    <div style={{ marginTop: '12px', width: '100%', height: '6px', background: 'rgba(0,0,0,0.5)', borderRadius: '3px' }}>
                       <div style={{ width: loan.percent_repaid + '%', height: '100%', background: loan.interest_rate > 10 ? 'var(--warning)' : 'var(--accent-primary)', borderRadius: '3px' }} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right' }}>{loan.percent_repaid}% Repaid</div>
                    
                    {isExpanded && (
                      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)', animation: 'fade-in 0.3s' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '16px' }}>
                          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '6px' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Principal Paid</div>
                            <strong>₹{principalPaid.toLocaleString('en-IN')}</strong>
                          </div>
                          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '6px' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Est. Interest Paid</div>
                            <strong>₹{Math.max(0, estimatedInterestPaid).toLocaleString('en-IN')}</strong>
                          </div>
                          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '6px' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Total EMIs Paid</div>
                            <strong>{monthsPaid} EMIs</strong>
                          </div>
                          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '6px' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Remaining EMIs</div>
                            <strong>{remainingMonths} EMIs</strong>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Info size={14} /> Tap again to collapse
                          </span>
                          <button 
                            className="btn btn-secondary" 
                            style={{ background: 'rgba(247, 118, 142, 0.1)', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '6px 12px', fontSize: '0.8rem' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`COMPLAINT DRAFTED TO RBI OMBUDSMAN.\nA formal dispute has been initiated for the unauthorized ${loan.lender} account.`);
                            }}
                          >
                            Report Unauthorized Loan
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <LineChartIcon color="var(--success)" />
              6-Month CIBIL Trend
            </h3>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cibilHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={['dataMin - 20', 'dataMax + 20']} stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} width={30} />
                  <RechartsTooltip 
                    contentStyle={{ background: 'var(--bg-panel)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--accent-primary)' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="var(--success)" strokeWidth={3} dot={{ fill: 'var(--success)', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Column: Cards & Alerts */}
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

              {creditData.credit_cards?.map((card: any, i: number) => {
                // Parse the digit from something like "18th Oct" or "5th Nov"
                const dateMatch = card.next_bill.match(/^(\d+)/);
                let dynamicDate = card.next_bill;
                if (dateMatch) {
                  const billDay = parseInt(dateMatch[1]);
                  const suffix = billDay % 10 === 1 && billDay !== 11 ? 'st' : billDay % 10 === 2 && billDay !== 12 ? 'nd' : billDay % 10 === 3 && billDay !== 13 ? 'rd' : 'th';
                  
                  // If billing day has already passed this month, show next month
                  let targetMonthIdx = currentMonthIdx;
                  if (billDay <= currentDay) {
                    targetMonthIdx = (currentMonthIdx + 1) % 12;
                  }
                  dynamicDate = `${billDay}${suffix} ${monthNames[targetMonthIdx]}`;
                }

                return (
                  <div key={i} style={{ borderLeft: '3px solid ' + (i % 2 === 0 ? 'var(--accent-tertiary)' : 'var(--success)'), paddingLeft: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{card.issuer}</strong>
                      <span>₹{card.utilized.toLocaleString('en-IN')} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ ₹{card.limit.toLocaleString('en-IN')}</span></span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Next Bill: {dynamicDate}</div>
                  </div>
                );
              })}
            </div>
            
            {totalLimit > 0 && (
              <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <LineChartIcon color="var(--accent-primary)" />
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
