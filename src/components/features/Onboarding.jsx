import { useState } from 'react';
import { useUser } from '../../lib/UserContext';
import { ArrowRight, Check, DollarSign, Calendar, Target, Home, Zap } from 'lucide-react';

export function Onboarding() {
    const [step, setStep] = useState(0);
    const [error, setError] = useState('');
    const { state, updateFinancials, completeOnboarding } = useUser();

    const [formData, setFormData] = useState({
        payFrequency: 'biweekly',
        nextPayDate: '',
        payAmount: 3200,
        overallLimit: 2400,
        rentAmount: '1200',
        utilityAmount: '150',
        netflixAmount: '15.99',
        diningLimit: '300',
        shoppingLimit: '200',
        transportLimit: '150',
        groceriesLimit: '400',
        travelLimit: '0',
        entertainmentLimit: '50'
    });

    const handleNext = () => {
        setError('');
        // Validation for Income Step
        if (step === 1 && !formData.nextPayDate) {
            setError('Please select your next payday to continue.');
            return;
        }

        if (step === 3) {
            const totalCatLimit =
                Number(formData.diningLimit) +
                Number(formData.shoppingLimit) +
                Number(formData.groceriesLimit) +
                Number(formData.transportLimit) +
                Number(formData.entertainmentLimit) +
                Number(formData.travelLimit);

            if (totalCatLimit > Number(formData.overallLimit)) {
                setError('The sum of your category limits ($' + totalCatLimit + ') exceeds your overall budget ($' + formData.overallLimit + '). Please review your targets.');
                return;
            }

            // Save data
            updateFinancials({
                payFrequency: formData.payFrequency,
                nextPayDate: formData.nextPayDate,
                incomeAmount: Number(formData.payAmount),
                overallCycleLimit: Number(formData.overallLimit),
                fixedExpenses: [
                    { id: 'rent', name: 'Rent', amount: Number(formData.rentAmount) },
                    { id: 'utilities', name: 'Utilities', amount: Number(formData.utilityAmount) },
                    { id: 'netflix', name: 'Netflix', amount: Number(formData.netflixAmount) }
                ],
                categoryLimits: {
                    dining: Number(formData.diningLimit),
                    shopping: Number(formData.shoppingLimit),
                    transport: Number(formData.transportLimit),
                    groceries: Number(formData.groceriesLimit),
                    travel: Number(formData.travelLimit),
                    entertainment: Number(formData.entertainmentLimit)
                },
                dailyTarget: Number(formData.overallLimit / 30)
            });
            completeOnboarding();
        } else {
            setStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setError('');
        setStep(prev => Math.max(0, prev - 1));
    };

    const steps = [
        <WelcomeStep />,
        <IncomeStep data={formData} update={setFormData} error={error} transactions={state.transactions} />,
        <ExpensesStep data={formData} update={setFormData} />,
        <GoalsStep data={formData} update={setFormData} />
    ];

    return (
        <div style={{
            height: '100svh',
            display: 'flex',
            flexDirection: 'column',
            padding: 'var(--space-6)',
            maxWidth: 480,
            margin: '0 auto',
            overflow: 'hidden'
        }}>
            {/* Progress Bar */}
            <div style={{ marginBottom: 'var(--space-6)', display: 'flex', gap: 4 }}>
                {[0, 1, 2, 3].map(i => (
                    <div key={i} style={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        background: i <= step ? 'var(--accent-primary)' : 'var(--bg-card-hover)',
                        transition: 'background var(--transition-normal)'
                    }} />
                ))}
            </div>

            <div className="animate-fade-in" style={{
                flex: 1,
                overflowY: 'auto',
                paddingBottom: 20,
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch'
            }}>
                <style>{`
                    .animate-fade-in::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                {steps[step]}
            </div>

            <div style={{
                display: 'flex',
                gap: 12,
                marginTop: 'auto',
                paddingTop: 'var(--space-4)',
                background: 'var(--bg-app)',
                boxShadow: '0 -10px 20px -5px var(--bg-app)'
            }}>
                {step > 0 && (
                    <button onClick={handleBack} className="btn" style={{
                        flex: 0.5,
                        background: 'var(--bg-card-hover)',
                        border: '1px solid #E6E6E0'
                    }}>
                        Back
                    </button>
                )}
                <button onClick={handleNext} className="btn btn-primary" style={{ flex: 1 }}>
                    {step === 3 ? 'Finish Setup' : 'Continue'} <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
}

function WelcomeStep() {
    return (
        <div style={{ textAlign: 'center', marginTop: '10vh' }}>
            <div style={{
                width: 72, height: 72,
                background: 'var(--bg-card)',
                borderRadius: '50%',
                margin: '0 auto var(--space-4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid var(--accent-glow)',
                boxShadow: '0 0 30px var(--accent-glow)'
            }}>
                <div style={{ fontSize: '1.75rem' }}>👋</div>
            </div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-2)' }}>Hi, Alex</h1>
            <p className="text-muted" style={{ fontSize: '1rem', lineHeight: 1.6 }}>
                I'm your new banking agent. I can help you find cash, manage bills, and grow your savings.
                <br /><br />
                Let's get you set up in 60 seconds.
            </p>
        </div>
    );
}

function IncomeStep({ data, update, error }) {
    const showSearch = data.nextPayDate !== '';

    // For this example, we show these various candidates with realistic bank strings
    const candidates = [
        {
            id: 101,
            title: 'BAC/S 7829-PAYROLL P01',
            amount: 3205.42,
            isLikelySalary: true,
            note: 'Recurring: Detected monthly for 12 months'
        },
        {
            id: 102,
            title: 'TFR: STRIPE-PAYOUT-REF92',
            amount: 450.00,
            isLikelySalary: false,
            note: 'Freelance / External transfer'
        },
        {
            id: 103,
            title: 'DEP: MOBILE CHECK DEP',
            amount: 150.00,
            isLikelySalary: false,
            note: 'One-time deposit'
        },
        {
            id: 104,
            title: 'ATM DEP: BRANCH 4492',
            amount: 80.00,
            isLikelySalary: false,
            note: 'Cash deposit'
        }
    ];

    return (
        <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-2)' }}>Income Details</h2>
            <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-6)' }}>Choose your next payday. I've found these transactions from your history that look like income.</p>

            <label style={{ display: 'block', marginBottom: 'var(--space-6)' }}>
                <span className="text-xs text-muted" style={{ display: 'block', marginBottom: 4 }}>Pay Frequency</span>
                <div className="flex gap-4">
                    {['biweekly', 'monthly'].map(freq => (
                        <button key={freq}
                            onClick={() => update({ ...data, payFrequency: freq })}
                            className="card"
                            style={{
                                flex: 1,
                                padding: 12,
                                textAlign: 'center',
                                borderColor: data.payFrequency === freq ? 'var(--accent-primary)' : 'rgba(230, 230, 224, 0.5)',
                                backgroundColor: data.payFrequency === freq ? 'rgba(45, 212, 191, 0.1)' : undefined
                            }}
                        >
                            {freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </button>
                    ))}
                </div>
            </label>

            <label style={{ display: 'block', marginBottom: 'var(--space-6)' }}>
                <span className="text-xs text-muted" style={{ display: 'block', marginBottom: 4 }}>Next Payday</span>
                <input
                    type="date"
                    value={data.nextPayDate}
                    onChange={(e) => update({ ...data, nextPayDate: e.target.value })}
                    required
                    style={{
                        width: '100%',
                        background: 'var(--bg-card)',
                        border: error ? '1px solid var(--danger)' : '1px solid rgba(230, 230, 224, 0.8)',
                        padding: 12,
                        borderRadius: 'var(--radius-md)',
                        fontSize: '1rem'
                    }}
                />
                {error && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: 8, margin: '8px 0 0' }}>{error}</p>}
            </label>

            {showSearch && (
                <div className="animate-fade-in">
                    <span className="text-xs text-muted" style={{ display: 'block', marginBottom: 8 }}>
                        Select Income Source
                    </span>
                    <div className="flex flex-col gap-3">
                        {candidates.map(tx => (
                            <div key={tx.id}
                                onClick={() => update({ ...data, payAmount: tx.amount })}
                                className="card"
                                style={{
                                    padding: '14px',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    border: data.payAmount === tx.amount ? '1px solid var(--accent-primary)' : '1px solid rgba(230, 230, 224, 0.5)',
                                    background: data.payAmount === tx.amount ? 'rgba(140, 106, 75, 0.05)' : 'white'
                                }}>
                                {tx.isLikelySalary && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        background: 'var(--accent-primary)',
                                        color: 'white',
                                        fontSize: '8px',
                                        padding: '2px 8px',
                                        borderBottomLeftRadius: '8px',
                                        fontWeight: 800,
                                        textTransform: 'uppercase'
                                    }}>
                                        Highly Likely
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            {tx.title}
                                            {tx.isLikelySalary && <Check size={12} className="text-success" />}
                                        </div>
                                        <div className="text-[10px] text-muted italic">{tx.note}</div>
                                    </div>
                                    <div className="font-bold text-accent" style={{ fontSize: '1rem' }}>${tx.amount}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function ExpensesStep({ data, update }) {
    return (
        <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-2)' }}>Fixed Expenses</h2>
            <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-6)' }}>Confirm your recurring bills. I'll set these aside automatically.</p>

            <div className="flex flex-col gap-3">
                <ExpenseRow
                    icon={<Home size={18} />}
                    label="Rent"
                    sub="Monthly ~ 1st"
                    value={data.rentAmount}
                    onChange={v => update({ ...data, rentAmount: v })}
                    color="#ff6347"
                />
                <ExpenseRow
                    icon={<Zap size={18} />}
                    label="Utilities"
                    sub="Avg Monthly"
                    value={data.utilityAmount}
                    onChange={v => update({ ...data, utilityAmount: v })}
                    color="#f59e0b"
                />
                <ExpenseRow
                    icon={<DollarSign size={18} />}
                    label="Netflix"
                    sub="Monthly ~ 15th"
                    value={data.netflixAmount}
                    onChange={v => update({ ...data, netflixAmount: v })}
                    color="#32c8ff"
                />
            </div>
        </div>
    );
}

function ExpenseRow({ icon, label, sub, value, onChange, color }) {
    return (
        <label className="card flex items-center justify-between" style={{ padding: 12, border: '1px solid rgba(230, 230, 224, 0.5)' }}>
            <div className="flex items-center gap-4">
                <div style={{ padding: 8, background: `${color}1A`, borderRadius: '50%', color: color, display: 'flex' }}>
                    {icon}
                </div>
                <div>
                    <div className="font-bold text-sm">{label}</div>
                    <div className="text-[10px] text-muted uppercase tracking-tight">{sub}</div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-muted text-xs">$</span>
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    style={{ width: 60, background: 'transparent', border: 'none', color: 'var(--text-primary)', textAlign: 'right', fontSize: '0.9rem', fontWeight: 600 }}
                />
            </div>
        </label>
    );
}

function GoalsStep({ data, update }) {
    const recommendedLimit = Math.round(data.payAmount * 0.75);
    const rawSavings = data.payAmount - data.overallLimit;
    // Round to nearest multiple of 5
    const savingsTarget = Math.round(rawSavings / 5) * 5;
    const savingsPercent = Math.round((savingsTarget / data.payAmount) * 100);

    return (
        <div className="modal-scroll-data" style={{ paddingBottom: '40px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-2)' }}>Set Targets</h2>
            <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-6)' }}>How much of your ${data.payAmount} income would you like to limit for spending?</p>

            <div style={{ marginBottom: 'var(--space-8)' }}>
                <LimitSlider
                    icon={<Target size={20} className="text-accent" />}
                    label="Overall Cycle Spending"
                    value={data.overallLimit}
                    onChange={v => update({ ...data, overallLimit: v })}
                    max={Math.round(data.payAmount)}
                    insight={`A target of $${recommendedLimit} (~75%) allows an approximate saving of $${savingsTarget} (25%).`}
                />

                <div className="card" style={{ background: 'var(--accent-glow)', border: 'none', marginTop: -12 }}>
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">Approximate Savings</span>
                        <span className="font-bold text-accent">${savingsTarget} ({savingsPercent}%)</span>
                    </div>
                </div>
            </div>

            <div style={{ borderTop: '1px solid #E6E6E0', paddingTop: 'var(--space-6)' }}>
                <p className="text-xs font-bold text-muted uppercase tracking-wider mb-4">Category Specifics (Optional)</p>
                <LimitSlider
                    icon={<Target size={16} color="#F472B6" />}
                    label="Dining & Drinks"
                    value={data.diningLimit}
                    onChange={v => update({ ...data, diningLimit: v })}
                    insight="Based on your history, $300 is healthy."
                />

                <LimitSlider
                    icon={<Target size={16} color="#ec4899" />}
                    label="Shopping"
                    value={data.shoppingLimit}
                    onChange={v => update({ ...data, shoppingLimit: v })}
                    insight="Avg spend is $205. $200 keeps you on track."
                />

                <LimitSlider
                    icon={<Target size={16} color="#f59e0b" />}
                    label="Groceries"
                    value={data.groceriesLimit}
                    onChange={v => update({ ...data, groceriesLimit: v })}
                    insight="Weekly shop averages $100. $400 is ideal."
                    max={800}
                />

                <LimitSlider
                    icon={<Target size={16} color="#3b82f6" />}
                    label="Transport"
                    value={data.transportLimit}
                    onChange={v => update({ ...data, transportLimit: v })}
                    insight="Includes Uber and Petrol. $150 covers your commute."
                />

                <LimitSlider
                    icon={<Target size={16} color="#8b5cf6" />}
                    label="Entertainment"
                    value={data.entertainmentLimit}
                    onChange={v => update({ ...data, entertainmentLimit: v })}
                    insight="Includes Netflix and Cinema. $50 keeps it fun."
                />

                <LimitSlider
                    icon={<Target size={16} color="#10b981" />}
                    label="Travel"
                    value={data.travelLimit}
                    onChange={v => update({ ...data, travelLimit: v })}
                    insight="Saving for a trip? Set a budget for your next holiday."
                />
            </div>
        </div>
    );
}

function LimitSlider({ icon, label, value, onChange, insight, max = 1000 }) {
    return (
        <div style={{ marginBottom: 'var(--space-6)' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: 12 }}>
                <span className="text-sm font-bold flex items-center gap-2">
                    {icon} {label}
                </span>
                <span className="text-accent font-bold">${value || 0}</span>
            </div>
            <input
                type="range"
                min="0" max={max} step="10"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
            />

            {insight && (
                <div className="card" style={{ background: 'var(--bg-card)', border: '1px dashed #E6E6E0', marginTop: 8, padding: '8px 12px' }}>
                    <p className="text-xs text-muted" style={{ lineHeight: 1.4, margin: 0 }}>
                        💡 {insight}
                    </p>
                </div>
            )}
        </div>
    );
}


