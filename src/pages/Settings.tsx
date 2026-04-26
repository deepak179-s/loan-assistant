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
      <div className="page-header" style={{ marginBottom: 32 }}>
        <h1 style={{ marginBottom: '8px' }}>User Configurations</h1>
        <p>Manage your profile data, local avatars, and track your Net Worth dynamically.</p>
      </div>

      {/* Main Settings Area */}
      <div className="grid-2">
        
        {/* Left Column: API & Privacy Context */}
        <div className="card card-pad">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <Camera color="var(--electric-bright)" size={20} />
            Avatar Settings
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <img 
              src={profilePic} 
              alt="Preview" 
              style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--glass-border)', background: 'var(--bg-raised)' }} 
              onError={(e) => { e.currentTarget.src = '/me.png' }}
            />
            
            <div style={{ width: '100%' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Profile Image URL (Local or Web)</label>
              <input 
                type="text" 
                value={profilePic} 
                onChange={(e) => setProfilePic(e.target.value)}
                placeholder="/me.png"
                style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', padding: '12px 16px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none' }} 
              />
            </div>
          </div>
        </div>

        {/* Financial Settings */}
        <div className="card card-pad">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <Wallet color="var(--emerald-bright)" size={20} />
            Financial Declarations
          </h3>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Cash & Mutual Fund Assets (₹)</label>
            <input 
              type="number" 
              value={savings} 
              onChange={(e) => setSavings(parseInt(e.target.value) || 0)}
              style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', padding: '12px 16px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none' }} 
            />
          </div>

          <div style={{ background: 'var(--electric)', borderRadius: '12px', padding: '24px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '4px' }}>Live Net Worth</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <IndianRupee size={28} />
                {netWorth.toLocaleString('en-IN')}
              </div>
            </div>
            <TrendingUp size={48} opacity={0.3} />
          </div>
          
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
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
