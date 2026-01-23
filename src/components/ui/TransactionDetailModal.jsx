import { Modal } from './Modal';
import { AlertTriangle, Split, BadgeDollarSign, Receipt } from 'lucide-react';

export function TransactionDetailModal({ transaction, onClose }) {
    if (!transaction) return null;

    const canSplit = transaction.amount > 50;

    return (
        <Modal isOpen={!!transaction} onClose={onClose}>
            <div className="flex flex-col h-full" style={{ minHeight: '60vh' }}>
                {/* Header with Amount */}
                <div className="text-center mb-8 mt-4">
                    <div style={{
                        width: 64, height: 64,
                        background: 'var(--bg-card-hover)',
                        borderRadius: '50%',
                        margin: '0 auto 16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2rem'
                    }}>
                        {transaction.category === 'dining' ? '☕️' :
                            transaction.category === 'transport' ? '🚗' :
                                transaction.category === 'groceries' ? '🛒' : '📄'}
                    </div>
                    <div className="text-2xl font-bold mb-1">
                        -${transaction.amount.toFixed(2)}
                    </div>
                    <div className="text-lg text-muted">{transaction.title}</div>
                    <div className="text-sm text-muted mt-1">{transaction.date}</div>
                </div>

                {/* Details List */}
                <div className="flex flex-col gap-4 mb-4">
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-muted">Status</span>
                        <span className="font-bold">Completed</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-muted">Category</span>
                        <span className="capitalize">{transaction.category}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-muted">Merchant Info</span>
                        <span>London, UK</span>
                    </div>
                </div>

                {/* Large Spacer to force separation */}
                <div style={{ height: '32px', flexShrink: 0 }}></div>

                {/* CTAs */}
                <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col gap-3">
                    {canSplit && (
                        <button className="btn btn-primary flex items-center justify-center gap-2"
                            onClick={() => alert('Pay in 4 Flow Triggered (Mock)')}>
                            <Split size={18} /> Pay in 4 installments
                        </button>
                    )}

                    <button className="btn btn-ghost flex items-center justify-center gap-2 text-danger"
                        onClick={() => alert('Dispute Flow Triggered (Mock)')}>
                        <AlertTriangle size={18} /> Dispute Transaction
                    </button>
                </div>
            </div>
        </Modal>
    );
}
