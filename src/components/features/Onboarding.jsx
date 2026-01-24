import { useState } from 'react';
import { useUser } from '../../lib/UserContext';
import { ArrowRight, Check, DollarSign, Calendar, Target, Home } from 'lucide-react';

export function Onboarding() {
    const [step, setStep] = useState(0);
    const { updateFinancials, completeOnboarding } = useUser();
    const [formData, setFormData] = useState({
        payFrequency: 'biweekly',
        nextPayDate: '',
        rentAmount: '1200',
        netflixAmount: '15.99',
        diningLimit: '300',
        shoppingLimit: '200',
        transportLimit: '150',
        groceriesLimit: '400',
        travelLimit: '0',
        entertainmentLimit: '50'
    });

    const handleNext = () => {
        // Validation for Income Step
        if (step === 1 && !formData.nextPayDate) {
            alert('Please select your next payday to continue.');
            return;
        }

        if (step === 3) {
            // Save data
            updateFinancials({
                payFrequency: formData.payFrequency,
                nextPayDate: formData.nextPayDate,
                fixedExpenses: [
                    { id: 'rent', name: 'Rent', amount: Number(formData.rentAmount) },
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
                dailyTarget: Number(formData.dailyTarget || 30)
            });
            completeOnboarding();
        } else {
            setStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setStep(prev => Math.max(0, prev - 1));
    };

    const steps = [
        <WelcomeStep />,
        <IncomeStep data={formData} update={setFormData} />,
        <ExpensesStep data={formData} update={setFormData} />,
        <GoalsStep data={formData} update={setFormData} />
    ];

    return (
        <div style={{
            height: '100svh', // Use svh for better mobile support
            display: 'flex',
            flexDirection: 'column',
            padding: 'var(--space-6)',
            maxWidth: 480,
            margin: '0 auto',
            overflow: 'hidden' // Prevent entire screen from scrolling if contents fit
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
                // Hide scrollbar but keep scrollable
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
                background: 'var(--bg-app)', // Cover content when scrolling behind
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

function AgentsStep() {
    const { state } = useUser();
    const agents = Object.values(state.agents || {});

    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>Meet Your Frugal Team</h2>
            <p className="text-muted" style={{ marginBottom: 'var(--space-8)' }}>
                These 7 specialized agents work 24/7 to keep you in the green.
            </p>

            <div className="grid grid-cols-1 gap-3" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                {agents.map((agent, idx) => (
                    <div key={idx} className="card flex items-center gap-4 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                        <div style={{
                            width: 40, height: 40,
                            background: agent.color,
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.2rem',
                            color: 'white',
                            boxShadow: `0 2px 8px ${agent.color}40`
                        }}>
                            {agent.avatar}
                        </div>
                        <div>
                            <div className="font-bold">{agent.name}</div>
                            <div className="text-xs text-muted">{agent.role}</div>
                        </div>
                    </div>
                ))}
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

function IncomeStep({ data, update }) {
    return (
        <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-2)' }}>Income Details</h2>
            <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-6)' }}>Knowing when you get paid helps me calculate your "Safe to Spend" amount.</p>

            <label style={{ display: 'block', marginBottom: 'var(--space-4)' }}>
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

            <label style={{ display: 'block' }}>
                <span className="text-xs text-muted" style={{ display: 'block', marginBottom: 4 }}>Next Payday</span>
                <input
                    type="date"
                    value={data.nextPayDate}
                    onChange={(e) => update({ ...data, nextPayDate: e.target.value })}
                    required
                    style={{
                        width: '100%',
                        background: 'var(--bg-card)',
                        border: '1px solid rgba(230, 230, 224, 0.8)',
                        padding: 12,
                        borderRadius: 'var(--radius-md)',
                        fontSize: '1rem'
                    }}
                />
            </label>
        </div>
    );
}

function ExpensesStep({ data, update }) {
    return (
        <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-2)' }}>Fixed Expenses</h2>
            <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-6)' }}>I've identified these recurring bills from your history. Are these correct?</p>

            <div className="flex flex-col gap-3">
                <label className="card flex items-center justify-between" style={{ padding: 10, border: '1px solid rgba(230, 230, 224, 0.5)' }}>
                    <div className="flex items-center gap-3">
                        <div style={{ padding: 6, background: 'rgba(255, 99, 71, 0.1)', borderRadius: '50%', color: '#ff6347', display: 'flex' }}>
                            <Home size={16} />
                        </div>
                        <div>
                            <div className="font-bold text-sm">Rent</div>
                            <div className="text-[10px] text-muted uppercase tracking-tight">Monthly ~ 1st</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-muted text-xs">$</span>
                        <input
                            type="number"
                            value={data.rentAmount}
                            onChange={(e) => update({ ...data, rentAmount: e.target.value })}
                            style={{ width: 60, background: 'transparent', border: 'none', color: 'var(--text-primary)', textAlign: 'right', fontSize: '0.9rem', fontWeight: 600 }}
                        />
                    </div>
                </label>

                <label className="card flex items-center justify-between" style={{ padding: 10, border: '1px solid rgba(230, 230, 224, 0.5)' }}>
                    <div className="flex items-center gap-3">
                        <div style={{ padding: 6, background: 'rgba(50, 200, 255, 0.1)', borderRadius: '50%', color: '#32c8ff', display: 'flex' }}>
                            <DollarSign size={16} />
                        </div>
                        <div>
                            <div className="font-bold text-sm">Netflix</div>
                            <div className="text-[10px] text-muted uppercase tracking-tight">Monthly ~ 15th</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-muted text-xs">$</span>
                        <input
                            type="number"
                            value={data.netflixAmount}
                            onChange={(e) => update({ ...data, netflixAmount: e.target.value })}
                            style={{ width: 60, background: 'transparent', border: 'none', color: 'var(--text-primary)', textAlign: 'right', fontSize: '0.9rem', fontWeight: 600 }}
                        />
                    </div>
                </label>
            </div>
        </div>
    );
}

function GoalsStep({ data, update }) {
    return (
        <div className="modal-scroll-data">
            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-2)' }}>Set Targets</h2>
            <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-6)' }}>Set limits for your key spending categories.</p>

            <LimitSlider
                icon={<Target size={16} className="text-accent" />}
                label="Dining & Drinks"
                value={data.diningLimit}
                onChange={v => update({ ...data, diningLimit: v })}
                insight="Based on your income, a $300 limit is healthy."
            />

            <LimitSlider
                icon={<Target size={16} color="#ec4899" />}
                label="Shopping"
                value={data.shoppingLimit}
                onChange={v => update({ ...data, shoppingLimit: v })}
                insight="You spent $205 last month. $200 keeps you on track."
            />

            <LimitSlider
                icon={<Target size={16} color="#f59e0b" />}
                label="Groceries"
                value={data.groceriesLimit}
                onChange={v => update({ ...data, groceriesLimit: v })}
                insight="Avg family spend is $400. Cooking more saves dining costs."
                max={800}
            />

            <LimitSlider
                icon={<Target size={16} color="#3b82f6" />}
                label="Transport"
                value={data.transportLimit}
                onChange={v => update({ ...data, transportLimit: v })}
                insight="Includes Gas & Uber. $150 covers your commute."
            />

            <LimitSlider
                icon={<Target size={16} color="#8b5cf6" />}
                label="Entertainment"
                value={data.entertainmentLimit}
                onChange={v => update({ ...data, entertainmentLimit: v })}
                insight="Netflix is included here ($15.99). $50 gives room for more."
            />

            <LimitSlider
                icon={<Target size={16} color="#10b981" />}
                label="Travel"
                value={data.travelLimit}
                onChange={v => update({ ...data, travelLimit: v })}
                insight="Set aside $0 if no trips planned, or save up!"
            />
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

