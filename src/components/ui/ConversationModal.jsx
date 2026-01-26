import { useState, useEffect, useRef } from 'react';
import { useUser } from '../../lib/UserContext';
import { Modal } from './Modal';
import { CheckCircle, Bot, Send, Sparkles } from 'lucide-react';
import { useAgentChat } from '../../lib/useAgentChat';

export function ConversationModal({ offer, onClose, onActionComplete }) {
    const { state } = useUser();
    const [completedMsg, setCompletedMsg] = useState(null);
    const scrollRef = useRef(null);
    const { messages, sendMessage, addMessage, isTyping } = useAgentChat([]);
    const [val, setVal] = useState('');
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

    // Handle Visual Viewport for mobile keyboards
    useEffect(() => {
        if (!offer) return;

        const handleResize = () => {
            if (window.visualViewport) {
                setViewportHeight(window.visualViewport.height);
            }
        };

        window.visualViewport?.addEventListener('resize', handleResize);
        handleResize();

        return () => window.visualViewport?.removeEventListener('resize', handleResize);
    }, [offer]);

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
    }, [messages, completedMsg, offer, viewportHeight]);

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
                height: `${viewportHeight - 100}px`,
                maxHeight: '90vh',
                margin: '-24px -24px',
                transition: 'height 0.2s ease-out'
            }}>
                {/* Header Container */}
                <div style={{ padding: '32px 24px 24px', textAlign: 'center' }}>
                    <div style={{
                        width: 64, height: 64,
                        background: 'var(--accent-primary)',
                        borderRadius: '50%',
                        margin: '0 auto 12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white',
                        boxShadow: `0 8px 16px var(--accent-glow)`
                    }}>
                        <Bot size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-primary)' }}>{agent.name}</h2>
                    <p className="text-xs text-muted uppercase tracking-wider font-bold" style={{ marginTop: 4 }}>{agent.role}</p>
                </div>

                {/* Data / Context Section */}
                <div style={{ padding: '0 24px 24px' }}>
                    <div className="card no-hover" style={{
                        background: 'rgba(230, 230, 224, 0.3)',
                        border: '1px solid #E6E6E0',
                        borderRadius: '16px',
                        padding: '16px'
                    }}>
                        {offer.widgetType === 'chart' && (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: 4 }}>${offer.amount.toFixed(2)}</div>
                                <div className="text-sm text-muted">{offer.title}</div>
                            </div>
                        )}
                        {offer.widgetType === 'progress' && (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--danger)', marginBottom: 4 }}>${offer.current.toFixed(2)}</div>
                                <div className="text-sm text-muted">Current Spend (Limit ${offer.limit})</div>
                            </div>
                        )}
                        {offer.widgetType === 'stat' && (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--success)', marginBottom: 4 }}>
                                    {offer.statValue || `$${offer.savings}`}
                                </div>
                                <div className="text-sm text-muted">
                                    {offer.statLabel || 'Potential Savings'}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Container with Separation */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#FAF9F6',
                    borderTop: '1px solid #E6E6E0',
                    borderRadius: '0 0 24px 24px',
                    overflow: 'hidden'
                }}>
                    <div
                        ref={scrollRef}
                        style={{
                            flex: 1,
                            padding: '24px',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }}
                    >
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

                    {/* Footer: Options/Input */}
                    <div style={{ padding: '16px 24px 32px', background: 'white', borderTop: '1px solid #E6E6E0' }}>
                        {!completedMsg ? (
                            <div className="flex flex-col gap-3">
                                {/* Suggested Actions as Bubbles */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', marginBottom: 8 }}>
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
                                                fontSize: '0.9rem',
                                                backgroundColor: '#F9F9F7'
                                            }}
                                            value={val}
                                            onChange={e => setVal(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                                            onFocus={e => {
                                                e.target.style.borderColor = 'var(--accent-primary)';
                                                // Scroll input into view when keyboard appears
                                                setTimeout(() => {
                                                    e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
            </div>
        </Modal>
    );
}
