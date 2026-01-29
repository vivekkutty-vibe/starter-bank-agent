import { Modal } from './Modal';
import { useUser } from '../../lib/UserContext';
import { TrendingUp, TrendingDown, HelpCircle, AlertCircle } from 'lucide-react';
import { EmbeddedChat } from './EmbeddedChat';

export function SafeSpendModal({ isOpen, onClose }) {
    const { state } = useUser();
    const dailyTarget = state.financials.dailyTarget || 30;

    // Mock daily data for the chart
    const dailySpend = [
        { day: 'Mon', amount: 45 },
        { day: 'Tue', amount: 120 },
        { day: 'Wed', amount: 35 },
        { day: 'Thu', amount: 80 },
        { day: 'Fri', amount: 15 },
        { day: 'Sat', amount: 75 },
        { day: 'Sun', amount: 65 },
    ];

    const maxAmount = Math.max(...dailySpend.map(d => d.amount));
    // Ensure chart scales to accommodate either the max spend OR the target, whichever is higher (plus buffer)
    const displayMax = Math.ceil(Math.max(maxAmount, dailyTarget * 1.2));

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col" style={{
                height: '100%',
                background: 'var(--bg-app)',
                overflow: 'hidden'
            }}>
                {/* Header Container - Fixed at top */}
                <div style={{
                    padding: '24px 24px 16px',
                    textAlign: 'center',
                    borderBottom: '1px solid #E6E6E0',
                    background: 'white',
                    flexShrink: 0
                }}>
                    <h2 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)' }}>Safe to Spend</h2>
                    <p className="text-xs text-muted uppercase tracking-wider font-bold" style={{ marginTop: 2 }}>Daily Analysis</p>
                </div>

                {/* Main Content: Scrollable Area */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    background: '#FAF9F6',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{ padding: '24px' }}>
                        <div style={{ marginBottom: 'var(--space-4)' }}>
                            <div style={{
                                background: 'white',
                                padding: '16px',
                                borderRadius: '0 16px 16px 16px',
                                marginBottom: '8px',
                                maxWidth: '90%',
                                border: '1px solid #E6E6E0',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}>
                                <p style={{ margin: 0, fontSize: '1rem', lineHeight: '1.5' }}>
                                    Here is your spending breakdown for the last 7 days. You've been doing well, but Tuesday was a bit high.
                                </p>
                            </div>
                            <span className="text-xs text-muted ml-1">Agent • Just now</span>
                        </div>

                        {/* Day-wise Breakdown Chart */}
                        <div style={{ marginBottom: 'var(--space-4)' }}>
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="text-sm font-bold">Last 7 Days</h3>
                                <div className="flex items-center gap-2 text-xs text-muted">
                                    <div style={{ width: 12, height: 2, background: '#9ca3af', borderTop: '1px dashed #9ca3af' }}></div>
                                    Target: ${dailyTarget}
                                </div>
                            </div>

                            <div style={{ position: 'relative', height: '140px', borderLeft: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', marginLeft: '20px' }}>
                                <div style={{
                                    position: 'absolute',
                                    bottom: `${Math.min((dailyTarget / displayMax) * 100, 100)}%`,
                                    left: 0,
                                    right: 0,
                                    borderTop: '1px dashed #9ca3af',
                                    zIndex: 1
                                }}></div>

                                <div style={{ position: 'absolute', left: '-30px', top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '10px', color: '#9ca3af' }}>
                                    <span>${displayMax}</span>
                                    <span>$0</span>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(7, 1fr)',
                                    gap: '8px',
                                    height: '100%',
                                    padding: '0 8px',
                                    position: 'relative',
                                    zIndex: 2
                                }}>
                                    {dailySpend.map((item) => {
                                        const pct = Math.min((item.amount / displayMax) * 100, 100);
                                        const isOver = item.amount > dailyTarget;
                                        return (
                                            <div key={item.day} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', position: 'relative' }}>
                                                <div style={{
                                                    width: '100%',
                                                    height: `${pct}%`,
                                                    backgroundColor: isOver ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                                                    borderRadius: '4px 4px 0 0',
                                                    minHeight: '4px',
                                                    transition: 'height 0.3s ease'
                                                }}></div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(7, 1fr)',
                                gap: '8px',
                                padding: '0 8px',
                                marginTop: '8px'
                            }}>
                                {dailySpend.map((item) => (
                                    <span key={item.day} className="text-xs text-muted text-center">{item.day}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                        <EmbeddedChat
                            contextStarters={[
                                { label: 'Compare to last week', query: 'How does this week compare to last week?' },
                                { label: 'Can I spend $50?', query: 'Can I afford to spend $50 right now?' },
                                { label: 'Show big expenses', query: 'Show me my biggest expenses recently.' }
                            ]}
                            initialMessage="I've analyzed your daily spending. Want to see how it compares to your target?"
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
}
