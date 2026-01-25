import { useState } from 'react';
import { useUser } from '../../lib/UserContext';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Calendar, Repeat } from 'lucide-react';
import { ActiveSplitModal } from '../../components/ui/ActiveSplitModal';
import { TransactionDetailModal } from '../../components/ui/TransactionDetailModal';

export function Wallet() {
    const { state } = useUser();
    const [selectedTx, setSelectedTx] = useState(null);
    const [showSplitDetails, setShowSplitDetails] = useState(false);

    return (
        <div className="container">
            <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-6)' }}>Wallet</h1>

            {/* Virtual Card */}
            <div className="card" style={{
                background: 'linear-gradient(135deg, var(--accent-primary), #6366F1)',
                color: 'white',
                height: 200,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: 'none',
                boxShadow: '0 10px 25px -5px rgba(30, 64, 175, 0.4)',
                marginBottom: 'var(--space-8)'
            }}>
                <div className="flex justify-between items-start">
                    <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>AgentBank Debit</span>
                    <CreditCard color="white" opacity={0.8} />
                </div>
                <div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                        $842.00
                    </div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: 4 }}>Available Balance</div>
                </div>
                <div className="flex justify-between items-end">
                    <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '0.1em' }}>•••• 4921</span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>EXP 12/28</span>
                </div>
            </div>

            {/* Pay Over Time Section */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h2 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-4)' }}>Active Splits</h2>
                <div className="card flex items-center gap-4"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowSplitDetails(true)}
                >
                    <div style={{
                        width: 40, height: 40,
                        borderRadius: '50%',
                        background: 'rgba(56, 189, 248, 0.1)',
                        color: 'var(--accent-secondary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Repeat size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div className="font-bold">IKEA Desk</div>
                        <div className="text-xs text-muted">2 of 4 payments remaining</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div className="font-bold">$45.00</div>
                        <div className="text-xs text-muted">Due Oct 28</div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div>
                <h2 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-4)' }}>Recent Activity</h2>
                <div className="flex flex-col gap-3">
                    {state.transactions.map(tx => (
                        <div key={tx.id}
                            className="card flex items-center justify-between"
                            style={{ padding: 'var(--space-3)', cursor: 'pointer' }}
                            onClick={() => setSelectedTx(tx)}
                        >
                            <div className="flex items-center gap-4">
                                <div style={{
                                    width: 36, height: 36,
                                    borderRadius: '50%',
                                    background: 'var(--bg-card-hover)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.9rem'
                                }}>
                                    {/* Fallback icon strategy */}
                                    {tx.category === 'dining' ? '☕️' :
                                        tx.category === 'transport' ? '🚗' :
                                            tx.category === 'groceries' ? '🛒' :
                                                '📄'}
                                </div>
                                <div>
                                    <div className="font-bold" style={{ fontSize: '13px' }}>{tx.title}</div>
                                    <div className="text-muted" style={{ fontSize: '10px' }}>{tx.date}</div>
                                </div>
                            </div>
                            <div className="font-bold">
                                -${tx.amount.toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <TransactionDetailModal
                transaction={selectedTx}
                onClose={() => setSelectedTx(null)}
            />

            <ActiveSplitModal
                isOpen={showSplitDetails}
                onClose={() => setShowSplitDetails(false)}
            />
        </div>
    );
}
