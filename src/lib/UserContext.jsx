import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

const INITIAL_STATE = {
    onboarded: false,
    user: {
        name: 'Alex',
        role: 'Junior Designer',
        salary: 3200, // Monthly mocked salary
    },
    financials: {
        payFrequency: 'biweekly',
        nextPayDate: '2026-01-30', // Mock date: ~2 weeks from "now" (Jan 15, 2026)
        fixedExpenses: [], // [{ id: 1, name: 'Rent', amount: 1200 }]
        categoryLimits: {}, // { 'dining': 300, 'shopping': 200 }
        dailyTarget: 30, // Default daily spending target
    },
    transactions: [
        { id: 1, date: '2026-01-12', title: 'Starbucks', amount: 5.50, category: 'dining', icon: 'coffee' },
        { id: 2, date: '2026-01-10', title: 'Uber', amount: 18.20, category: 'transport', icon: 'car' },
        { id: 3, date: '2026-01-08', title: 'Whole Foods', amount: 145.00, category: 'groceries', icon: 'shopping-cart' },
        { id: 4, date: '2026-01-05', title: 'Netflix', amount: 15.99, category: 'subscriptions', icon: 'tv' },
        { id: 5, date: '2026-01-01', title: 'Rent', amount: 1200.00, category: 'bills', icon: 'home' },
        { id: 6, date: '2025-12-28', title: 'Zara', amount: 89.90, category: 'shopping', icon: 'shopping-bag' },
        { id: 7, date: '2025-12-25', title: 'Shell Station', amount: 45.00, category: 'transport', icon: 'gas' },
        { id: 8, date: '2025-12-20', title: 'Waitrose', amount: 120.00, category: 'groceries', icon: 'shopping-cart' },
        { id: 9, date: '2025-12-15', title: 'Apple Music', amount: 9.99, category: 'subscriptions', icon: 'music' },
        { id: 10, date: '2025-12-01', title: 'Rent', amount: 1200.00, category: 'bills', icon: 'home' },
    ],
    agents: {
        onboarding_agent: { name: 'Ally', role: 'Onboarding Specialist', color: '#6366f1', avatar: '👋' },
        transfer_agent: { name: 'Swift', role: 'Funds Transfer', color: '#10b981', avatar: '💸' },
        expense_agent: { name: 'Hawk', role: 'Expense Manager', color: '#f59e0b', avatar: '🦅' },
        paycheck_agent: { name: 'Planner', role: 'Paycheck Optimizer', color: '#8b5cf6', avatar: '📅' },
        lending_agent: { name: 'Bridge', role: 'Lending Specialist', color: '#3b82f6', avatar: '🌉' },
        rewards_agent: { name: 'Perks', role: 'Rewards Hunter', color: '#ec4899', avatar: '🎁' },
        overdraft_agent: { name: 'Shield', role: 'Overdraft Protector', color: '#ef4444', avatar: '🛡️' },
    },
    offers: [
        {
            id: 'off_1',
            agentId: 'paycheck_agent',
            title: 'Optimize Cashflow',
            type: 'split',
            widgetType: 'chart',
            priority: 2,
            amount: 145.00,
            savings: 0,
            description: 'Large expense detected at Whole Foods.',
            chartData: [20, 45, 30, 145], // Mock trend
            conversation: [
                { role: 'agent', text: 'I noticed a $145 charge at Whole Foods. That’s a bit higher than your usual $80.' },
                { role: 'agent', text: 'Since rent is due in 3 days, do you want to split this into 4 payments of $36.25? It’s fee-free.' },
                {
                    role: 'user_options', options: [
                        { label: 'Yes, Split it', action: 'activate_split', successMsg: 'Done! Your purchase is now split. Your first payment of $36.25 is due today.' },
                        { label: 'No thanks', action: 'dismiss', successMsg: 'Got it. I’ll keep an eye out for other ways to save.' }
                    ]
                }
            ]
        },
        {
            id: 'off_2',
            agentId: 'rewards_agent',
            title: 'Dining Rewards',
            type: 'reward',
            widgetType: 'stat',
            priority: 1,
            amount: 15.00,
            savings: 5.00,
            statValue: '5% Back',
            statLabel: 'On all dining this weekend',
            description: 'Get 5% back on dining this weekend',
            conversation: [
                { role: 'agent', text: 'Planning to eat out this weekend? You have a mocked offer for 5% cashback.' },
                {
                    role: 'user_options', options: [
                        { label: 'Activate Offer', action: 'activate_reward', successMsg: 'Offer activated! Use your card this weekend to earn 5% back.' }
                    ]
                }
            ]
        },
        {
            id: 'off_3',
            agentId: 'expense_agent',
            title: 'Spending Alert',
            type: 'alert',
            widgetType: 'progress',
            priority: 3,
            current: 310,
            limit: 300,
            category: 'dining',
            description: 'You have exceeded your dining limit.',
            conversation: [
                { role: 'agent', text: 'Heads up! You’ve hit $310 on Dining, which is over your $300 limit.' },
                { role: 'agent', text: 'Should we bump the limit to $350 just for this month, or do you want to curb spending?' },
                {
                    role: 'user_options', options: [
                        { label: 'Bump Limit to $350', action: 'increase_limit', successMsg: 'Limit updated to $350. Try to stay on track!' },
                        { label: 'I\'ll be careful', action: 'dismiss', successMsg: 'Understood. I’ll notify you if you trend higher.' }
                    ]
                }
            ]
        },
        {
            id: 'off_4',
            agentId: 'transfer_agent',
            title: 'Low Balance Warning',
            type: 'alert',
            widgetType: 'stat',
            priority: 10,
            amount: 0,
            savings: 35.00,
            statValue: '$35 Saved',
            statLabel: 'Overdraft Fee Avoided',
            description: 'Checking account balance is low.',
            conversation: [
                { role: 'agent', text: 'Your checking balance is down to $45. You have a $120 utility bill coming up tomorrow.' },
                { role: 'agent', text: 'I can transfer $200 from your Savings to cover it. You have $4,500 available there.' },
                {
                    role: 'user_options', options: [
                        { label: 'Transfer $200', action: 'transfer_funds', successMsg: 'Transfer complete! Your checking balance is now $245.' },
                        { label: 'I\'ll handle it', action: 'dismiss', successMsg: 'Okay, just don’t forget that bill!' }
                    ]
                }
            ]
        },
        {
            id: 'off_5',
            agentId: 'lending_agent',
            title: 'Pay Over Time',
            type: 'split',
            widgetType: 'stat',
            priority: 5,
            amount: 299.00,
            savings: 0,
            statValue: 'Pay In 4',
            statLabel: 'Qualified Purchase',
            description: 'Qualify for Pay in 4 for your recent electronics purchase.',
            conversation: [
                { role: 'agent', text: 'That new monitor looks great! Since it was $299, you qualify for Pay in 4.' },
                { role: 'agent', text: 'This keeps more cash in your pocket today. No interest if paid on time.' },
                {
                    role: 'user_options', options: [
                        { label: 'Enable Pay in 4', action: 'activate_lending', successMsg: 'You\'re set up. First payment of $74.75 has been processed.' },
                        { label: 'Pay full amount', action: 'dismiss', successMsg: 'Sounds good. Enjoy the new gear!' }
                    ]
                }
            ]
        }
    ]
};

