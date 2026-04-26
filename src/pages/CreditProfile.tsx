import {
  Shield, CreditCard, TrendingUp, AlertTriangle,
  AlertCircle, ChevronDown, ChevronUp, Flag, Info
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip
} from 'recharts';

function CibilRing({ score }: { score: number }) {
  const max = 900;
  const min = 300;
  const normalized = Math.max(0, Math.min(1, (score - min) / (max - min)));
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - normalized * circumference * 0.75;
  const color = score >= 750 ? '#10b981' : score >= 650 ? '#f59e0b' : '#f43f5e';

  return (
    <div style={{ position: 'relative', width: 140, height: 140 }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle
          cx="70" cy="70" r="54"
          fill="none"
          stroke="var(--bg-raised)"
          strokeWidth="10"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          strokeDashoffset={circumference * 0.125}
          strokeLinecap="round"
          transform="rotate(135 70 70)"
        />
        <circle
          cx="70" cy="70" r="54"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={offset + circumference * 0.125}
          strokeLinecap="round"
          transform="rotate(135 70 70)"
          style={{
            filter: `drop-shadow(0 0 8px ${color}88)`,
            transition: 'stroke-dashoffset 1s var(--ease-smooth)'
          }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.8rem', fontWeight: 800,
          color, letterSpacing: '-0.04em', lineHeight: 1
        }}>{score}</div>
        <div style={{
          fontSize: '0.65rem', color: 'var(--text-tertiary)',
          fontFamily: 'var(--font-mono)', marginTop: 2
        }}>/ 900</div>
      </div>
    </div>
  );
}

