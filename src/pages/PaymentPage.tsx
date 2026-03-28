import { useState } from 'react';
import { CheckCircle, ShieldCheck } from 'lucide-react';

export default function PaymentPage() {
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
        <h1 className="text-gradient">Complete Your Booking</h1>
        <p style={{ color: 'var(--text-muted)' }}>Scan the QR code to pay ₹299 and fill out your details to schedule your consultation.</p>
      </div>

      {status === 'success' ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 40px', maxWidth: '600px', margin: '0 auto' }}>
          <CheckCircle size={64} color="var(--success)" style={{ margin: '0 auto 24px' }} />
          <h2 style={{ color: 'var(--success)', marginBottom: '16px' }}>Payment Details Received</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Thank you! We have received your payment details and UTR number. Our credit experts will verify the transaction and contact you shortly.
          </p>
          <a href="/advisor" className="btn btn-secondary" style={{ marginTop: '32px', display: 'inline-block', textDecoration: 'none' }}>Back to Advisor Page</a>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: '40px', alignItems: 'start' }}>
          
          {/* Left Side: QR Code */}
          <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '8px' }}>Scan to Pay</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>Amount: ₹299/month</p>
            
            <div style={{ background: 'white', padding: '16px', borderRadius: '16px', display: 'inline-block' }}>
              <img src="/pay.jpeg" alt="QR Code for Payment" style={{ width: '100%', maxWidth: '250px', height: 'auto', borderRadius: '8px' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--success)', marginTop: '24px', fontSize: '0.9rem' }}>
              <ShieldCheck size={18} />
              <span>Secure UPI Transaction</span>
            </div>
          </div>

          {/* Right Side: Web3Forms */}
          <div className="glass-panel" style={{ padding: '40px' }}>
            <h3 style={{ marginBottom: '24px' }}>Submission Form</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* IMPORTANT: Web3Forms Access Key */}
              <input type="hidden" name="access_key" value={import.meta.env.VITE_WEB3FORMS_KEY || "YOUR_ACCESS_KEY_HERE"} />
              <input type="hidden" name="subject" value="New Human Callback Payment" />
              <input type="hidden" name="from_name" value="Loan Assistant Demo" />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Full Name</label>
                  <input type="text" name="name" required style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-panel)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }} placeholder="Your Name" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Phone Number</label>
                  <input type="tel" name="phone" required style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-panel)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }} placeholder="10-digit Mobile" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Email Address</label>
                  <input type="email" name="email" required style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-panel)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }} placeholder="you@example.com" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-muted)' }}>12-Digit UTR No. (Post Payment)</label>
                  <input type="text" name="utr_number" required style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,165,0,0.05)', border: '1px solid var(--accent-tertiary)', borderRadius: '8px', color: 'white' }} placeholder="e.g. 312345678901" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Message (Optional)</label>
                <textarea name="message" rows={3} style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-panel)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', fontFamily: 'inherit', resize: 'vertical' }} placeholder="Any specific issues or times to call?"></textarea>
              </div>

              <button type="submit" disabled={status === 'submitting'} className="btn btn-primary" style={{ padding: '16px', fontSize: '1.05rem', marginTop: '12px', opacity: status === 'submitting' ? 0.7 : 1 }}>
                {status === 'submitting' ? 'Submitting Details...' : 'Submit Payment Details'}
              </button>

              {status === 'error' && (
                <div style={{ color: 'var(--danger)', fontSize: '0.9rem', textAlign: 'center', marginTop: '8px' }}>
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
