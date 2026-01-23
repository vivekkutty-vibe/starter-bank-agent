import { useLocation, useNavigate } from 'react-router-dom';
import { Wallet, PieChart, Bell, Home } from 'lucide-react';
import { GlobalChat } from '../features/GlobalChat';

export function Layout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

    return (
        <div className="layout">
            {/* Top Bar */}
            <header className="header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-4)',
                position: 'sticky',
                top: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                zIndex: 100,
                borderBottom: '1px solid var(--bg-card-hover)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)' }}></div>
                    <span style={{ fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>AgentBank</span>
                </div>
                <button className="btn-ghost" style={{ padding: 8, color: 'var(--text-primary)' }}>
                    <Bell size={20} />
                </button>
            </header>

            {/* Main Content */}
            <main style={{ flex: 1, paddingBottom: 160 }}> {/* Extra padding for Chat Pill */}
                {children}
            </main>

            <GlobalChat />

            {/* Bottom Nav */}
            <nav style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'var(--bg-card)',
                borderTop: '1px solid var(--bg-card-hover)',
                padding: 'var(--space-2) var(--space-4)',
                display: 'flex',
                justifyContent: 'space-around',
                paddingBottom: 'max(var(--space-2), env(safe-area-inset-bottom))'
            }}>
                <NavItem
                    icon={<Home size={24} />}
                    label="Home"
                    active={currentPath === '/'}
                    onClick={() => navigate('/')}
                />
                <NavItem
                    icon={<PieChart size={24} />}
                    label="Insights"
                    active={currentPath === '/insights'}
                    onClick={() => navigate('/insights')}
                />
                <NavItem
                    icon={<Wallet size={24} />}
                    label="Wallet"
                    active={currentPath === '/wallet'}
                    onClick={() => navigate('/wallet')}
                />
            </nav>
        </div>
    );
}

function NavItem({ icon, label, active, onClick }) {
    return (
        <button onClick={onClick} style={{
            background: 'none',
            border: 'none',
            color: active ? 'var(--accent-primary)' : 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            padding: 8,
            fontSize: '0.75rem',
            cursor: 'pointer'
        }}>
            {icon}
            <span>{label}</span>
            {active && <div style={{
                width: 4, height: 4, borderRadius: '50%',
                background: 'var(--accent-primary)',
                marginTop: 2
            }} />}
        </button>
    );
}
