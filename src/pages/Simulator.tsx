import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Simulator() {
  const [extraPayment, setExtraPayment] = useState<number>(0);
  const [confidence, setConfidence] = useState<number>(92);
  const [showXai, setShowXai] = useState(false);
  const [showHitl, setShowHitl] = useState(false);

  // Generate mock projection data based on extra payment
  const generateData = () => {
    const data = [];
    let principal = 3500000;
    const basePayment = 38400; // Original EMI
    const totalPayment = basePayment + extraPayment;
    const interestRate = 0.085 / 12; // 8.5%
    
    for (let year = 2024; year <= 2040; year++) {
      if (principal <= 0) break;
      data.push({
        year: year.toString(),
        Balance: Math.max(0, Math.round(principal)),
        InterestPaid: Math.round(principal * interestRate * 12)
      });
      principal = principal - (totalPayment * 12) + (principal * interestRate * 12);
    }
    return data;
  };
  
  const chartData = generateData();

  const handleSliderChange = (e: any) => {
    const val = parseInt(e.target.value);
    setExtraPayment(val);
    
    if (val > 100000) {
      setConfidence(45);
      setShowHitl(true);
    } else {
      setConfidence(92 - (val / 10000));
      setShowHitl(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="text-gradient">Predictive EMI Simulations</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Powered by Stacked Ensemble Machine Learning Models (India Market).
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="btn" style={{ background: confidence > 70 ? 'rgba(158, 206, 106, 0.1)' : 'rgba(247, 118, 142, 0.1)', color: confidence > 70 ? 'var(--success)' : 'var(--danger)', border: `1px solid ${confidence > 70 ? 'var(--success)' : 'var(--danger)'}` }}>
            AI Confidence: {confidence.toFixed(1)}%
          </div>
          <button className="btn btn-secondary" onClick={() => setShowXai(!showXai)}>
            {showXai ? 'Hide' : 'Show'} XAI Analysis
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: showXai ? '2fr 1fr' : '1fr', gap: '24px', transition: 'all 0.3s' }}>
        
        {/* Simulator Core */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>Adjust Repayment Strategy</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Extra Monthly EMI Prepayment: <strong style={{ color: 'var(--accent-primary)' }}>₹{extraPayment.toLocaleString('en-IN')}</strong>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="150000" 
                  step="5000" 
                  value={extraPayment} 
                  onChange={handleSliderChange}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', minWidth: '150px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Projected Payoff Year</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {chartData.length > 0 ? chartData[chartData.length - 1].year : 'Paid off'}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', height: '400px' }}>
            <h3 style={{ marginBottom: '16px' }}>Loan Balance vs Interest Projection (INR)</h3>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" stroke="var(--text-muted)" />
                <YAxis yAxisId="left" stroke="var(--accent-primary)" tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`} />
                <YAxis yAxisId="right" orientation="right" stroke="var(--danger)" tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                  formatter={(value: any) => `₹${Number(value).toLocaleString('en-IN')}`}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="Balance" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="InterestPaid" stroke="var(--danger)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* XAI Panel */}
        {showXai && (
          <div className="glass-panel animate-fade-in" style={{ padding: '24px', borderLeft: '4px solid var(--accent-tertiary)' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="text-gradient">SHAP Value Analysis</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Explainable AI (XAI) output determining the recommendation for this strategy based on Indian financial indicators.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <XaiFeature name="IT Sector Stability Index" impact={35} type="positive" />
              <XaiFeature name="RBI Repo Rate Inflation" impact={22} type="negative" />
              <XaiFeature name="EMI to Income Ratio" impact={40} type="positive" />
              <XaiFeature name="Tier 1 College (IIT/NIT) Status" impact={15} type="positive" />
            </div>

            <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Adversarial Debiasing Active</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Protected classes (pin code, gender) have been aggressively normalized out of this recommendation path by the fairness node.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* HITL Routing Modal */}
      {showHitl && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '500px', padding: '32px', borderTop: '4px solid var(--warning)' }}>
            <h2 style={{ marginBottom: '16px', color: 'var(--warning)' }}>Edge Case Detected</h2>
            <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>
              Your proposed extra prepayment is unusually high (over ₹1,00,000 extra) compared to typical Tier 1 city variance models. AI prediction confidence has dropped below the 50% threshold to prevent liquidity drain.
            </p>
            
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
              <strong>Dynamic Confidence-based HITL Triggered</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                Anomaly: "Extremely aggressive payoff schedule"
                <br/>Action: Contextual handoff to SEBI Registered Human Financial Advisor.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowHitl(false)}>Cancel Strategy</button>
              <button className="btn btn-primary" onClick={() => { setShowHitl(false); alert("Request routed to human advisor. They have full context via DynamoDB session state."); }}>Route to Human Advisor</button>
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
        <span style={{ color: type === 'positive' ? 'var(--success)' : 'var(--danger)' }}>{type === 'positive' ? '+' : '-'}{impact}%</span>
      </div>
      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ 
          width: `${impact}%`, 
          height: '100%', 
          background: type === 'positive' ? 'var(--success)' : 'var(--danger)' 
        }} />
      </div>
    </div>
  );
}
