import { useState, useEffect, useRef } from 'react';
import { useUser } from '../../lib/UserContext';
import { Modal, useKeyboard } from './Modal';
import { CheckCircle, Bot, Send, Sparkles } from 'lucide-react';
import { useAgentChat } from '../../lib/useAgentChat';

export function ConversationModal({ offer, onClose, onActionComplete }) {
    const isKeyboardUp = useKeyboard();
    const { state } = useUser();
    const [completedMsg, setCompletedMsg] = useState(null);
    const scrollRef = useRef(null);
    const { messages, sendMessage, addMessage, isTyping } = useAgentChat([]);
    const [val, setVal] = useState('');

    // Reset local state when offer changes/opens
    useEffect(() => {
        if (offer) {
            setCompletedMsg(null);
            setVal('');
        }
    }, [offer]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, completedMsg, offer]);

    if (!offer) return null;

    // Resolve Agent Identity
    const agent = { name: 'Banking Assistant', role: 'Agent', color: '#6366f1', avatar: <Bot size={24} /> };
    const AgentAvatar = () => <Bot size={24} />;

    const handleAction = (opt) => {
        setCompletedMsg({ offerId: offer.id, text: opt.successMsg });
        setTimeout(() => {
            onClose();
            if (onActionComplete) onActionComplete(offer.id);
        }, 2500);
    };

    const handleSend = () => {
        if (!val.trim()) return;
        sendMessage(val);
        setVal('');
    };

    // Combine static and dynamic history for display
    // We only show dynamic messages from the hook. 
    // The static ones come from `offer.conversation`.
    const displayMessages = messages;

    return (
        <Modal isOpen={!!offer} onClose={onClose}>
            <div className="flex flex-col" style={{
                height: '100%',
                overflow: 'hidden',
                background: 'var(--bg-app)'
            }}>
                {/* Header Container - Fixed at top */}
                <div style={{
                    padding: isKeyboardUp ? '12px 24px' : '24px 24px 16px',
                    textAlign: isKeyboardUp ? 'left' : 'center',
                    borderBottom: '1px solid #E6E6E0',
                    background: 'white',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    justifyContent: isKeyboardUp ? 'flex-start' : 'center',
                    flexDirection: isKeyboardUp ? 'row' : 'column'
                }}>
                    {!isKeyboardUp && (
                        <div style={{
                            width: 48, height: 48,
                            background: 'var(--accent-primary)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white',
                            boxShadow: `0 4px 12px var(--accent-glow)`
                        }}>
                            <Bot size={24} />
                        </div>
                    )}
                    <div style={{ textAlign: isKeyboardUp ? 'left' : 'center' }}>
                        <h2 style={{ fontSize: isKeyboardUp ? '0.95rem' : '1.1rem', margin: 0, color: 'var(--text-primary)', fontWeight: '800' }}>{agent.name}</h2>
                        {!isKeyboardUp && <p className="text-xs text-muted uppercase tracking-wider font-bold" style={{ marginTop: 2 }}>{agent.role}</p>}
                    </div>
                </div>

                {/* Main Content: Scrollable Area */}
                <div
                    ref={scrollRef}
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        background: '#FAF9F6',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    {/* Data / Context Section - Now inside scroll area */}
                    <div style={{ padding: '24px 24px 12px' }}>
                        <div className="card no-hover" style={{
                            background: 'rgba(230, 230, 224, 0.4)',
                            border: '1px solid #E6E6E0',
                            borderRadius: '16px',
                            padding: '20px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                        }}>
                            {offer.widgetType === 'chart' && (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: 4 }}>${offer.amount.toFixed(2)}</div>
                                    <div className="text-sm text-muted">{offer.title}</div>
                                </div>
                            )}
                            {offer.widgetType === 'progress' && (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--danger)', marginBottom: 4 }}>${offer.current.toFixed(2)}</div>
                                    <div className="text-sm text-muted">Current Spend (Limit ${offer.limit})</div>
                                </div>
                            )}
                            {offer.widgetType === 'stat' && (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--success)', marginBottom: 4 }}>
                                        {offer.statValue || `$${offer.savings}`}
                                    </div>
                                    <div className="text-sm text-muted">
                                        {offer.statLabel || 'Potential Savings'}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div style={{
                        padding: '0 24px 24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        {/* Static Initial Message */}
                        {offer.conversation?.filter(msg => msg.role === 'agent').map((msg, idx) => (
                            <div key={`base-${idx}`} className="animate-fade-in" style={{ display: 'flex', gap: 12 }}>
                                <div style={{
                                    width: 28, height: 28,
                                    background: 'var(--accent-primary)',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                    color: 'white'
                                }}>
                                    <Bot size={14} />
                                </div>
                                <div style={{
                                    background: 'white',
                                    padding: '12px 16px',
                                    borderRadius: '0 16px 16px 16px',
                                    maxWidth: '85%',
                                    lineHeight: 1.5,
                                    fontSize: '0.9rem',
                                    border: '1px solid #E6E6E0',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {/* Hook Messages */}
                        {displayMessages.map((msg, idx) => (
                            <div key={`dyn-${idx}`} className="animate-fade-in" style={{
                                display: 'flex',
                                gap: 12,
                                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                            }}>
                                {msg.role === 'agent' && (
                                    <div style={{
                                        width: 28, height: 28,
                                        background: 'var(--accent-primary)',
                                        borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                        color: 'white'
                                    }}>
                                        <Bot size={14} />
                                    </div>
                                )}
                                <div style={{
                                    background: msg.role === 'user' ? 'var(--accent-primary)' : 'white',
                                    color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                                    padding: '12px 16px',
                                    borderRadius: '16px',
                                    borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                                    borderBottomLeftRadius: msg.role === 'user' ? '16px' : '4px',
                                    maxWidth: '85%',
                                    lineHeight: 1.5,
                                    fontSize: '0.9rem',
                                    border: msg.role === 'user' ? 'none' : '1px solid #E6E6E0',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div style={{ display: 'flex', gap: 12 }}>
                                <div style={{
                                    width: 28, height: 28,
                                    background: 'var(--accent-primary)',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                    color: 'white'
                                }}>
                                    <Bot size={14} />
                                </div>
                                <div style={{ fontSize: '0.9rem', padding: '12px 16px', background: 'white', border: '1px solid #E6E6E0', borderRadius: '16px', borderBottomLeftRadius: '4px', color: 'var(--text-muted)' }}>
                                    Thinking...
                                </div>
                            </div>
                        )}

                        {completedMsg && completedMsg.offerId === offer.id && (
                            <div className="animate-fade-in" style={{ display: 'flex', gap: 12 }}>
                                <div style={{
                                    width: 28, height: 28,
                                    background: 'var(--accent-primary)',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                    color: 'white'
                                }}>
                                    <Bot size={14} />
                                </div>
                                <div style={{
                                    background: 'var(--success)',
                                    color: 'white',
                                    padding: '12px 16px',
                                    borderRadius: '0 16px 16px 16px',
                                    maxWidth: '85%',
                                    lineHeight: 1.5,
                                    fontSize: '0.9rem',
                                    boxShadow: '0 4px 12px rgba(52, 211, 153, 0.2)'
                                }}>
                                    {completedMsg.text}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer: Options/Input - Persistent at bottom */}
                <div style={{
                    padding: '16px 24px calc(16px + env(safe-area-inset-bottom))',
                    background: 'white',
                    borderTop: '1px solid #E6E6E0',
                    flexShrink: 0
                }}>
                    {!completedMsg ? (
                        <div className="flex flex-col gap-3">
                            {/* Suggested Actions as Bubbles */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', marginBottom: 4 }}>
                                {offer.conversation?.find(msg => msg.role === 'user_options')?.options.map((opt, idx) => (
                                    <button key={idx}
                                        onClick={() => handleAction(opt)}
                                        className="interactive-bar"
                                        style={{
                                            fontSize: '0.875rem',
                                            padding: '10px 18px',
                                            borderRadius: '16px 16px 4px 16px',
                                            border: 'none',
                                            backgroundColor: idx === 0 ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                                            color: 'white',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                            maxWidth: '90%',
                                            textAlign: 'right'
                                        }}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>

                            {/* Chat Input */}
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <div style={{
                                        position: 'absolute',
                                        left: '12px',
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--accent-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        zIndex: 10
                                    }}>
                                        <Sparkles size={12} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Ask anything..."
                                        style={{
                                            width: '100%',
                                            padding: '12px 12px 12px 42px',
                                            borderRadius: '24px',
                                            border: '1px solid #E6E6E0',
                                            outline: 'none',
                                            fontSize: '16px', // Prevents iOS auto-zoom
                                            backgroundColor: '#F9F9F7'
                                        }}
                                        value={val}
                                        onChange={e => setVal(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                                        onFocus={e => {
                                            e.target.style.borderColor = 'var(--accent-primary)';
                                            // Delay scroll to allow keyboard to finish opening
                                            setTimeout(() => {
                                                if (scrollRef.current) {
                                                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                                                }
                                            }, 300);
                                        }}
                                        onBlur={e => e.target.style.borderColor = '#E6E6E0'}
                                    />
                                </div>
                                <button
                                    onClick={handleSend}
                                    disabled={!val.trim()}
                                    className="interactive-bar"
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--accent-primary)',
                                        color: 'white',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: val.trim() ? 1 : 0.5,
                                        cursor: val.trim() ? 'pointer' : 'default'
                                    }}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '12px', background: 'var(--success)', color: 'white', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                            <CheckCircle size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                            Process Complete
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
