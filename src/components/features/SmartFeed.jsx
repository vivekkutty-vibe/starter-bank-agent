import { useState } from 'react';
import { useUser } from '../../lib/UserContext';
import { ConversationModal } from '../../components/ui/ConversationModal';
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export function SmartFeed() {
    const { state, removeOffer } = useUser();
    const [selectedOffer, setSelectedOffer] = useState(null);

    // Sort widgets by priority (descending) - Create copy to avoid mutation
    const widgets = [...(state.offers || [])].sort((a, b) => (b.priority || 0) - (a.priority || 0));

    if (widgets.length === 0) {
        return (
            <div>
                <div className="card flex flex-col items-center justify-center text-center py-8 mx-4" style={{ marginTop: 'var(--space-6)' }}>
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
            </div>
        );
    }

    return (
        <>
            <div>
                <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-4)', padding: '0 var(--space-4)' }}>
                    <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Smart Feed</h2>
                    <span className="text-sm text-accent">{widgets.length} Updates</span>
                </div>

                {/* Carousel Container */}
                <div style={{
                    display: 'flex',
                    gap: 'var(--space-4)',
                    overflowX: 'auto',
                    padding: '0 var(--space-4) var(--space-6)',
                    scrollSnapType: 'x mandatory',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}>
                    <style>{`div::-webkit-scrollbar { display: none; }`}</style>

                    {widgets.map(offer => (
                        <div key={offer.id}
                            onClick={() => setSelectedOffer(offer)}
                            className="card"
                            style={{
                                minWidth: '280px',
                                scrollSnapAlign: 'center',
                                cursor: 'pointer',
                                borderLeft: `4px solid ${offer.type === 'alert' ? 'var(--danger)' : 'var(--accent-primary)'}`
                            }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div style={{
                                    padding: 6,
                                    borderRadius: '50%',
                                    background: 'var(--bg-card-hover)',
                                    color: 'var(--text-primary)'
                                }}>
                                    {offer.widgetType === 'chart' ? <TrendingUp size={18} /> :
                                        offer.widgetType === 'progress' ? <AlertCircle size={18} /> :
                                            <CheckCircle size={18} />}
                                </div>
                                <span className="text-xs text-muted">Tap to view</span>
                            </div>

                            <h3 style={{ fontSize: '1rem', margin: '0 0 8px' }}>{offer.title}</h3>
                            <p className="text-sm text-muted" style={{ margin: 0, height: '2.5em', overflow: 'hidden' }}>
                                {offer.description}
                            </p>

                            {/* Widget Visuals */}
                            <div style={{ marginTop: 16 }}>
                                {offer.widgetType === 'chart' && (
                                    <div className="flex items-end gap-1 h-8">
                                        {offer.chartData.map((val, i) => (
                                            <div key={i} style={{
                                                flex: 1,
                                                background: i === offer.chartData.length - 1 ? 'var(--accent-primary)' : 'var(--bg-card-hover)',
                                                height: `${(val / 150) * 100}%`,
                                                borderRadius: 2
                                            }} />
                                        ))}
                                    </div>
                                )}

                                {offer.widgetType === 'progress' && (
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span>${offer.current}</span>
                                            <span className="text-muted">Limit: ${offer.limit}</span>
                                        </div>
                                        <div style={{ height: 6, background: 'var(--bg-card-hover)', borderRadius: 3, overflow: 'hidden' }}>
                                            <div style={{ width: '100%', background: 'var(--danger)', height: '100%' }} />
                                        </div>
                                    </div>
                                )}

                                {offer.widgetType === 'stat' && (
                                    <div className="flex items-center gap-2 text-success font-bold text-sm">
                                        <TrendingUp size={16} /> Potential Savings: ${offer.savings}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ConversationModal
                offer={selectedOffer}
                onClose={() => setSelectedOffer(null)}
                onActionComplete={removeOffer}
            />
        </>
    );
}


