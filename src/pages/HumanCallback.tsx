import { PhoneCall, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function HumanCallback() {
  return (
    <div className="animate-fade-in" style={{ padding: '24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '16px' }}>Human Callback & Advisory</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '40px' }}>
          Connect directly with SEBI Registered Financial Advisors and Credit Experts to discuss your optimization strategy.
        </p>
        
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--accent-primary)', opacity: 0.1, borderRadius: '50%', filter: 'blur(50px)' }} />
          <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '200px', height: '200px', background: 'var(--accent-tertiary)', opacity: 0.1, borderRadius: '50%', filter: 'blur(50px)' }} />

          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(122, 162, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid rgba(122, 162, 247, 0.2)' }}>
            <PhoneCall size={40} color="var(--accent-primary)" />
          </div>

          <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Premium Advisory Plan</h2>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '8px', marginBottom: '24px' }}>
            <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-main)', lineHeight: 1 }}>₹299</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>/ month</span>
          </div>

          <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
            Pay only <strong>₹299/m</strong> and get Personalized Consultation from Credit Experts.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', margin: '0 auto 40px', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <CheckCircle2 color="var(--success)" size={20} />
               <span>1-on-1 Call with Financial Experts</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <CheckCircle2 color="var(--success)" size={20} />
               <span>In-depth Portfolio Analysis</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <CheckCircle2 color="var(--success)" size={20} />
               <span>Custom Debt Restructuring Plan</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <ShieldCheck color="var(--success)" size={20} />
               <span>SEBI Registered Advisors</span>
            </div>
          </div>

          <a href="/payment" className="btn btn-primary" style={{ display: 'inline-block', padding: '16px 40px', fontSize: '1.2rem', borderRadius: '12px', boxShadow: '0 8px 32px rgba(122, 162, 247, 0.3)', textDecoration: 'none' }}>
            Book Now
          </a>
          
          <p style={{ marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Cancel anytime. 100% Secure Payment powered by Razorpay.
          </p>
        </div>
      </div>
    </div>
  );
}
