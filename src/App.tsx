import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, Bot, Shield, TrendingUp,
  Briefcase, CreditCard, Sun, Moon, Menu, X, ChevronDown
} from 'lucide-react';
import { useState, useEffect } from 'react';
import './index.css';

import Dashboard from './pages/Dashboard';
import AiAgents from './pages/AiAgents';
import Simulator from './pages/Simulator';
import RestructuringTracker from './pages/RestructuringTracker';
import CreditProfile from './pages/CreditProfile';
import KycVerification from './pages/KycVerification';
import HumanCallback from './pages/HumanCallback';

import { useUser, USERS } from './context/UserContext';

const NavItem = ({ to, icon: Icon, label, badge }: {
  to: string; icon: any; label: string; badge?: string;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={() => window.dispatchEvent(new CustomEvent('closeMobileMenu'))}
      className={`nav-item ${isActive ? 'active' : ''}`}
    >
      <Icon size={17} className="nav-icon" />
      <span>{label}</span>
      {badge && <span className="nav-badge">{badge}</span>}
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

  return (
    <Router>
      <div className="app-container">
        <div
          className={`sidebar-overlay ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* ── Sidebar ── */}
        <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <TrendingUp size={18} color="#fff" />
            </div>
            <div>
              <div className="sidebar-logo-text">AI Repayment IN</div>
              <div className="sidebar-logo-sub">v2.0 · DPDP Compliant</div>
            </div>
            <button
              className="icon-btn mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ marginLeft: 'auto', display: isMobileMenuOpen ? 'flex' : 'none' }}
            >
              <X size={16} />
            </button>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-section-label">Overview</div>
            <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/kyc-auth" icon={Shield} label="Sync CIBIL" badge="Live" />
            <NavItem to="/credit" icon={CreditCard} label="Credit Profile" />
            <NavItem to="/simulator" icon={TrendingUp} label="EMI Simulator" />

            <div className="nav-section-label">Strategies</div>
            <NavItem to="/restructuring" icon={Briefcase} label="CSIS & Subsidy" />

            <div className="nav-section-label">Advisory</div>
            <NavItem to="/agents" icon={Bot} label="AI Agents" badge="AI" />
            <NavItem to="/advisor" icon={MessageSquare} label="Human Advisor" />
          </nav>

          <div className="sidebar-footer">
            <div className="compliance-badge">
              <div className="compliance-dot" />
              <div className="compliance-text">
                <strong>Privacy Active</strong>
                <span>DPDP Secured</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="main-content">
          <header className="top-nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                className="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={20} />
              </button>
              <span className="page-title">Financial Dashboard</span>
            </div>

            <div className="nav-controls">
              <button
                className="icon-btn"
                onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                title="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              <div className="user-switcher">
                <img
                  src={activeUser.image}
                  alt={activeUser.name}
                  className="user-avatar"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/me.png'; }}
                />
                <div className="user-info">
                  <div className="user-name">{activeUser.name.split(' ')[0]}</div>
                  <div className="user-role">{activeUser.title.split('·')[0].trim()}</div>
                </div>
                <ChevronDown size={14} style={{ color: 'var(--text-tertiary)', marginLeft: 2 }} />
                <div className="user-select-wrapper">
                  <select
                    value={activeUser.id}
                    onChange={(e) => setActiveUserId(e.target.value)}
                  >
                    {Object.values(USERS).map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                </div>
              </div>
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
              <Route path="*" element={
                <div style={{ padding: '80px 40px', textAlign: 'center' }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>Coming Soon</h2>
                  <p style={{ color: 'var(--text-secondary)' }}>This module is under development.</p>
                </div>
              } />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}