export function UserProvider({ children }) {
    // Try to load from local storage to persist between reloads
    const [state, setState] = useState(() => {
        const saved = localStorage.getItem('banking-agent-state');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Deep merge to ensure new schema fields (dailyTarget) and updates (nextPayDate) are preserved
            return {
                ...INITIAL_STATE,
                ...parsed,
                financials: {
                    ...INITIAL_STATE.financials,
                    ...(parsed.financials || {}),
                    // Force these specific fields to ensure the fix works regardless of old data
                    nextPayDate: INITIAL_STATE.financials.nextPayDate,
                    dailyTarget: parsed.financials?.dailyTarget || INITIAL_STATE.financials.dailyTarget
                },
                transactions: INITIAL_STATE.transactions,
                offers: INITIAL_STATE.offers
            };
        }
        return INITIAL_STATE;
    });

    useEffect(() => {
        localStorage.setItem('banking-agent-state', JSON.stringify(state));
    }, [state]);

    const updateFinancials = (updates) => {
        setState(prev => ({
            ...prev,
            financials: { ...prev.financials, ...updates }
        }));
    };

    const completeOnboarding = () => {
        setState(prev => ({ ...prev, onboarded: true }));
    };

    const removeOffer = (offerId) => {
        setState(prev => ({
            ...prev,
            offers: prev.offers.filter(o => o.id !== offerId)
        }));
    };

    return (
        <UserContext.Provider value={{ state, updateFinancials, completeOnboarding, removeOffer }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);
