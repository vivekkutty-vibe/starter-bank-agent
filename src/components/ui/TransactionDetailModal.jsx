import { Modal } from './Modal';
import { AlertTriangle, Split, BadgeDollarSign, Receipt, Check } from 'lucide-react';

export function TransactionDetailModal({ transaction, onClose }) {
    if (!transaction) return null;

    const canSplit = transaction.amount > 50;
    const categoryColor = transaction.category === 'dining' ? '#F472B6' :
        transaction.category === 'transport' ? '#3B82F6' :
            transaction.category === 'groceries' ? '#F59E0B' : 'var(--accent-primary)';

    return (
        <Modal isOpen={!!transaction} onClose={onClose}>
            <div className="flex flex-col h-full animate-fade-in" style={{ minHeight: '65vh' }}>
                {/* Visual Identity Section */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: 72, height: 72,
                        background: `${categoryColor}15`,
                        borderRadius: '24px',
                        margin: '0 auto 16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2.5rem',
                        transform: 'rotate(-5deg)',
                        boxShadow: `0 8px 16px ${categoryColor}20`
                    }}>
                        {transaction.category === 'dining' ? '☕️' :
                            transaction.category === 'transport' ? '🚗' :
                                transaction.category === 'groceries' ? '🛒' : '📄'}
                    </div>
                    <div className="text-sm font-bold text-muted uppercase tracking-[0.2em]" style={{ marginBottom: 4 }}>
                        Transaction Detail
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{transaction.title}</div>
                </div>

                {/* Main Insight Card */}
                <div className="card" style={{
                    padding: '24px',
                    borderRadius: '24px',
                    background: 'white',
                    border: '1px solid #F1F1F0',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
                    marginBottom: '32px'
                }}>
                    <div className="flex flex-col gap-6">
                        {/* Status & Date */}
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Date & Time</span>
                                <span className="text-sm font-bold">{transaction.date} • 14:32</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-success rounded-full">
                                <Check size={14} strokeWidth={3} />
                                <span className="text-xs font-black uppercase">Cleared</span>
                            </div>
                        </div>

                        {/* Amount Section */}
                        <div style={{ borderTop: '1px solid #F1F1F0', paddingTop: '16px' }}>
                            <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Total Amount</span>
                            <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-3xl font-black">-${transaction.amount.toFixed(2)}</span>
                                <span className="text-xs text-muted font-bold">USD</span>
                            </div>
                        </div>

                        {/* Category & Merchant */}
                        <div style={{ borderTop: '1px solid #F1F1F0', paddingTop: '16px' }} className="flex justify-between">
                            <div>
                                <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Category</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: categoryColor }}></div>
                                    <span className="text-sm font-bold">
                                        {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                                    </span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Location</span>
                                <div className="text-sm font-bold mt-1">London, UK</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTAs */}
                <div className="mt-auto flex flex-col gap-3">
                    {canSplit && (
                        <button className="btn btn-primary"
                            style={{ padding: '16px', borderRadius: '16px', fontSize: '0.95rem' }}
                            onClick={() => alert('Pay in 4 Flow Triggered (Mock)')}>
                            <Split size={18} /> Enable Pay in 4
                        </button>
                    )}

                    <button className="btn btn-ghost"
                        style={{ padding: '12px', color: '#EF4444', borderRadius: '12px' }}
                        onClick={() => alert('Dispute Flow Triggered (Mock)')}>
                        <AlertTriangle size={16} /> Report a problem
                    </button>
                </div>
            </div>
        </Modal>
    );
}
