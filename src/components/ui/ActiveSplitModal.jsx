import { Modal } from './Modal';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

export function ActiveSplitModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    // Mock Split Data
    const splitData = {
        title: 'IKEA Desk',
        total: 180.00,
        paid: 90.00,
        remaining: 90.00,
        installments: [
            { id: 1, date: 'Oct 14', amount: 45.00, status: 'paid' },
            { id: 2, date: 'Oct 28', amount: 45.00, status: 'upcoming' },
            { id: 3, date: 'Nov 11', amount: 45.00, status: 'upcoming' },
            { id: 4, date: 'Nov 25', amount: 45.00, status: 'upcoming' }
        ]
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col h-full" style={{ minHeight: '50vh' }}>
                <div className="mb-6">
                    <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Plan Details</h2>
                    <p className="text-muted text-sm">{splitData.title}</p>
                </div>

                {/* Progress Card */}
                <div className="card mb-6" style={{ background: 'var(--bg-card-hover)', border: 'none' }}>
                    <div className="flex justify-between mb-2 text-sm">
                        <span className="text-muted">Paid</span>
                        <span className="font-bold">${splitData.paid.toFixed(2)}</span>
                    </div>
                    <div style={{ height: 8, background: 'rgba(0,0,0,0.1)', borderRadius: 4, overflow: 'hidden', marginBottom: 2 }}>
                        <div style={{ width: '50%', background: 'var(--accent-primary)', height: '100%' }}></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted">
                        <span>${splitData.total.toFixed(2)} Total</span>
                        <span>${splitData.remaining.toFixed(2)} Left</span>
                    </div>
                </div>

                {/* Timeline */}
                <div className="flex flex-col gap-4">
                    {splitData.installments.map((inst, idx) => (
                        <div key={inst.id} className="flex items-center gap-4">
                            <div style={{
                                width: 32, height: 32,
                                borderRadius: '50%',
                                background: inst.status === 'paid' ? 'var(--success)' : 'var(--bg-card-hover)',
                                color: inst.status === 'paid' ? 'white' : 'var(--text-muted)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.8rem',
                                zIndex: 1
                            }}>
                                {inst.status === 'paid' ? <CheckCircle size={16} /> : idx + 1}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className={`text-sm ${inst.status === 'paid' ? 'text-muted line-through' : 'font-bold'}`}>
                                    ${inst.amount.toFixed(2)}
                                </div>
                                <div className="text-xs text-muted">
                                    {inst.status === 'paid' ? `Paid on ${inst.date}` : `Due ${inst.date}`}
                                </div>
                            </div>
                            {inst.status === 'upcoming' && idx === 1 && (
                                <span className="text-xs py-1 px-2 rounded-full bg-accent text-white" style={{ background: 'var(--accent-primary)' }}>
                                    Next
                                </span>
                            )}
                        </div>
                    ))}
                    {/* Connector Line Hack */}
                    <div style={{
                        position: 'absolute',
                        left: 40, // Adjust based on padding
                        top: 180,
                        bottom: 100,
                        width: 2,
                        background: 'var(--bg-card-hover)',
                        zIndex: 0
                    }}></div>
                </div>
            </div>
        </Modal>
    );
}
