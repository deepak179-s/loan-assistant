import { useState } from 'react';
import { CheckCircle, ShieldCheck } from 'lucide-react';

export default function PaymentPage({ onBack }: { onBack?: () => void }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    
    const formData = new FormData(e.currentTarget);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json
      });
      const result = await response.json();
      if (result.success) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '40px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 style={{ marginBottom: 8 }}>Complete Your Booking</h1>
          <p>Scan the QR code to pay ₹299 and fill out your details to schedule your consultation.</p>
        </div>
      </div>

      {status === 'success' ? (
        <div className="card card-pad" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <CheckCircle size={64} color="var(--emerald-bright)" style={{ margin: '0 auto 24px' }} />
          <h2 style={{ color: 'var(--emerald-bright)', marginBottom: '16px' }}>Payment Details Received</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Thank you! We have received your payment details and UTR number. Our credit experts will verify the transaction and contact you shortly.
          </p>
          {onBack && (
            <button onClick={onBack} className="btn btn-secondary" style={{ marginTop: '32px', display: 'inline-block' }}>Back to Advisor Page</button>
          )}
        </div>
      ) : (
        <div className="grid-payment">
          
          {/* Left Side: QR Code */}
          <div className="card card-pad" style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '8px' }}>Scan to Pay</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>Amount: ₹299/month</p>
            
            <div style={{ background: 'white', padding: '16px', borderRadius: '28px', display: 'inline-block' }}>
              <img src="/pay.png" alt="QR Code for Payment" style={{ width: '100%', maxWidth: '250px', height: 'auto', borderRadius: '24px' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--emerald-bright)', marginTop: '24px', fontSize: '0.9rem' }}>
              <ShieldCheck size={18} />
              <span>Secure UPI Transaction</span>
            </div>
          </div>

          {/* Right Side: Web3Forms */}
          <div className="card card-pad">
            <h3 style={{ marginBottom: '24px' }}>Submission Form</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* IMPORTANT: Web3Forms Access Key */}
              <input type="hidden" name="access_key" value={import.meta.env.VITE_WEB3FORMS_KEY || "YOUR_ACCESS_KEY_HERE"} />
              <input type="hidden" name="subject" value="New Human Callback Payment" />
              <input type="hidden" name="from_name" value="Loan Assistant Demo" />

              <div className="form-grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>Full Name</label>
                  <input type="text" name="name" required style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)' }} placeholder="Your Name" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>Phone Number</label>
                  <input type="tel" name="phone" required style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)' }} placeholder="10-digit Mobile" />
                </div>
              </div>

              <div className="form-grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>Email Address</label>
                  <input type="email" name="email" required style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)' }} placeholder="you@example.com" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>12-Digit UTR No. (Post Payment)</label>
                  <input type="text" name="utr_number" required style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-raised)', border: '1px solid var(--cyan-bright)', borderRadius: '8px', color: 'var(--text-primary)' }} placeholder="e.g. 312345678901" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>Message (Optional)</label>
                <textarea name="message" rows={3} style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'vertical' }} placeholder="Any specific issues or times to call?"></textarea>
              </div>

              <button type="submit" disabled={status === 'submitting'} className="btn btn-primary" style={{ padding: '16px', fontSize: '1.05rem', marginTop: '12px', opacity: status === 'submitting' ? 0.7 : 1 }}>
                {status === 'submitting' ? 'Submitting Details...' : 'Submit Payment Details'}
              </button>

              {status === 'error' && (
                <div style={{ color: 'var(--rose-bright)', fontSize: '0.9rem', textAlign: 'center', marginTop: '8px' }}>
                  An error occurred while submitting the form. Please check your config.
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
