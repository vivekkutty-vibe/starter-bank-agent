import { Modal } from './Modal';
import { AlertTriangle, Split, BadgeDollarSign, Receipt, Check } from 'lucide-react';

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

                {/* Details Card */}
                <div className="card" style={{ marginBottom: '24px', padding: '20px' }}>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-muted text-sm">Amount</span>
                        <span className="font-bold text-lg">-${transaction.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-muted text-sm">Category</span>
                        <span className="font-bold" style={{ textTransform: 'capitalize' }}>{transaction.category}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-muted text-sm">Date</span>
                        <span className="font-bold">{transaction.date}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                        <span className="text-muted text-sm">Status</span>
                        <span className="flex items-center gap-1.5 font-bold text-success">
                            <Check size={14} /> Completed
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                    <div className="text-xs text-muted font-bold uppercase tracking-wider mb-2">Merchant Info</div>
                    <div className="text-sm font-medium">London, UK</div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-3 mt-auto">
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
