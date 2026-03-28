import { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, Lock } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function KycVerification() {
  const { activeUser } = useUser();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: activeUser.name,
    pan: activeUser.pan,
    dob: '',
    mobile: ''
  });
  const [otp, setOtp] = useState('');

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: activeUser.name,
      pan: activeUser.pan
    }));
  }, [activeUser]);

  const [errorMsg, setErrorMsg] = useState('');

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    try {
      const response = await fetch('/api/kyc/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'mock_decentro_sandbox_key_123'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to request OTP');
      
      setStep(2);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    try {
      const response = await fetch('/api/kyc/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'mock_decentro_sandbox_key_123'
        },
        body: JSON.stringify({ mobile: formData.mobile, otp })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Invalid OTP');
      
      // Successfully fetched CIBIL data here (data.data)
      console.log("Bureau Data:", data.data);
      localStorage.setItem('cibilData', JSON.stringify(data.data));
      setStep(3);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
        
        {/* Progress Bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, height: '4px', width: '100%', background: 'rgba(255,255,255,0.05)' }}>
          <div style={{ height: '100%', width: step === 1 ? '33%' : step === 2 ? '66%' : '100%', background: 'var(--gradient-primary)', transition: 'width 0.4s ease' }} />
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <UserCheck color="var(--accent-primary)" />
              Verify Identity
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              We need to fetch your secure credit profile from the Bureau. Please provide details matching your PAN Card.
            </p>

            {errorMsg && (
               <div style={{ background: 'rgba(247, 118, 142, 0.1)', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
                 {errorMsg}
               </div>
            )}

            <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="As per PAN Card" style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', padding: '12px 16px', borderRadius: '8px', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Permanent Account Number (PAN)</label>
                <input required type="text" value={formData.pan} onChange={e => setFormData({...formData, pan: e.target.value.toUpperCase()})} placeholder="ABCDE1234F" maxLength={10} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', padding: '12px 16px', borderRadius: '8px', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', textTransform: 'uppercase' }} />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Date of Birth</label>
                  <input required type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', padding: '11px 16px', borderRadius: '8px', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mobile Number</label>
                  <input required type="tel" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} placeholder="9876543210" maxLength={10} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', padding: '12px 16px', borderRadius: '8px', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', background: 'rgba(122, 162, 247, 0.1)', padding: '12px', borderRadius: '8px' }}>
                <Lock size={16} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Data is encrypted. We act as an authorized agent.</span>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '8px', fontSize: '1rem' }}>
                {loading ? 'Initiating Verification...' : 'Send OTP'}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in" style={{ textAlign: 'center' }}>
            <ShieldCheck size={48} color="var(--accent-primary)" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ marginBottom: '8px' }}>Enter Authentication Code</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              We've sent a 6-digit OTP to +91 {formData.mobile} to authorize the credit bureau pull.
            </p>

            {errorMsg && (
               <div style={{ background: 'rgba(247, 118, 142, 0.1)', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem', textAlign: 'left' }}>
                 {errorMsg}
               </div>
            )}

            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <input 
                required 
                type="text" 
                value={otp} 
                onChange={e => setOtp(e.target.value)} 
                placeholder="0 0 0 0 0 0" 
                maxLength={6} 
                style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '12px', color: 'var(--text-main)', fontSize: '1.5rem', outline: 'none', textAlign: 'center', letterSpacing: '0.5em' }} 
              />

              <button type="submit" disabled={loading || otp.length < 6} className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
                {loading ? 'Fetching CIBIL Data securely...' : 'Verify & Fetch Profile'}
              </button>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in" style={{ textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(158, 206, 106, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <ShieldCheck size={40} color="var(--success)" />
            </div>
            <h2 style={{ marginBottom: '8px', color: 'var(--success)' }}>Bureau Connection Successful</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px' }}>
              We have successfully retrieved your official credit data. Redoubling to your Financial Portfolio now...
            </p>
            <a href="/credit" className="btn btn-primary" style={{ textDecoration: 'none' }}>View My Real Profile</a>
          </div>
        )}

      </div>
    </div>
  );
}
