import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  TrendingDown, ArrowRight, Zap, Shield,
  CreditCard, Activity, Target, AlertTriangle
} from 'lucide-react';
import { useUser } from '../context/UserContext';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-raised)',
        border: '1px solid var(--glass-border-bright)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        fontSize: '0.82rem',
        boxShadow: 'var(--glass-shadow)'
      }}>
        <div style={{ color: 'var(--text-tertiary)', marginBottom: 4, fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>{label}</div>
        <div style={{ color: 'var(--electric-bright)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
          ₹{Number(payload[0].value).toLocaleString('en-IN')}
        </div>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { creditProfile, profileLoading, activeUser } = useUser();

  const totalPrincipal = creditProfile?.active_loans?.reduce(
    (sum: number, l: any) => sum + l.outstanding_balance, 0
  ) || 0;
  const totalEmi = creditProfile?.active_loans?.reduce(
    (sum: number, l: any) => sum + l.emi, 0
  ) || 0;
  const cibil = creditProfile?.cibil_score || 0;
  const avgInterest = totalPrincipal > 0
    ? (creditProfile?.active_loans?.reduce(
      (sum: number, l: any) => sum + (l.interest_rate * l.outstanding_balance), 0
    ) / totalPrincipal) || 8.5
    : 8.5;

  const generateChartData = () => {
    const data: any[] = [];
    let principal = totalPrincipal;
    const interestRate = (avgInterest / 100) / 12;
    let year = new Date().getFullYear();
    while (principal > 0 && year <= 2045) {
      data.push({ name: year.toString(), Balance: Math.max(0, Math.round(principal)) });
      principal = principal - (totalEmi * 12) + (principal * interestRate * 12);
      year++;
    }
    return data;
  };

  const chartData = generateChartData();
  const payoffYear = chartData.length > 0 ? chartData[chartData.length - 1].name : 'N/A';

  const cibilScore = cibil;
  const cibilColor = cibilScore >= 750 ? 'var(--emerald-bright)' : cibilScore >= 650 ? 'var(--gold-bright)' : 'var(--rose-bright)';
  const cibilBg = cibilScore >= 750 ? 'var(--emerald-glow)' : cibilScore >= 650 ? 'var(--gold-glow)' : 'var(--rose-glow)';
  const cibilLabel = cibilScore >= 750 ? 'Excellent' : cibilScore >= 650 ? 'Fair' : 'Needs Work';

  // Pie data for debt distribution
  const pieData = creditProfile?.active_loans?.map((l: any) => ({
    name: l.lender,
    value: l.outstanding_balance
  })) || [];
  const PIE_COLORS = ['var(--electric)', 'var(--gold)', 'var(--cyan)', 'var(--emerald)'];

  if (profileLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="page-header">
          <div className="skeleton" style={{ height: 32, width: 260, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 18, width: 380 }} />
        </div>
        <div className="grid-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="stat-card">
              <div className="skeleton" style={{ height: 14, width: 100, marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 40, width: 160, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 14, width: 120 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── Header ── */}
      <div className="page-header animate-fade-up">
        <h1>
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},&nbsp;
          {activeUser.name.split(' ')[0]} 👋
        </h1>
        <p>AI-powered insights synced from your live CIBIL profile · Last updated just now</p>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid-4">
        {/* Total Debt */}
        <div className="stat-card card-glow-rose animate-fade-up animate-fade-up-delay-1">
          <div
            className="stat-card-bg"
            style={{ background: 'var(--rose)' }}
          />
          <div className="stat-label">
            <TrendingDown size={13} /> Total Debt
          </div>
          <div className="stat-value rose">
            ₹{(totalPrincipal / 100000).toFixed(1)}L
          </div>
          <div className="stat-meta">
            <span className="stat-tag down">{avgInterest.toFixed(1)}% avg APR</span>
          </div>
        </div>

        {/* Monthly EMI */}
        <div className="stat-card card-glow-gold animate-fade-up animate-fade-up-delay-2">
          <div className="stat-card-bg" style={{ background: 'var(--gold)' }} />
          <div className="stat-label">
            <Activity size={13} /> Monthly EMI
          </div>
          <div className="stat-value gold">
            ₹{totalEmi.toLocaleString('en-IN')}
          </div>
          <div className="stat-meta">
            <span className="stat-tag neutral">{creditProfile?.active_loans?.length || 0} loans</span>
          </div>
        </div>

        {/* Payoff Year */}
        <div className="stat-card card-glow-electric animate-fade-up animate-fade-up-delay-3">
          <div className="stat-card-bg" style={{ background: 'var(--electric)' }} />
          <div className="stat-label">
            <Target size={13} /> Debt Free By
          </div>
          <div className="stat-value electric">{payoffYear}</div>
          <div className="stat-meta">
            <span className="stat-tag up">Optimized path</span>
          </div>
        </div>

        {/* CIBIL Score */}
        <div className="stat-card card-glow-emerald animate-fade-up animate-fade-up-delay-4">
          <div className="stat-card-bg" style={{ background: 'var(--emerald)' }} />
          <div className="stat-label">
            <Shield size={13} /> CIBIL Score
          </div>
          <div className="stat-value" style={{ color: cibilColor }}>
            {cibil || '—'}
          </div>
          <div className="stat-meta">
            <span
              className="stat-tag"
              style={{
                background: cibilBg,
                color: cibilColor,
                border: `1px solid ${cibilColor}33`
              }}
            >
              {cibilLabel}
            </span>
          </div>
        </div>
      </div>

      {/* ── Charts Row ── */}
      <div className="grid-2">

        {/* Repayment Trajectory */}
        <div className="card card-pad animate-fade-up animate-fade-up-delay-2">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div className="section-title" style={{ marginBottom: 0 }}>
              <div
                className="section-title-icon"
                style={{ background: 'var(--electric-subtle)' }}
              >
                <TrendingDown size={14} color="var(--electric-bright)" />
              </div>
              Debt Trajectory
            </div>
            <Link to="/simulator" className="btn btn-secondary btn-sm">
              Simulate <ArrowRight size={13} />
            </Link>
          </div>

          <div style={{ height: 220, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="debtGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--electric)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--electric)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke="var(--text-tertiary)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  fontFamily="var(--font-mono)"
                />
                <YAxis
                  stroke="var(--text-tertiary)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                  fontFamily="var(--font-mono)"
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="Balance"
                  stroke="var(--electric-bright)"
                  strokeWidth={2}
                  fill="url(#debtGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: 'var(--electric-bright)', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Debt Distribution Pie */}
          {pieData.length > 0 && (
            <div className="card card-pad animate-fade-up animate-fade-up-delay-3">
              <div className="section-title">
                <div className="section-title-icon" style={{ background: 'var(--gold-subtle)' }}>
                  <CreditCard size={14} color="var(--gold-bright)" />
                </div>
                Debt Distribution
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 100, height: 100, flexShrink: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={46}
                        strokeWidth={0}
                        dataKey="value"
                      >
                        {pieData.map((_: any, index: number) => (
                          <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {pieData.map((item: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: PIE_COLORS[idx % PIE_COLORS.length],
                        flexShrink: 0
                      }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '0.75rem', color: 'var(--text-secondary)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>
                          {item.name.replace(' Loan', '').replace(' Personal', '')}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '0.72rem', color: 'var(--text-tertiary)',
                        fontFamily: 'var(--font-mono)', flexShrink: 0
                      }}>
                        ₹{(item.value / 100000).toFixed(1)}L
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI Action Card */}
          <div className="card animate-fade-up animate-fade-up-delay-4" style={{
            padding: 24,
            background: 'var(--electric-glow)',
            borderColor: 'var(--electric)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Zap size={16} color="var(--electric-bright)" />
              <span style={{
                fontSize: '0.82rem', fontWeight: 600,
                color: 'var(--electric-bright)',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}>
                AI Recommendation
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
              Claim <strong style={{ color: 'var(--gold-bright)' }}>Section 80E</strong> tax deduction — estimated savings of ₹45,000 in your 30% slab.
            </p>
            <Link to="/agents" className="btn btn-primary btn-sm">
              Ask AI Agent <ArrowRight size={13} />
            </Link>
          </div>

          {/* Alert */}
          {cibil < 750 && cibil > 0 && (
            <div className="alert alert-warning animate-fade-up animate-fade-up-delay-4">
              <AlertTriangle size={16} className="alert-icon" />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--gold-bright)', marginBottom: 4, fontSize: '0.82rem' }}>
                  Score Improvement Available
                </div>
                <div style={{ fontSize: '0.8rem' }}>
                  Keep credit utilization below 30% to boost score within 45 days.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Active Loans Quick View ── */}
      {creditProfile?.active_loans && creditProfile.active_loans.length > 0 && (
        <div className="card card-pad animate-fade-up animate-fade-up-delay-3">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div className="section-title" style={{ marginBottom: 0 }}>
              <div className="section-title-icon" style={{ background: 'var(--electric-subtle)' }}>
                <Activity size={14} color="var(--electric-bright)" />
              </div>
              Active Loans Snapshot
            </div>
            <Link to="/credit" className="btn btn-ghost btn-sm">
              Full Profile <ArrowRight size={13} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {creditProfile.active_loans.map((loan: any, i: number) => {
              const pct = loan.percent_repaid;
              const colors = ['var(--electric)', 'var(--gold)', 'var(--cyan)'];
              const color = colors[i % colors.length];
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center' }}>
                  <div>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      marginBottom: 6
                    }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {loan.lender}
                      </span>
                      <span style={{
                        fontSize: '0.72rem', color: 'var(--text-tertiary)',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        {pct}% paid
                      </span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${color}88, ${color})`
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{
                      fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-display)',
                      color: loan.interest_rate > 10 ? 'var(--rose-bright)' : 'var(--text-primary)',
                      letterSpacing: '-0.02em'
                    }}>
                      ₹{(loan.outstanding_balance / 100000).toFixed(1)}L
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                      {loan.interest_rate}% p.a.
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}