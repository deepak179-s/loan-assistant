import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Bot, History, Shield, TrendingUp, Briefcase, CreditCard, Sun, Moon, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import './index.css';

// Lazy import pages or import them directly
import Dashboard from './pages/Dashboard';
import AiAgents from './pages/AiAgents';
import Simulator from './pages/Simulator';
import RestructuringTracker from './pages/RestructuringTracker';
import CreditProfile from './pages/CreditProfile';
import KycVerification from './pages/KycVerification';
import HumanCallback from './pages/HumanCallback';
import { useUser, USERS } from './context/UserContext';

/* Sidebar Navigation Item */
const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      onClick={() => {
        // Find if there's a mobile menu state setter and call it
        const event = new CustomEvent('closeMobileMenu');
        window.dispatchEvent(event);
      }}
      className={`nav-item ${isActive ? 'active' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        margin: '8px 0',
        borderRadius: '12px',
        textDecoration: 'none',
        color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
        background: isActive ? 'var(--glass-border)' : 'transparent',
        transition: 'all var(--transition-fast)',
        fontWeight: isActive ? 600 : 400
      }}
    >
      <Icon size={20} style={{ marginRight: '16px', color: isActive ? 'var(--accent-primary)' : 'currentColor' }} />
      {label}
    </Link>
  );
};

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { activeUser, setActiveUserId } = useUser();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleClose = () => setIsMobileMenuOpen(false);
    window.addEventListener('closeMobileMenu', handleClose);
    return () => window.removeEventListener('closeMobileMenu', handleClose);
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <Router>
      <div className="app-container">
        {/* Mobile Overlay */}
        <div className={`sidebar-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>

        {/* Sidebar Navigation */}
        <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 12px 32px' }}>
            <h2 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.25rem', margin: 0 }}>
              <TrendingUp />
              AI Repayment IN
            </h2>
            <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(false)} style={{ display: isMobileMenuOpen ? 'block' : 'none' }}>
              <X size={24} />
            </button>
          </div>
          
          <nav style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', margin: '16px 16px 8px' }}>
              Overview
            </div>
            <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/kyc-auth" icon={Shield} label="Sync Real CIBIL" />
            <NavItem to="/credit" icon={CreditCard} label="Credit Profile" />
            <NavItem to="/simulator" icon={History} label="EMI Projections" />
            <NavItem to="/restructuring" icon={Briefcase} label="CSIS & Restructuring" />
            
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', margin: '32px 16px 8px' }}>
              Advisors
            </div>
            <NavItem to="/agents" icon={Bot} label="AI Agents" />
            <NavItem to="/advisor" icon={MessageSquare} label="Human Callback" />
            
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', margin: '32px 16px 8px' }}>
              System
            </div>
            {/* Settings Removed per request */}
            
            <div className="glass-panel" style={{ marginTop: 'auto', margin: '16px', padding: '16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Shield size={24} color="var(--success)" />
              <div>
                <strong style={{ display: 'block', color: 'var(--success)' }}>Privacy Active</strong>
                <span style={{ color: 'var(--text-muted)' }}>DPDP Compliant Node</span>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          <header className="top-nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu size={24} />
              </button>
              <h3 style={{ fontWeight: 500, margin: 0 }}>Dashboard</h3>
            </div>
            
            <div className="header-controls" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <button 
                onClick={toggleTheme}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)', transition: 'var(--transition-fast)' }}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>
                <select 
                  value={activeUser.id} 
                  onChange={(e) => setActiveUserId(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: 'inherit', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', outline: 'none', appearance: 'none', textAlign: 'right', width: '100%' }}
                >
                  {Object.values(USERS).map(user => (
                    <option key={user.id} value={user.id} style={{ color: 'black' }}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{activeUser.title}</div>
              </div>
              <img 
                src={activeUser.image} 
                alt="Profile"
                onError={(e) => { e.currentTarget.src = '/me.png' }}
                style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--glass-border)', background: 'var(--bg-panel-light)' }}
              />
            </div>
          </header>
          
          <div className="page-content animate-fade-in">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/kyc-auth" element={<KycVerification />} />
              <Route path="/agents" element={<AiAgents />} />
              <Route path="/simulator" element={<Simulator />} />
              <Route path="/restructuring" element={<RestructuringTracker />} />
              <Route path="/credit" element={<CreditProfile />} />
              <Route path="/advisor" element={<HumanCallback />} />
              <Route path="*" element={<div style={{ padding: '40px', textAlign: 'center' }}><h2>Coming Soon!</h2><p>This module is currently being built.</p></div>} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}
