import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

/* Dashboard Component */
export default function Dashboard() {
  const generateChartData = () => {
    const data = [];
    let principal = 3670000;
    const totalPayment = 38400;
    const interestRate = 0.088 / 12;
    for (let year = 2024; year <= 2038; year++) {
      if (principal <= 0) break;
      data.push({ name: year.toString(), Balance: Math.max(0, Math.round(principal)) });
      principal = principal - (totalPayment * 12) + (principal * interestRate * 12);
    }
    return data;
  };
  const chartData = generateChartData();

  return (
    <div>
      <h1 className="text-gradient">Financial Overview</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1.1rem' }}>
        AI-powered insights based on your CIBIL profile and macroeconomic risk factors.
      </p>
      
      {/* Top Value Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Total Outstanding Debt</h4>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>₹36,70,000</h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--danger)', background: 'rgba(247, 118, 142, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>8.8% APY</span>
            <span style={{ color: 'var(--text-muted)' }}>Avg Interest</span>
          </div>
        </div>
        
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Projected Payoff Date</h4>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Oct 2038</h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--success)', background: 'rgba(158, 206, 106, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>-2 Years</span>
            <span style={{ color: 'var(--text-muted)' }}>vs Standard Plan</span>
          </div>
        </div>
        
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>CIBIL / Risk Score</h4>
          <h2 className="text-gradient-alt" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>784 (Low)</h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Powered by AI Ensembles</span>
            <Link to="/simulator" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Analysis</Link>
          </div>
        </div>
      </div>
      
      <div className="grid-2">
        <div className="glass-panel" style={{ padding: '24px', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Repayment Trajectory (Predictive)</h3>
            <Link to="/simulator" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px', textDecoration: 'none' }}>Run Simulation</Link>
          </div>
          <div style={{ flex: 1, width: '100%', minHeight: '300px', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${(value/100000).toFixed(0)}L`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--accent-primary)' }}
                  formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                />
                <Area type="monotone" dataKey="Balance" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>AI Recommended Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(187, 154, 247, 0.1)', borderLeft: '4px solid var(--accent-tertiary)', padding: '16px', borderRadius: '0 8px 8px 0' }}>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Claim Section 80E Rebate</strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Save approximately ₹45,000 in your 30% tax slab by filing your ITR with the bank's interest certificate.</p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link to="/restructuring" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', textDecoration: 'none' }}>Review Options</Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-panel" style={{ padding: '24px', background: 'var(--gradient-primary)', color: 'white' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Need Guidance?</h3>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', marginBottom: '16px' }}>
              Our specialized AI agents can help you optimize education loans, plan Mutual Funds, and strategize PPF.
            </p>
            <Link to="/agents" className="btn" style={{ width: '100%', background: 'white', color: 'var(--accent-primary)', fontWeight: 'bold', border: 'none' }}>Consult Multi-Agent Team</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