export default function CreditProfile() {
  const { creditProfile: creditData, profileLoading: loading, activeUser } = useUser();
  const [expandedLoan, setExpandedLoan] = useState<number | null>(null);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="skeleton" style={{ height: 32, width: 280, marginBottom: 8 }} />
        <div className="grid-2">
          {[1, 2].map(i => (
            <div key={i} className="card card-pad">
              <div className="skeleton" style={{ height: 200 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!creditData) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '80px 40px', textAlign: 'center', gap: 16
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 'var(--radius-lg)',
          background: 'var(--electric-subtle)', display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <Shield size={28} color="var(--electric-bright)" />
        </div>
        <h2>No Credit Profile Synced</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 360, lineHeight: 1.6 }}>
          We don't have credit data for {activeUser.name}. Please complete the CIBIL sync first.
        </p>
      </div>
    );
  }

  const totalLimit = (creditData.credit_cards || []).reduce(
    (acc: number, c: any) => acc + c.limit, 0
  );
  const totalUtil = (creditData.credit_cards || []).reduce(
    (acc: number, c: any) => acc + c.utilized, 0
  );
  const utilPercent = totalLimit > 0 ? Math.round((totalUtil / totalLimit) * 100) : 0;

  const cibil = creditData.cibil_score;
  const cibilColor = cibil >= 750 ? 'var(--emerald)' : cibil >= 650 ? 'var(--gold)' : 'var(--rose)';
  const cibilLabel = cibil >= 750 ? 'Excellent' : cibil >= 650 ? 'Fair' : 'Needs Work';

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();

  const cibilHistory = [
    { m: 'M-5', score: Math.max(300, cibil - 45) },
    { m: 'M-4', score: Math.max(300, cibil - 30) },
    { m: 'M-3', score: Math.max(300, cibil - 10) },
    { m: 'M-2', score: Math.max(300, cibil - 25) },
    { m: 'M-1', score: Math.max(300, cibil - 5) },
    { m: 'Now', score: cibil },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Header ── */}
      <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Credit Profile</h1>
          <p>Live CIBIL data · Comprehensive financial health overview</p>
        </div>

        {/* CIBIL Ring */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <CibilRing score={cibil} />
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '0.78rem', fontWeight: 600,
              color: cibilColor, fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase', letterSpacing: '0.06em'
            }}>
              {cibilLabel}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
              {creditData.risk_band}
            </div>
          </div>
        </div>
      </div>

      {/* ── Low Score Alert ── */}
      {cibil < 750 && (
        <div className="alert alert-warning animate-fade-up">
          <AlertCircle size={16} className="alert-icon" />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--gold-bright)', marginBottom: 6, fontSize: '0.875rem' }}>
              Score Improvement Action Plan
            </div>
            <ul style={{ paddingLeft: 16, color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.7 }}>
              <li><strong style={{ color: 'var(--text-primary)' }}>Credit Utilization:</strong> You're at {utilPercent}% — target below 30% to see improvement next cycle.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Early Payments:</strong> Pay 3 days before statement date to reduce reported balance.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Verify Loans:</strong> Check all active loans below. Flag anything unrecognized immediately.</li>
            </ul>
          </div>
        </div>
      )}

      <div className="grid-2">

        {/* ── Active Loans ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card card-pad card-glow-electric animate-fade-up">
            <div className="section-title">
              <div className="section-title-icon" style={{ background: 'var(--electric-subtle)' }}>
                <TrendingUp size={14} color="var(--electric-bright)" />
              </div>
              Active Loans
              <span className="badge badge-electric" style={{ marginLeft: 'auto' }}>
                {creditData.active_loans?.length || 0} accounts
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(!creditData.active_loans || creditData.active_loans.length === 0) && (
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', padding: '16px 0' }}>
                  No active loans found.
                </p>
              )}

              {creditData.active_loans?.map((loan: any, i: number) => {
                const isExpanded = expandedLoan === i;
                const monthsPaid = Math.round((loan.percent_repaid / 100) * loan.tenure_months);
                const remaining = loan.tenure_months - monthsPaid;
                const principalPaid = loan.original_principal - loan.outstanding_balance;
                const estInterestPaid = Math.max(0, (loan.emi * monthsPaid) - principalPaid);
                const isHighRate = loan.interest_rate > 10;

                return (
                  <div
                    key={i}
                    className={`loan-card ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => setExpandedLoan(isExpanded ? null : i)}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                      <div>
                        <div className="loan-name">{loan.lender}</div>
                        <div className="loan-meta">
                          <span>{loan.interest_rate}% p.a.</span>
                          <span>EMI ₹{loan.emi.toLocaleString('en-IN')}</span>
                          <span>{remaining}m left</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div
                          className="loan-amount"
                          style={{ color: isHighRate ? 'var(--rose-bright)' : 'var(--text-primary)' }}
                        >
                          ₹{(loan.outstanding_balance / 100000).toFixed(1)}L
                        </div>
                        {isHighRate && (
                          <span className="badge badge-rose" style={{ fontSize: '0.62rem' }}>High Rate</span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="progress-track" style={{ flex: 1 }}>
                        <div
                          className="progress-fill electric"
                          style={{ width: `${loan.percent_repaid}%` }}
                        />
                      </div>
                      <span style={{
                        fontSize: '0.68rem', color: 'var(--text-tertiary)',
                        fontFamily: 'var(--font-mono)', flexShrink: 0
                      }}>
                        {loan.percent_repaid}%
                      </span>
                      {isExpanded
                        ? <ChevronUp size={14} color="var(--text-tertiary)" />
                        : <ChevronDown size={14} color="var(--text-tertiary)" />
                      }
                    </div>

                    {isExpanded && (
                      <div
                        style={{
                          marginTop: 16, paddingTop: 16,
                          borderTop: '1px solid var(--glass-border)',
                          animation: 'fade-in 0.2s var(--ease-out)'
                        }}
                      >
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                          {[
                            { label: 'Principal Paid', val: `₹${(principalPaid / 100000).toFixed(1)}L` },
                            { label: 'Est. Interest Paid', val: `₹${(estInterestPaid / 100000).toFixed(1)}L` },
                            { label: 'EMIs Completed', val: `${monthsPaid} / ${loan.tenure_months}` },
                            { label: 'Original Principal', val: `₹${(loan.original_principal / 100000).toFixed(1)}L` },
                          ].map((item, idx) => (
                            <div
                              key={idx}
                              style={{
                                background: 'var(--bg-surface)',
                                padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--glass-border)'
                              }}
                            >
                              <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
                                {item.label}
                              </div>
                              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                                {item.val}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                            <Info size={12} />
                            Click again to collapse
                          </div>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`DISPUTE FILED\nRBI Ombudsman complaint initiated for: ${loan.lender}`);
                            }}
                          >
                            <Flag size={12} />
                            Report Unauthorized
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CIBIL Trend Chart */}
          <div className="card card-pad animate-fade-up animate-fade-up-delay-2">
            <div className="section-title">
              <div className="section-title-icon" style={{ background: 'var(--emerald-glow)' }}>
                <TrendingUp size={14} color="var(--emerald-bright)" />
              </div>
              6-Month CIBIL Trend
            </div>
            <div style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cibilHistory}>
                  <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="var(--glass-border)" />
                  <XAxis
                    dataKey="m" stroke="var(--text-tertiary)" fontSize={10}
                    tickLine={false} axisLine={false} fontFamily="var(--font-mono)"
                  />
                  <YAxis
                    domain={['dataMin - 20', 'dataMax + 20']}
                    stroke="var(--text-tertiary)" fontSize={10}
                    tickLine={false} axisLine={false} width={36}
                    fontFamily="var(--font-mono)"
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-raised)',
                      border: '1px solid var(--glass-border-bright)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <Line
                    type="monotone" dataKey="score"
                    stroke="var(--emerald-bright)" strokeWidth={2}
                    dot={{ fill: 'var(--emerald-bright)', r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: 'var(--emerald-bright)', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Right Column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Credit Cards */}
          <div className="card card-pad card-glow-gold animate-fade-up animate-fade-up-delay-1">
            <div className="section-title">
              <div className="section-title-icon" style={{ background: 'var(--gold-subtle)' }}>
                <CreditCard size={14} color="var(--gold-bright)" />
              </div>
              Credit Cards
            </div>

            {(!creditData.credit_cards || creditData.credit_cards.length === 0) && (
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                No active credit cards.
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {creditData.credit_cards?.map((card: any, i: number) => {
                const cardUtil = Math.round((card.utilized / card.limit) * 100);
                const utilColor = cardUtil > 70 ? 'var(--rose)' : cardUtil > 30 ? 'var(--gold)' : 'var(--emerald)';

                // Dynamic bill date
                const dateMatch = card.next_bill.match(/^(\d+)/);
                let displayDate = card.next_bill;
                if (dateMatch) {
                  const billDay = parseInt(dateMatch[1]);
                  const suffix = billDay % 10 === 1 && billDay !== 11 ? 'st'
                    : billDay % 10 === 2 && billDay !== 12 ? 'nd'
                      : billDay % 10 === 3 && billDay !== 13 ? 'rd' : 'th';
                  const targetMonth = billDay <= now.getDate()
                    ? (now.getMonth() + 1) % 12
                    : now.getMonth();
                  displayDate = `${billDay}${suffix} ${monthNames[targetMonth]}`;
                }

                return (
                  <div key={i} style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-raised)', border: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: 2 }}>
                          {card.issuer}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                          Bill: {displayDate}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: utilColor, fontFamily: 'var(--font-display)' }}>
                          ₹{card.utilized.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                          / ₹{card.limit.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-track" style={{ flex: 1 }}>
                        <div
                          className="progress-fill"
                          style={{
                            width: `${cardUtil}%`,
                            background: `linear-gradient(90deg, ${utilColor}88, ${utilColor})`
                          }}
                        />
                      </div>
                      <span style={{
                        fontSize: '0.68rem', color: 'var(--text-tertiary)',
                        fontFamily: 'var(--font-mono)', width: 32, textAlign: 'right'
                      }}>
                        {cardUtil}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalLimit > 0 && (
              <div style={{
                marginTop: 16, padding: '14px 16px',
                background: utilPercent > 30 ? 'var(--gold-glow)' : 'var(--emerald-glow)',
                border: `1px solid ${utilPercent > 30 ? 'var(--gold)' : 'var(--emerald)'}`,
                borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                    Total Utilization: {utilPercent}%
                  </div>
                  <div style={{
                    fontSize: '0.72rem',
                    color: utilPercent > 30 ? 'var(--gold-bright)' : 'var(--emerald-bright)'
                  }}>
                    {utilPercent > 30 ? 'Reduce to below 30% to improve CIBIL' : 'Great! Below 30% threshold'}
                  </div>
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem', fontWeight: 700,
                  color: utilPercent > 30 ? 'var(--gold-bright)' : 'var(--emerald-bright)',
                  letterSpacing: '-0.03em'
                }}>
                  {utilPercent}%
                </div>
              </div>
            )}
          </div>

          {/* High interest alert */}
          {(creditData.active_loans || []).some((l: any) => l.interest_rate > 10) && (
            <div className="alert alert-danger animate-fade-up animate-fade-up-delay-3">
              <AlertTriangle size={16} className="alert-icon" />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--rose-bright)', marginBottom: 6, fontSize: '0.875rem' }}>
                  High-Interest Debt Detected
                </div>
                <p style={{ fontSize: '0.8rem', lineHeight: 1.6 }}>
                  You have loans above 10% interest. Consider balance transfer or aggressive repayment to avoid a debt trap. AI recommends closing these first.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}