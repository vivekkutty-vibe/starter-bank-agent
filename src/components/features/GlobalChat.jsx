import { useState, useEffect, useRef } from 'react';
import { Mic, Send, X, Sparkles, Bot } from 'lucide-react';
import { useAgentChat } from '../../lib/useAgentChat';

export function GlobalChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
    const scrollRef = useRef(null);
    const { messages, sendMessage, isTyping } = useAgentChat([
        { role: 'agent', text: 'Hi Alex, I’m here. Need to find a transaction or check your budget?' }
    ]);

    // Handle Visual Viewport for mobile keyboards
    useEffect(() => {
        if (!isOpen) return;

        const handleResize = () => {
            if (window.visualViewport) {
                setViewportHeight(window.visualViewport.height);
            }
        };

        window.visualViewport?.addEventListener('resize', handleResize);
        handleResize(); // Initial call

        return () => window.visualViewport?.removeEventListener('resize', handleResize);
    }, [isOpen]);

    // Auto-scroll to bottom 
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping, viewportHeight]);

    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage(input);
        setInput('');
    };

    return (
        <>
            {/* Persistent Chat Pill */}
            {!isOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '100px', // Above bottom nav
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 90,
                    width: '90%',
                    maxWidth: 400
                }}>
                    <button
                        onClick={() => setIsOpen(true)}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '12px 20px',
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid var(--accent-glow)',
                            borderRadius: 'var(--radius-full)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            color: 'var(--text-muted)'
                        }}
                    >
                        <div style={{
                            width: 28, height: 28,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white'
                        }}>
                            <Sparkles size={16} />
                        </div>
                        <span style={{ fontSize: '0.95rem' }}>Ask Agent anything...</span>
                        <Mic size={20} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                    </button>
                </div>
            )}

            {/* Chat Interface Overlay */}
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0,
                    height: viewportHeight,
                    background: 'var(--bg-app)',
                    zIndex: 2000,
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'fadeIn 0.2s ease',
                    transition: 'height 0.1s ease-out'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: 'var(--space-4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        borderBottom: '1px solid var(--bg-card-hover)',
                        background: 'white'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                <Bot size={18} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Agent Chat</div>
                                <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span> Online
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            <X size={24} color="var(--text-muted)" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        ref={scrollRef}
                        style={{ flex: 1, padding: 'var(--space-4)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}
                    >
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                gap: 12,
                                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                                marginBottom: 4
                            }}>
                                {msg.role === 'agent' && (
                                    <div style={{
                                        width: 24, height: 24,
                                        borderRadius: '50%',
                                        background: 'var(--accent-primary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                        color: 'white'
                                    }}>
                                        <Bot size={12} />
                                    </div>
                                )}
                                <div
                                    style={{
                                        padding: '10px 14px',
                                        borderRadius: '16px',
                                        borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                                        borderBottomLeftRadius: msg.role === 'user' ? '16px' : '4px',
                                        maxWidth: '85%',
                                        lineHeight: 1.5,
                                        fontSize: '0.9rem',
                                        background: msg.role === 'user' ? 'var(--accent-primary)' : 'white',
                                        color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                                        border: msg.role === 'user' ? 'none' : '1px solid #E6E6E0',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{ display: 'flex', gap: 12 }}>
                                <div style={{
                                    width: 24, height: 24,
                                    borderRadius: '50%',
                                    background: 'var(--accent-primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                    color: 'white'
                                }}>
                                    <Bot size={12} />
                                </div>
                                <div style={{
                                    fontSize: '0.9rem',
                                    padding: '10px 14px',
                                    background: 'white',
                                    border: '1px solid #E6E6E0',
                                    borderRadius: '16px',
                                    borderBottomLeftRadius: '4px',
                                    color: 'var(--text-muted)'
                                }}>
                                    Thinking...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Suggestions Area */}
                    <div style={{ padding: '0 var(--space-4) var(--space-2)', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                        {[
                            "How much can I spend?",
                            "Modify my limits",
                            "Top expense this month"
                        ].map((suggestion, i) => (
                            <button
                                key={i}
                                onClick={() => sendMessage(suggestion)}
                                style={{
                                    background: 'var(--accent-secondary)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '16px 16px 4px 16px',
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    maxWidth: '80%',
                                    textAlign: 'right'
                                }}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div style={{ padding: 'var(--space-4)', background: 'white', borderTop: '1px solid var(--bg-card-hover)' }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
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
                                    <Sparkles size={14} />
                                </div>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask anything..."
                                    autoFocus
                                    style={{
                                        width: '100%',
                                        padding: '12px 12px 12px 42px',
                                        borderRadius: '24px',
                                        border: '1px solid #E6E6E0',
                                        outline: 'none',
                                        fontSize: '0.9rem',
                                        backgroundColor: '#F9F9F7'
                                    }}
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                />
                            </div>
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
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
                                    opacity: input.trim() ? 1 : 0.5,
                                    cursor: input.trim() ? 'pointer' : 'default'
                                }}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
