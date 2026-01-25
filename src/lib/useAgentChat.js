import { useState, useCallback } from 'react';

export function useAgentChat(initialMessages = []) {
    const [messages, setMessages] = useState(initialMessages);
    const [isTyping, setIsTyping] = useState(false);

    const processQuery = useCallback((text, context = {}) => {
        const lower = text.toLowerCase();
        let reply = "I'm here to help manage your finances. You can ask about transfers, budgets, or bills.";

        // 1. Context-Specific Overrides (High Priority)
        if (context.starters) {
            const contextMatch = context.starters.find(s =>
                s.label.toLowerCase() === lower ||
                (s.query && s.query.toLowerCase() === lower)
            );
            if (contextMatch && contextMatch.response) {
                return contextMatch.response;
            }
        }

        // 2. High-Priority Direct Matches (Logic Flows)
        if (lower === 'modify limits' || lower === 'i want to modify my spending limits.' || lower.includes('modify spending limits')) {
            return "I can help with that. Would you like to adjust your **Overall Budget** or a **Specific Category Limit**?";
        }

        if (lower.includes('overall') && (lower.includes('budget') || lower.includes('limit'))) {
            return "Understood. Should we set a **Weekly** or **Monthly** overall limit?";
        }

        if (lower.includes('category') && (lower.includes('budget') || lower.includes('limit'))) {
            return "Which category would you like to adjust? I track: **Shopping, Transport, Groceries, Travel, and Entertainment.**";
        }

        if (['shopping', 'transport', 'groceries', 'travel', 'entertainment', 'dining'].some(cat => lower === cat || lower.includes(`limit for ${cat}`))) {
            const cat = ['shopping', 'transport', 'groceries', 'travel', 'entertainment', 'dining'].find(c => lower.includes(c));
            return `Got it. What would you like the new monthly limit for **${cat.charAt(0).toUpperCase() + cat.slice(1)}** to be?`;
        }

        if (lower === 'weekly' || (lower.includes('weekly') && lower.includes('limit'))) {
            return "Your current weekly target is $210. What would you like to change it to?";
        }

        if (lower === 'monthly' || (lower.includes('monthly') && lower.includes('limit'))) {
            return "Your current monthly limit is $2,200. What is the new amount you'd like to set?";
        }

        // 3. Regular Insight Queries
        if (lower.includes('compare to 2025')) {
            return "In 2025, your average monthly spend was $2,450. Currently, you're at $2,200—putting you **10% below last year's average**. Great progress!";
        }
        if (lower.includes('budget for next month')) {
            return "Based on your salary of $3,200 and fixed costs of $1,365, I recommend a **spending limit of $1,400** for next month. This ensures you hit your 25% savings goal.";
        }
        if (lower.includes('find hidden costs')) {
            return "Looking at your **Monthly Comparison**, your 'Other' category spiked by $45 due to an automatic renewal for a service you haven't used since November. I recommend canceling to save $540/year.";
        }
        if (lower.includes('save in')) {
            if (lower.includes('dining')) return "1. Use your 'Dining Rewards' offer (5% back).\n2. Set a 'Thursday Home-Cook' rule to avoid the mid-week checkout spike.\n3. Limit coffee runs to twice a week.";
            if (lower.includes('shopping')) return "1. Wait 24 hours before any purchase over $50.\n2. Unsubscribe from marketing emails that trigger impulse buys.\n3. Use 'Pay in 4' only for essential large items.";
            if (lower.includes('transport')) return "1. Combine errands into one trip.\n2. Check tire pressure to improve fuel efficiency.\n3. Use public transport for city-center trips.";
            return "I can help with tips for that category. Do you want to see a spending trend first?";
        }
        if (lower.includes('maximize interest')) {
            return "You have $4,500 in a standard savings account (0.1%). Moving this to a **High-Yield Savings account (4.5%)** would earn you an extra **$202 per year**.";
        }
        if (lower.includes('short-term goals')) {
            return "With your current $400 monthly savings, you can fully fund a **$1,200 Emergency Fund** in exactly 3 months.";
        }
        if (lower.includes('show me recent transactions in')) {
            const cat = lower.split('in ')[1] || 'this category';
            return `In the last 14 days, you've had 4 transactions in **${cat}**, totaling $120. The largest was $45 at 'The Daily Roast'.`;
        }

        if (lower.includes('compare') && (lower.includes('week') || lower.includes('last week'))) {
            reply = "You spent $210 last week, which is $50 less than this week. The increase is mostly in Dining.";
        } else if (lower.includes('compare') && (lower.includes('month') || lower.includes('cycle'))) {
            reply = "Spending is down 12% compared to this time last month. Great job on cutting back on subscriptions!";
        } else if (lower.includes('can i spend') || lower.includes('afford') || lower.includes('safe to spend')) {
            reply = "Yes, you have $140 left in your 'Safe to Spend' balance. A $50 purchase fits comfortably.";
        } else if (lower.includes('biggest') || lower.includes('largest') || lower.includes('big expenses')) {
            reply = "Your biggest recent expense was Rent ($1,200) on Oct 1st, followed by Whole Foods ($145).";
        } else if (lower.includes('how much can i save')) {
            reply = "Based on your current trend, you could save about $400 this cycle if you stick to your dining limit.";
        } else if (lower.includes('why is spending down')) {
            reply = "You haven't had any large car repairs this month, unlike last month ($500). That's the main difference.";
        } else if (lower.includes('top expense')) {
            reply = "Your top expense this month is Rent ($1,200). The second highest is your Car Payment ($350).";
        } else if (lower.includes('set a budget')) {
            reply = "I can set a budget. How much would you like to limit your 'Shopping' category to?";
        } else if (lower.includes('tips to save') || lower.includes('how to save')) {
            reply = "Try using the 'Pay in 4' option for larger purchases to smooth out cash flow, or cook at home one more night a week.";
        } else if (lower.includes('automate more') || lower.includes('automatic round-ups')) {
            reply = "I can definitely help with that! You can enable **'Round-ups'** to save the change from every purchase, or set up a **Targeted Transfer** that moves money to savings as soon as your payday is detected.";
        } else if (lower.includes('projected') || lower.includes('projection')) {
            reply = "You are projected to save $450 this month if you maintain your current daily spending.";
        } else if ((lower.includes('modify') || lower.includes('change')) && lower.includes('goal')) {
            reply = "Your current savings goal is $500/month. Enter the new amount you'd like to aim for.";
        } else if (lower.includes('transfer')) {
            reply = "I can help with transfers. Your checking balance is $45. Shall I move $200 from Savings?";
        } else if (lower.includes('limit') || lower.includes('budget')) {
            reply = "Your dining limit is $300. You've currently spent $310. Try to cook at home this week!";
        } else if (lower.includes('pay') || lower.includes('lend') || lower.includes('buy now')) {
            reply = "You qualify for 'Pay in 4' on purchases over $100. Interest-free if paid on time.";
        } else if (lower.includes('save') || lower.includes('invest') || lower.includes('savings')) {
            reply = "You have $4,500 in High Yield Savings earning 4.5% APY. Keep it up!";
        } else if (lower.includes('bill') || lower.includes('rent') || lower.includes('netflix')) {
            reply = "Rent of $1,200 is due on the 1st. I've already set it aside in your forecast.";
        } else if (lower.includes('spent') || lower.includes('spending')) {
            reply = "You've spent $842 so far this month. You're on track to stay under your $2,200 limit.";
        }

        return reply;
    }, []);

    const sendMessage = (text, context = {}) => {
        if (!text.trim()) return;

        // Add User Message
        const userMsg = { role: 'user', text };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        // Simulate Agent Delay & Response
        setTimeout(() => {
            const replyText = processQuery(text, context);
            setMessages(prev => [...prev, { role: 'agent', text: replyText }]);
            setIsTyping(false);
        }, 600);
    };

    const addMessage = (msg) => {
        setMessages(prev => [...prev, msg]);
    };

    return {
        messages,
        sendMessage,
        addMessage,
        isTyping
    };
}
