import { useState } from 'react';
import { useUser } from '../../lib/UserContext';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { ConversationModal } from '../../components/ui/ConversationModal';
import { VisualInsightModal } from '../../components/ui/VisualInsightModal';

export function Insights() {
    const { state, removeOffer } = useUser();
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [visualModal, setVisualModal] = useState({ isOpen: false, type: null });
    const [timeRange, setTimeRange] = useState('this_month');

    // Sort widgets: Alert > Split > Reward
    const offers = [...(state.offers || [])].sort((a, b) => (b.priority || 0) - (a.priority || 0));

    // Filter transactions based on timeRange
    const filteredTransactions = state.transactions.filter(tx => {
        const [year, month] = tx.date.split('-');
        if (timeRange === 'this_month') {
            return month === '01' && year === '2026'; // Jan 2026
        } else {
            return month === '12' && year === '2025'; // Dec 2025
        }
    });

    // Dynamic Data Calculation
    const totalSpent = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

    const spendingByCategory = filteredTransactions.reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
    }, {});

    const topCategoryEntry = Object.entries(spendingByCategory).sort((a, b) => b[1] - a[1])[0];
    const topCategoryName = topCategoryEntry ? topCategoryEntry[0] : 'None';
    const topCategoryAmount = topCategoryEntry ? topCategoryEntry[1] : 0;

    const openVisual = (type, data = null) => {
        setVisualModal({ isOpen: true, type, data });
    };

    return (
        <div className="container" style={{ paddingBottom: 100 }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-6)' }}>Insights</h1>

            {/* Interactive Summary Cards */}
            <div className="flex gap-4" style={{ marginBottom: 'var(--space-6)' }}>
                {/* Total Spent */}
                <div
                    className="card clickable hover:bg-gray-50 transition-colors cursor-pointer"
                    style={{ flex: 1 }}
                    onClick={() => openVisual('monthly')}
                >
                    <div className="text-xs" style={{ marginBottom: 'var(--space-4)', color: 'var(--text-secondary)' }}>Total Spent</div>
                    <div className="text-xl font-bold" style={{ marginBottom: 'var(--space-3)' }}>${totalSpent.toFixed(0)}</div>
                    <div className="text-xs text-success flex items-center gap-1">
                        <TrendingDown size={12} /> 12% vs last month
                    </div>
                </div>

                {/* Top Category */}
                <div
                    className="card clickable hover:bg-gray-50 transition-colors cursor-pointer"
                    style={{ flex: 1 }}
                    onClick={() => openVisual('category')}
                >
                    <div className="text-xs flex justify-between" style={{ marginBottom: 'var(--space-4)', color: 'var(--text-secondary)' }}>
                        <span>Top Category</span>
                        <span className="opacity-50 text-[10px]">THIS MONTH</span>
                    </div>
                    <div className="text-xl font-bold" style={{ textTransform: 'capitalize', marginBottom: 'var(--space-3)' }}>
                        {topCategoryName}
                    </div>
                    <div className="text-xs text-danger flex items-center gap-1">
                        <TrendingUp size={12} /> ${topCategoryAmount.toFixed(0)}
                    </div>
                </div>
            </div>

            {/* Pay Cycle Comparison Chart (Restored & Fixed) */}
            <div className="card no-hover" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="flex justify-between items-end" style={{ marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Pay Cycle Comparison</h3>
                    <span className="text-sm font-bold text-muted">Biweekly</span>
                </div>
                {/* Legend */}
                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '24px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    <div className="flex items-center gap-2">
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)' }}></div>
                        <span>Spent</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }}></div>
                        <span>Saved</span>
                    </div>
                </div>
                <div className="flex items-end gap-4" style={{ height: 140, alignItems: 'flex-end' }}>
                    {/* Last Cycle */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 4, height: '100px' }}>
                            <div
                                className="flex flex-col items-center interactive-bar"
                                style={{ width: '50%', height: '100%', justifyContent: 'flex-end' }}
                                onClick={() => openVisual('category', { cycle: 'Oct 1-14', amount: 1920, type: 'spend' })}
                            >
                                <span className="mb-1 font-bold text-muted" style={{ fontSize: '11px' }}>$1920</span>
                                <div style={{ width: '100%', background: 'var(--accent-primary)', borderRadius: '4px 4px 0 0', height: '90%' }} title="Spent"></div>
                            </div>
                            <div
                                className="flex flex-col items-center interactive-bar"
                                style={{ width: '50%', height: '100%', justifyContent: 'flex-end' }}
                                onClick={() => openVisual('savings', { cycle: 'Oct 1-14', amount: 50, type: 'save' })}
                            >
                                <span className="mb-1 font-bold text-muted" style={{ fontSize: '11px' }}>$50</span>
                                <div style={{ width: '100%', background: 'var(--success)', borderRadius: '4px 4px 0 0', height: '10%' }} title="Saved"></div>
                            </div>
                        </div>
                        <span className="text-xs text-center text-muted">Oct 1-14</span>
                    </div>
                    {/* This Cycle */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 4, height: '100px' }}>
                            <div
                                className="flex flex-col items-center interactive-bar"
                                style={{ width: '50%', height: '100%', justifyContent: 'flex-end' }}
                                onClick={() => openVisual('category', { cycle: 'Oct 15-28', amount: 840, type: 'spend' })}
                            >
                                <span className="mb-1 font-bold text-primary" style={{ fontSize: '11px' }}>$840</span>
                                <div style={{ width: '100%', background: 'var(--accent-primary)', borderRadius: '4px 4px 0 0', height: '50%' }} title="Spent"></div>
                            </div>
                            <div
                                className="flex flex-col items-center interactive-bar"
                                style={{ width: '50%', height: '100%', justifyContent: 'flex-end' }}
                                onClick={() => openVisual('savings', { cycle: 'Oct 15-28', amount: 400, type: 'save' })}
                            >
                                <span className="mb-1 font-bold text-success" style={{ fontSize: '11px' }}>$400</span>
                                <div style={{ width: '100%', background: 'var(--success)', borderRadius: '4px 4px 0 0', height: '30%', opacity: 1 }} title="Saved"></div>
                            </div>
                        </div>
                        <span className="text-xs text-center font-bold">Oct 15-28</span>
                    </div>
                </div>
                <div className="text-xs text-center font-medium" style={{ marginTop: 'var(--space-8)', color: 'var(--text-secondary)' }}>
                    Last cycle included Rent ($1200), impacting savings.
                </div>
            </div>

            {/* Spending Breakdown Preview (Simplified) */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-6)' }}>
                    <h3 style={{ fontSize: '1rem', margin: 0 }}>Category Breakdown</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setTimeRange('this_month')}
                            style={{
                                padding: '4px 12px',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                borderRadius: '999px',
                                border: timeRange === 'this_month' ? '1px solid black' : '1px solid #e5e7eb',
                                background: timeRange === 'this_month' ? 'black' : 'transparent',
                                color: timeRange === 'this_month' ? 'white' : '#6b7280',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            This Month
                        </button>
                        <button
                            onClick={() => setTimeRange('last_month')}
                            style={{
                                padding: '4px 12px',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                borderRadius: '999px',
                                border: timeRange === 'last_month' ? '1px solid black' : '1px solid #e5e7eb',
                                background: timeRange === 'last_month' ? 'black' : 'transparent',
                                color: timeRange === 'last_month' ? 'white' : '#6b7280',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            Last Month
                        </button>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    {Object.entries(spendingByCategory)
                        .sort((a, b) => b[1] - a[1]) // Sort by amount descending
                        .slice(0, 3)
                        .map(([cat, amount]) => {
                            const limit = state.financials.categoryLimits[cat] || 500;
                            const percent = Math.min((amount / limit) * 100, 100);
                            return (
                                <div key={cat}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span style={{ textTransform: 'capitalize' }}>{cat}</span>
                                        <span className="font-bold">${amount.toFixed(0)}</span>
                                    </div>
                                    <div style={{ height: 6, background: 'var(--bg-card-hover)', borderRadius: 4, overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${percent}%`,
                                            height: '100%',
                                            background: cat === 'dining' ? '#F472B6' : 'var(--accent-primary)',
                                            borderRadius: 4
                                        }}></div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <button
                    className="btn btn-ghost"
                    style={{
                        width: '100%',
                        marginTop: '24px',
                        borderRadius: '999px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        border: '1px solid var(--bg-card-hover)'
                    }}
                    onClick={() => openVisual('category')}
                >
                    View All Categories
                </button>
            </div>

            {/* Agent Recommendations */}
            <h2 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-4)' }}>Opportunities</h2>
            {offers.length === 0 ? (
                <div className="card flex flex-col items-center justify-center text-center py-8">
                    <div style={{
                        width: 48, height: 48,
                        borderRadius: '50%',
                        background: 'var(--success)',
                        color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: 'var(--space-4)',
                        boxShadow: '0 4px 12px rgba(52, 211, 153, 0.3)'
                    }}>
                        <CheckCircle size={24} color="white" />
                    </div>
                    <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>You're all caught up!</h3>
                    <p className="text-sm text-muted">No new insights or alerts for now.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {offers.map(offer => (
                        <div key={offer.id} className="card" style={{ borderLeft: `3px solid ${offer.type === 'split' ? 'var(--accent-secondary)' : offer.type === 'alert' ? 'var(--danger)' : 'var(--success)'}` }}>
                            <div className="flex justify-between items-start">
                                <h3 style={{ margin: 0, fontSize: '1rem' }}>{offer.title}</h3>
                                <span className="text-xs py-1 px-2 rounded-full" style={{ background: 'var(--bg-card-hover)', textTransform: 'capitalize' }}>
                                    {offer.type === 'split' ? 'Cashflow' : offer.type === 'alert' ? 'Alert' : 'Reward'}
                                </span>
                            </div>
                            <p className="text-sm text-muted" style={{ margin: '8px 0' }}>{offer.description}</p>
                            {offer.type === 'reward' && (
                                <div className="text-sm font-bold text-success">
                                    Potential Savings: ${offer.savings.toFixed(2)}
                                </div>
                            )}
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: 12 }}
                                onClick={() => setSelectedOffer(offer)}
                            >
                                {offer.type === 'split' ? 'View Option' :
                                    offer.type === 'alert' ? 'Resolve Issue' :
                                        'Activate Offer'}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Conversation Modal (Action) */}
            <ConversationModal
                offer={selectedOffer}
                onClose={() => setSelectedOffer(null)}
                onActionComplete={removeOffer}
            />

            {/* Visual Insight Modal (Data View) */}
            <VisualInsightModal
                isOpen={visualModal.isOpen}
                onClose={() => setVisualModal({ ...visualModal, isOpen: false })}
                type={visualModal.type}
                data={visualModal.data}
            />
        </div>
    );
}
