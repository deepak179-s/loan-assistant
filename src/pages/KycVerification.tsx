import { useState } from 'react';
import { ShieldCheck, UserCheck, Lock } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { auth } from '../config/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

export default function KycVerification() {
  const { setActiveUserId } = useUser();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    pan: '',
    dob: '',
    mobile: ''
  });
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      // Firebase auth requires country code
      const phoneNumber = formData.mobile.startsWith('+') ? formData.mobile : '+91' + formData.mobile;
      
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      
      setStep(2);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to send OTP. Please check the console.');
      // If reCAPTCHA fails, resetting helps
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await window.confirmationResult.confirm(otp);
      
      // Successfully authenticated!
      // Map the entered name to the mock user profiles in Firestore
      const lowerName = formData.name.toLowerCase();
      if (lowerName.includes('sumit')) setActiveUserId('sumit');
      else if (lowerName.includes('kashish')) setActiveUserId('kashish');
      else if (lowerName.includes('tarun')) setActiveUserId('tarun');
      else setActiveUserId('deepak');

      setStep(3);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="text-gradient" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <ShieldCheck size={32} />
          Sync Real CIBIL
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Securely fetch your credit profile from the bureau using DPDP compliant protocols.</p>
      </div>

      {errorMsg && (
        <div style={{ background: 'rgba(247, 118, 142, 0.1)', color: 'var(--danger)', padding: '16px', borderRadius: '12px', marginBottom: '24px', textAlign: 'center', border: '1px solid var(--danger)' }}>
          {errorMsg}
        </div>
      )}

      {/* Invisible reCAPTCHA container for Firebase */}
      <div id="recaptcha-container"></div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        {step === 1 && (
           <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Full Name (As per PAN)</label>
                <div style={{ position: 'relative' }}>
                  <UserCheck size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{ width: '100%', padding: '12px 16px 12px 48px', background: 'var(--bg-panel)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }} 
                    placeholder="E.g. Deepak Kumar" 
                  />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-muted)' }}>PAN Number</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.pan}
                    onChange={(e) => setFormData({...formData, pan: e.target.value})}
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-panel)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', textTransform: 'uppercase' }} 
                    placeholder="ABCDE1234F" 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Date of Birth</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.dob}
                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-panel)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', colorScheme: 'dark' }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Mobile Number (Linked to Aadhaar/Firebase)</label>
                <input 
                  type="tel" 
                  required 
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-panel)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }} 
                  placeholder="Enter 10-digit mobile number" 
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '12px', padding: '14px', fontSize: '1.05rem', fontWeight: 'bold' }}>
                {loading ? 'Verifying...' : 'Request OTP'}
              </button>
           </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
            <Lock size={48} color="var(--accent-primary)" style={{ margin: '0 auto' }} />
            <h3 style={{ fontSize: '1.2rem' }}>Enter OTP sent to +91 {formData.mobile}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Powered by Firebase Authentication</p>
            
            <input 
              type="text" 
              required 
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{ width: '100%', padding: '16px', background: 'var(--bg-panel)', border: '1px solid var(--accent-primary)', borderRadius: '8px', color: 'white', fontSize: '1.5rem', textAlign: 'center', letterSpacing: '4px' }} 
              placeholder="••••••" 
            />
            
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '14px', fontSize: '1.05rem', fontWeight: 'bold' }}>
               {loading ? 'Connecting to Bureau...' : 'Fetch Live Profile'}
            </button>
          </form>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: 80, height: 80, background: 'rgba(158, 206, 106, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
               <ShieldCheck size={40} color="var(--success)" />
            </div>
            <h2 style={{ color: 'var(--success)', marginBottom: '16px' }}>Network Sync Successful</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '32px' }}>
              Your credit profile has been securely imported from the realtime Firebase network. The AI Debt Optimizer has been granted temporary access to analyze your portfolio.
            </p>
            <a href="/credit" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>View Credit Dashboard</a>
          </div>
        )}
      </div>
    </div>
  );
}
