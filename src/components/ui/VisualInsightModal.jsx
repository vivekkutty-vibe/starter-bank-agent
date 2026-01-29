import { Modal, useKeyboard } from './Modal';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { EmbeddedChat } from './EmbeddedChat';

export function VisualInsightModal({ isOpen, onClose, type, data, metrics }) {
    const isKeyboardUp = useKeyboard();
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                background: 'var(--bg-app)',
                overflow: 'hidden'
            }}>
                {/* Header Container - Fixed at top */}
                <div style={{
                    padding: isKeyboardUp ? '12px 24px' : '24px 24px 16px',
                    textAlign: isKeyboardUp ? 'left' : 'center',
                    borderBottom: '1px solid #E6E6E0',
                    background: 'white',
                    flexShrink: 0
                }}>
                    <h2 style={{ fontSize: isKeyboardUp ? '0.95rem' : '1.1rem', margin: '0 0 4px 0', fontWeight: '800' }}>
                        {type === 'cycle' ? 'Cycle Comparison' :
                            type === 'monthly' ? 'Monthly Comparison' :
                                type === 'savings' ? 'Savings Breakdown' :
                                    data?.category ? `${data.category.charAt(0).toUpperCase() + data.category.slice(1)} Breakdown` : 'Category Breakdown'}
                    </h2>
                    {!isKeyboardUp && (
                        <p className="text-sm text-muted">
                            {type === 'cycle' ? 'This Pay Cycle vs Last' :
                                type === 'monthly' ? 'Spending Trend' :
                                    type === 'savings' ? `Savings Breakdown for ${data?.cycle || 'Cycle'}` :
                                        data?.category ? `Spending Breakdown for ${data.category.charAt(0).toUpperCase() + data.category.slice(1)}` :
                                            `Spending Breakdown for this month`}
                        </p>
                    )}
                </div>

                {/* Integrated Scroll Area (via EmbeddedChat) */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <EmbeddedChat
                        contextStarters={getStarters(type, data)}
                        initialMessage={`I can help analyze your ${type === 'cycle' ? 'spending cycle' : type === 'monthly' ? 'monthly trends' : type === 'savings' ? 'savings breakdown' : 'spending breakdown'}. What would you like to know?`}
                    >
                        {/* Comparison Charts injected as children */}
                        {type === 'monthly' && (
                            <div className="card animate-fade-in" style={{ marginBottom: 12 }}>
                                <div className="flex justify-between text-xs text-muted mb-4">
                                    <span>Comparison</span>
                                    <span className="font-bold">Month over Month</span>
                                </div>
                                <div className="flex items-end gap-4" style={{ height: 120 }}>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                                            <div style={{ width: '100%', background: '#d1d5db', borderRadius: '4px 4px 0 0', height: '60%' }}></div>
                                        </div>
                                        <span className="text-[10px] text-center text-muted">Last Month</span>
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                                            <div style={{ width: '100%', background: 'var(--accent-primary)', borderRadius: '4px 4px 0 0', height: '48%' }}></div>
                                        </div>
                                        <span className="text-[10px] text-center font-bold">This Month</span>
                                    </div>
                                </div>
                                <div className="mt-4 text-center">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold">
                                        <TrendingDown size={12} /> Down 12% vs Last Month
                                    </div>
                                </div>
                            </div>
                        )}

                        {type === 'cycle' && (
                            <div className="card animate-fade-in" style={{ marginBottom: 12 }}>
                                <div className="flex justify-between text-xs text-muted mb-4">
                                    <span>Comparison</span>
                                    <span className="font-bold">Biweekly</span>
                                </div>
                                <div className="flex items-end gap-3" style={{ height: 120 }}>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 4, height: '90px' }}>
                                            <div style={{ width: '35%', background: 'var(--accent-primary)', opacity: 0.4, borderRadius: '4px 4px 0 0', height: '80%' }}></div>
                                            <div style={{ width: '35%', background: 'var(--success)', opacity: 0.4, borderRadius: '4px 4px 0 0', height: '10%' }}></div>
                                        </div>
                                        <span className="text-[10px] text-center text-muted">Oct 1-14</span>
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 4, height: '90px' }}>
                                            <div style={{ width: '35%', background: 'var(--accent-primary)', borderRadius: '4px 4px 0 0', height: '50%' }}></div>
                                            <div style={{ width: '35%', background: 'var(--success)', borderRadius: '4px 4px 0 0', height: '30%' }}></div>
                                        </div>
                                        <span className="text-[10px] text-center font-bold">Oct 15-28</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {type === 'category' && (
                            <div className="flex flex-col gap-3 animate-fade-in" style={{ marginBottom: 12 }}>
                                {(() => {
                                    const total = data?.amount || 1000;
                                    const breakdown = { 'bills': total * 0.4, 'groceries': total * 0.25, 'dining': total * 0.2, 'transport': total * 0.1, 'shopping': total * 0.05 };
                                    return Object.entries(breakdown).map(([cat, amount]) => (
                                        <div key={cat}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span style={{ textTransform: 'capitalize' }}>{cat}</span>
                                                <span className="font-bold">${amount.toFixed(0)}</span>
                                            </div>
                                            <div style={{ height: 6, background: '#E6E6E0', borderRadius: 3, overflow: 'hidden' }}>
                                                <div style={{ width: `${(amount / total) * 100}%`, height: '100%', background: 'var(--accent-primary)' }}></div>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        )}

                        {type === 'savings' && (
                            <div className="flex flex-col gap-3 animate-fade-in" style={{ marginBottom: 12 }}>
                                {(() => {
                                    const total = data?.amount || 200;
                                    const breakdown = { 'Goal Contribution': total * 0.6, 'Round-ups': total * 0.3, 'Rewards': total * 0.1 };
                                    return Object.entries(breakdown).map(([cat, amount]) => (
                                        <div key={cat}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span>{cat}</span>
                                                <span className="font-bold text-success">${amount.toFixed(0)}</span>
                                            </div>
                                            <div style={{ height: 6, background: '#E6E6E0', borderRadius: 3, overflow: 'hidden' }}>
                                                <div style={{ width: `${(amount / total) * 100}%`, height: '100%', background: 'var(--success)' }}></div>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        )}
                    </EmbeddedChat>
                </div>
            </div>
        </Modal>
    );
}

function getStarters(type, data) {
    if (type === 'cycle') {
        return [
            { label: 'Why is my spend up?', query: 'Why is my spending higher in this cycle compared to last?' },
            { label: 'Can I save more?', query: 'How can I increase my savings for this pay cycle?' },
            { label: 'Optimize bills', query: 'Which bills can I potentially reduce or defer?' }
        ];
    }
    if (type === 'monthly') {
        return [
            { label: 'Compare to 2025', query: 'How does my current monthly spend compare to 2025 averages?' },
            { label: 'Budget for next month', query: 'Help me set up a realistic budget for next month based on this data.' },
            { label: 'Find hidden costs', query: 'Are there any recurring costs I can cut this month?' }
        ];
    }
    if (type === 'savings') {
        return [
            { label: 'Maximize interest', query: 'How can I earn more interest on these savings?' },
            { label: 'Short-term goals', query: 'Given these savings, what short-term goals can I set?' },
            { label: 'Automate more', query: 'How do I set up automatic round-ups for my spending?' }
        ];
    }

    // For specific categories
    if (!data?.category) {
        return [
            { label: 'Optimize this cycle', query: 'How can I optimize my spending for this specific pay cycle?' },
            { label: 'Show highest spending', query: 'Show me the top 3 highest spending categories for this period.' },
            { label: 'Compare to average', query: 'How does this cycle total compare to my historical average?' }
        ];
    }

    const category = data.category;
    const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);

    return [
        { label: 'Modify limits', query: 'I want to modify my spending limits.' },
        { label: `Show ${capitalizedCategory} transactions`, query: `Show me recent transactions in ${category}.` },
        { label: `Save in ${capitalizedCategory}`, query: `Give me 3 specific tips to reduce my spending in ${category}.` }
    ];
}
