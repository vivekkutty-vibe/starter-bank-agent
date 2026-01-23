import { useState } from 'react';
import { useUser } from '../../lib/UserContext';
import { SmartFeed } from './SmartFeed';
import { PartyPopper } from 'lucide-react';
import { SafeSpendModal } from '../../components/ui/SafeSpendModal';

export function Dashboard() {
    const { state } = useUser();
    const [simulatePayday, setSimulatePayday] = useState(false);
    const [isSafeSpendOpen, setIsSafeSpendOpen] = useState(false);

    // Calculate days to payday
    const getDaysToPayday = () => {
        if (!state.financials?.nextPayDate) return 14;
        const today = new Date('2026-01-15'); // Fixed reference "Today"
        const next = new Date(state.financials.nextPayDate);
        const diff = Math.ceil((next - today) / (1000 * 60 * 60 * 24));
        return diff;
    };
    const daysToPay = getDaysToPayday();
    const isPayday = simulatePayday || daysToPay <= 0;

    return (
        <div className="container">
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Good Morning, {state.user.name}</h1>
                <p className="text-muted" style={{ margin: '4px 0 0' }}>Here's your financial briefing.</p>
            </div>

            {/* Financial Pulse */}
            <div
                className="card"
                style={{ marginBottom: 'var(--space-6)', cursor: 'pointer' }}
                onClick={() => setIsSafeSpendOpen(true)}
            >
                <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-4)' }}>
                    <span className="text-muted text-sm">Safe to Spend</span>
                    <div
                        className="flex items-center gap-2"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent opening modal when toggling simulation
                            setSimulatePayday(!simulatePayday);
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        {isPayday ? (
                            <span className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full animate-pulse"
                                style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)', color: '#7e5109', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                <PartyPopper size={14} /> It's Payday!
                            </span>
                        ) : (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                                Payday in {daysToPay} days
                            </span>
                        )}
                        <span className="text-accent text-sm font-bold">On Track</span>
                    </div>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                    $842.00
                </div>
                <div className="flex gap-2">
                    <div style={{ flex: 1, height: 4, background: 'var(--bg-card-hover)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: '65%', height: '100%', background: 'var(--accent-primary)' }}></div>
                    </div>
                </div>
                <div className="flex justify-between text-xs text-muted" style={{ marginTop: 8 }}>
                    <span>${state.transactions.reduce((acc, t) => acc + t.amount, 0).toFixed(0)} spent</span>
                    <span>$2,200 limit</span>
                </div>
            </div>

            {/* Smart Feed */}
            <SmartFeed />

            <SafeSpendModal
                isOpen={isSafeSpendOpen}
                onClose={() => setIsSafeSpendOpen(false)}
            />
        </div>
    );
}
