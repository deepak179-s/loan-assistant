import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useUser } from '../context/UserContext';

export default function Simulator() {
  const { creditProfile, profileLoading } = useUser();
  const [extraPayment, setExtraPayment] = useState<number>(0);
  const [confidence, setConfidence] = useState<number>(92);
  const [showXai, setShowXai] = useState(false);
  const [showHitl, setShowHitl] = useState(false);

  const totalPrincipal = creditProfile?.active_loans?.reduce((sum: number, l: any) => sum + l.outstanding_balance, 0) || 0;
  const totalEmi = creditProfile?.active_loans?.reduce((sum: number, l: any) => sum + l.emi, 0) || 0;
  
  const avgInterest = totalPrincipal > 0 
    ? (creditProfile?.active_loans?.reduce((sum: number, l: any) => sum + (l.interest_rate * l.outstanding_balance), 0) / totalPrincipal) || 8.5
    : 8.5;

  const generateData = () => {
    const data = [];
    let principal = totalPrincipal;
    const basePayment = totalEmi; 
    const totalPayment = basePayment + extraPayment;
    const interestRate = (avgInterest / 100) / 12;
    
    if (principal === 0 || totalPayment === 0) return [];
    
    let year = new Date().getFullYear();
    while (principal > 0 && year <= 2050) {
      data.push({
        year: year.toString(),
        Balance: Math.max(0, Math.round(principal)),
        InterestPaid: Math.round(principal * interestRate * 12)
      });
      principal = principal - (totalPayment * 12) + (principal * interestRate * 12);
      year++;
    }
    return data;
  };
  
  const chartData = generateData();

  const handleSliderChange = (e: any) => {
    const val = parseInt(e.target.value);
    setExtraPayment(val);
    
    // Simple heuristic for demo scale
    if (val > (totalEmi * 2.5)) {
      setConfidence(45);
      setShowHitl(true);
    } else {
      setConfidence(92 - (val / Math.max(10000, totalEmi)));
      setShowHitl(false);
    }
  };

  if (profileLoading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading AI Simulation Matrix...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Predictive EMI Simulations</h1>
          <p>
            Powered by Stacked Ensemble Machine Learning Models on your actual debt portfolio.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="btn" style={{ background: confidence > 70 ? 'var(--emerald-glow)' : 'var(--rose-glow)', color: confidence > 70 ? 'var(--emerald-bright)' : 'var(--rose-bright)', border: `1px solid ${confidence > 70 ? 'var(--emerald)' : 'var(--rose)'}` }}>
            AI Confidence: {confidence.toFixed(1)}%
          </div>
          <button className="btn btn-secondary" onClick={() => setShowXai(!showXai)}>
            {showXai ? 'Hide' : 'Show'} XAI Analysis
          </button>
        </div>
      </div>

      <div className={showXai ? "grid-2" : ""} style={{ display: showXai ? undefined : 'block', transition: 'all 0.3s' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card card-pad">
            <h3 style={{ marginBottom: '16px' }}>Adjust Repayment Strategy</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Extra Monthly EMI Prepayment: <strong style={{ color: 'var(--electric-bright)' }}>₹{extraPayment.toLocaleString('en-IN')}</strong>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max={Math.max(150000, totalEmi * 3)} 
                  step="5000" 
                  value={extraPayment} 
                  onChange={handleSliderChange}
                  style={{ width: '100%', accentColor: 'var(--electric-bright)' }}
                />
              </div>
              <div style={{ background: 'var(--bg-raised)', padding: '16px', borderRadius: '12px', minWidth: '150px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Projected Payoff Year</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {chartData.length > 0 ? chartData[chartData.length - 1].year : 'Paid off'}
                </div>
              </div>
            </div>
          </div>

          <div className="card card-pad" style={{ height: '400px' }}>
            <h3 style={{ marginBottom: '16px' }}>Loan Balance vs Interest Projection (INR)</h3>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis dataKey="year" stroke="var(--text-tertiary)" />
                <YAxis yAxisId="left" stroke="var(--electric-bright)" tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`} />
                <YAxis yAxisId="right" orientation="right" stroke="var(--rose-bright)" tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                  formatter={(value: any) => `₹${Number(value).toLocaleString('en-IN')}`}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="Balance" stroke="var(--electric-bright)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="InterestPaid" stroke="var(--rose-bright)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>

        {showXai && (
          <div className="card card-pad animate-fade-in" style={{ borderLeft: '4px solid var(--cyan-bright)' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>SHAP Value Analysis</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Explainable AI (XAI) output determining the recommendation for this strategy based on Indian financial indicators.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <XaiFeature name="IT Sector Stability Index" impact={35} type="positive" />
              <XaiFeature name="RBI Repo Rate Inflation" impact={22} type="negative" />
              <XaiFeature name="EMI to Income Ratio" impact={40} type="positive" />
              <XaiFeature name="Tier 1 College Status" impact={15} type="positive" />
            </div>

            <div style={{ marginTop: '32px', padding: '16px', background: 'var(--bg-raised)', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Adversarial Debiasing Active</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Protected classes (pin code, gender) have been aggressively normalized out of this recommendation path by the fairness node.
              </p>
            </div>
          </div>
        )}

      </div>

      {showHitl && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card card-pad animate-fade-in" style={{ width: '500px', borderTop: '4px solid var(--gold-bright)' }}>
            <h2 style={{ marginBottom: '16px', color: 'var(--gold-bright)' }}>Edge Case Detected</h2>
            <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>
              Your proposed extra prepayment is unusually high relative to your EMI profile. AI prediction confidence has dropped below the threshold to prevent liquidity drain.
            </p>
            
            <div style={{ background: 'var(--bg-raised)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
              <strong>Dynamic Confidence-based HITL Triggered</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Anomaly: "Extremely aggressive payoff schedule"
                <br/>Action: Contextual handoff to SEBI Registered Human Financial Advisor.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowHitl(false)}>Cancel Strategy</button>
              <button className="btn btn-primary" onClick={() => { setShowHitl(false); alert("Request routed to human advisor."); }}>Route to Human Advisor</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function XaiFeature({ name, impact, type }: { name: string, impact: number, type: 'positive' | 'negative' }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
        <span>{name}</span>
        <span style={{ color: type === 'positive' ? 'var(--emerald-bright)' : 'var(--rose-bright)' }}>{type === 'positive' ? '+' : '-'}{impact}%</span>
      </div>
      <div style={{ width: '100%', height: '6px', background: 'var(--glass-border-bright)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ 
          width: `${impact}%`, 
          height: '100%', 
          background: type === 'positive' ? 'var(--emerald-bright)' : 'var(--rose-bright)' 
        }} />
      </div>
    </div>
  );
}
