import { useState, useEffect } from 'react';
import { Camera, Save, TrendingUp, IndianRupee, Wallet } from 'lucide-react';

export default function Settings() {
  const [profilePic, setProfilePic] = useState('/me.png');
  const [savings, setSavings] = useState(0);
  const [outstandingDebt, setOutstandingDebt] = useState(0);

  useEffect(() => {
    // Load config from memory
    const savedPic = localStorage.getItem('profilePic');
    if (savedPic) setProfilePic(savedPic);

    const savedSavings = localStorage.getItem('totalSavings');
    if (savedSavings) setSavings(parseInt(savedSavings));

    // Calculate outstanding debt from CIBIL
    const cibilRaw = localStorage.getItem('cibilData');
    if (cibilRaw) {
      try {
        const cibil = JSON.parse(cibilRaw);
        if (cibil.active_loans) {
          const totalLoans = cibil.active_loans.reduce((acc: number, loan: any) => acc + loan.outstanding_balance, 0);
          setOutstandingDebt(totalLoans);
        }
      } catch (e) {}
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('profilePic', profilePic);
    localStorage.setItem('totalSavings', savings.toString());
    alert('Settings saved successfully! Menu avatars will update upon your next refresh.');
  };

  const netWorth = savings - outstandingDebt;

  return (
    <div>
      <h1 className="text-gradient" style={{ marginBottom: '8px' }}>User Configurations</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Manage your profile data, local avatars, and track your Net Worth dynamically.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>
        
        {/* Profile Settings */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <Camera color="var(--accent-primary)" size={20} />
            Avatar Settings
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <img 
              src={profilePic} 
              alt="Preview" 
              style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--glass-border)', background: 'var(--bg-panel)' }} 
              onError={(e) => { e.currentTarget.src = '/me.png' }}
            />
            
            <div style={{ width: '100%' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Profile Image URL (Local or Web)</label>
              <input 
                type="text" 
                value={profilePic} 
                onChange={(e) => setProfilePic(e.target.value)}
                placeholder="/me.png"
                style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '12px 16px', borderRadius: '8px', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} 
              />
            </div>
          </div>
        </div>

        {/* Financial Settings */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <Wallet color="var(--success)" size={20} />
            Financial Declarations
          </h3>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Total Cash & Mutual Fund Assets (₹)</label>
            <input 
              type="number" 
              value={savings} 
              onChange={(e) => setSavings(parseInt(e.target.value) || 0)}
              style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '12px 16px', borderRadius: '8px', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} 
            />
          </div>

          <div style={{ background: 'var(--gradient-primary)', borderRadius: '12px', padding: '24px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '4px' }}>Live Net Worth</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <IndianRupee size={28} />
                {netWorth.toLocaleString('en-IN')}
              </div>
            </div>
            <TrendingUp size={48} opacity={0.3} />
          </div>
          
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Auto-Calculated Verified Debt: ₹{outstandingDebt.toLocaleString('en-IN')}</span>
            <span>Assets: ₹{savings.toLocaleString('en-IN')}</span>
          </div>
        </div>

      </div>

      <div style={{ marginTop: '32px', textAlign: 'right' }}>
        <button onClick={handleSave} className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '1.05rem' }}>
          <Save size={18} />
          Save Configurations
        </button>
      </div>
    </div>
  );
}
