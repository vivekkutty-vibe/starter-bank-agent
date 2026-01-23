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

    const steps = [
        <WelcomeStep />,
        <IncomeStep data={formData} update={setFormData} />,
        <ExpensesStep data={formData} update={setFormData} />,
        <GoalsStep data={formData} update={setFormData} />
    ];

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            padding: 'var(--space-6)',
            maxWidth: 480,
            margin: '0 auto',
            justifyContent: 'center'
        }}>
            {/* Progress Bar */}
            <div style={{ marginBottom: 'var(--space-8)', display: 'flex', gap: 4 }}>
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

            <div className="animate-fade-in" style={{ flex: 1 }}>
                {steps[step]}
            </div>

            <button onClick={handleNext} className="btn btn-primary" style={{ marginTop: 'auto', width: '100%' }}>
                {step === 4 ? 'Finish Setup' : 'Continue'} <ArrowRight size={18} />
            </button>
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
        <div style={{ textAlign: 'center', marginTop: '20vh' }}>
            <div style={{
                width: 80, height: 80,
                background: 'var(--bg-card)',
                borderRadius: '50%',
                margin: '0 auto var(--space-6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid var(--accent-glow)',
                boxShadow: '0 0 30px var(--accent-glow)'
            }}>
                <div style={{ fontSize: '2rem' }}>👋</div>
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-4)' }}>Hi, Alex</h1>
            <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
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
            <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>Income Details</h2>
            <p className="text-muted" style={{ marginBottom: 'var(--space-8)' }}>Knowing when you get paid helps me calculate your "Safe to Spend" amount.</p>

            <label style={{ display: 'block', marginBottom: 'var(--space-4)' }}>
                <span className="text-sm text-muted" style={{ display: 'block', marginBottom: 8 }}>Pay Frequency</span>
                <div className="flex gap-4">
                    {['biweekly', 'monthly'].map(freq => (
                        <button key={freq}
                            onClick={() => update({ ...data, payFrequency: freq })}
                            className="card"
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                borderColor: data.payFrequency === freq ? 'var(--accent-primary)' : 'transparent',
                                backgroundColor: data.payFrequency === freq ? 'rgba(45, 212, 191, 0.1)' : undefined
                            }}
                        >
                            {freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </button>
                    ))}
                </div>
            </label>

            <label style={{ display: 'block' }}>
                <span className="text-sm text-muted" style={{ display: 'block', marginBottom: 8 }}>Next Payday</span>
                <input
                    type="date"
                    value={data.nextPayDate}
                    onChange={(e) => update({ ...data, nextPayDate: e.target.value })}
                    style={{
                        width: '100%',
                        background: 'var(--bg-card)',
                        border: '1px solid rgba(255,255,255,0.1)',
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
            <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>Fixed Expenses</h2>
            <p className="text-muted" style={{ marginBottom: 'var(--space-8)' }}>I've identified these recurring bills from your history. Are these correct?</p>

            <div className="flex flex-col gap-4">
                <label className="card flex items-center justify-between" style={{ cursor: 'pointer' }}>
                    <div className="flex items-center gap-4">
                        <div style={{ padding: 8, background: 'rgba(255, 99, 71, 0.1)', borderRadius: '50%', color: '#ff6347' }}>
                            <Home size={20} />
                        </div>
                        <div>
                            <div className="font-bold">Rent</div>
                            <div className="text-xs text-muted">Monthly ~ 1st</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-muted">$</span>
                        <input
                            type="number"
                            value={data.rentAmount}
                            placeholder="1200"
                            onChange={(e) => update({ ...data, rentAmount: e.target.value })}
                            style={{ width: 80, background: 'transparent', border: 'none', color: 'var(--text-primary)', textAlign: 'right', fontSize: '1rem' }}
                        />
                    </div>
                </label>



                {/* Editable Netflix Bill */}
                <label className="card flex items-center justify-between" style={{ cursor: 'pointer' }}>
                    <div className="flex items-center gap-4">
                        <div style={{ padding: 8, background: 'rgba(50, 200, 255, 0.1)', borderRadius: '50%', color: '#32c8ff' }}>
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <div className="font-bold">Netflix</div>
                            <div className="text-xs text-muted">Monthly ~ 15th</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-muted">$</span>
                        <input
                            type="number"
                            value={data.netflixAmount}
                            placeholder="15.99"
                            onChange={(e) => update({ ...data, netflixAmount: e.target.value })}
                            style={{ width: 80, background: 'transparent', border: 'none', color: 'var(--text-primary)', textAlign: 'right', fontSize: '1rem' }}
                        />
                    </div>
                </label>
            </div>

        </div>
    );
}

function GoalsStep({ data, update }) {
    return (
        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: 4 }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>Set Targets</h2>
            <p className="text-muted" style={{ marginBottom: 'var(--space-6)' }}>Set limits for your key spending categories.</p>

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
                <div className="card" style={{ background: 'var(--bg-card)', border: '1px dashed var(--bg-card-hover)', marginTop: 8, padding: 8 }}>
                    <p className="text-xs text-muted" style={{ lineHeight: 1.4, margin: 0 }}>
                        💡 {insight}
                    </p>
                </div>
            )}
        </div>
    );
}

