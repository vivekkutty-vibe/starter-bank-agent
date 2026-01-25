import { useRef, useEffect, useState } from 'react';
import { Send, Sparkles, Bot } from 'lucide-react';
import { useAgentChat } from '../../lib/useAgentChat';

export function EmbeddedChat({ contextStarters = [], initialMessage = "How can I help with this?", context = {} }) {
    const { messages, sendMessage, isTyping } = useAgentChat([
        { role: 'agent', text: initialMessage }
    ]);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

    // Handle Visual Viewport for mobile keyboards
    useEffect(() => {
        const handleResize = () => {
            if (window.visualViewport) {
                setViewportHeight(window.visualViewport.height);
            }
        };

        window.visualViewport?.addEventListener('resize', handleResize);
        handleResize();

        return () => window.visualViewport?.removeEventListener('resize', handleResize);
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isTyping, viewportHeight]);

    const handleSend = () => {
        if (inputRef.current) {
            const val = inputRef.current.value;
            if (val.trim()) {
                sendMessage(val, { ...context, starters: contextStarters });
                inputRef.current.value = '';
            }
        }
    };

    const handleStarterClick = (starter) => {
        const text = starter.query || starter.label;
        sendMessage(text, { ...context, starters: contextStarters });
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            borderTop: '1px solid #E6E6E0',
            backgroundColor: '#FAF9F6',
            marginTop: 'auto',
            borderRadius: '0 0 16px 16px',
            height: '100%',
            maxHeight: '500px'
        }}>
            {/* Header / Pill */}
            <div style={{
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderBottom: '1px solid rgba(230, 230, 224, 0.5)'
            }}>
                <Sparkles size={14} style={{ color: 'var(--accent-primary)' }} />
                <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>Ask Agent</span>
            </div>

            {/* Chat Area */}
            <div
                ref={scrollRef}
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '12px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    minHeight: '200px',
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none'
                }}
            >
                <style>{`.chat-area::-webkit-scrollbar { display: none; }`}</style>
                <div className="chat-area">
                    {messages.map((msg, idx) => (
                        <div key={idx} style={{
                            display: 'flex',
                            gap: '12px',
                            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                            marginBottom: '12px'
                        }}>
                            {msg.role === 'agent' && (
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--accent-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    flexShrink: 0,
                                    marginTop: '4px'
                                }}>
                                    <Bot size={14} />
                                </div>
                            )}
                            <div style={{
                                fontSize: '0.875rem',
                                padding: '8px 12px',
                                borderRadius: '16px',
                                maxWidth: '85%',
                                backgroundColor: msg.role === 'user' ? 'var(--accent-primary)' : 'white',
                                color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                                border: msg.role === 'user' ? 'none' : '1px solid #E6E6E0',
                                borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                                borderBottomLeftRadius: msg.role === 'user' ? '16px' : '4px',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--accent-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                flexShrink: 0,
                                marginTop: '4px'
                            }}>
                                <Bot size={14} />
                            </div>
                            <div style={{
                                fontSize: '0.875rem',
                                padding: '8px 12px',
                                backgroundColor: 'white',
                                border: '1px solid #E6E6E0',
                                borderRadius: '16px',
                                borderBottomLeftRadius: '4px',
                                color: 'var(--text-muted)',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}>
                                Thinking...
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Conversation Starters (User Bubbles) */}
            {contextStarters.length > 0 && messages.length < 3 && (
                <div style={{
                    padding: '0 16px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    alignItems: 'flex-end'
                }}>
                    {contextStarters.map((starter, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleStarterClick(starter)}
                            className="interactive-bar"
                            style={{
                                fontSize: '0.875rem',
                                padding: '8px 16px',
                                borderRadius: '16px 16px 4px 16px',
                                border: 'none',
                                backgroundColor: 'var(--accent-primary)',
                                color: 'white',
                                cursor: 'pointer',
                                textAlign: 'right',
                                maxWidth: '90%',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}
                        >
                            {starter.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Area */}
            <div style={{
                padding: '16px 16px 24px 16px',
                backgroundColor: 'white',
                borderTop: '1px solid #E6E6E0',
                borderRadius: '0 0 16px 16px'
            }}>
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
                            <Sparkles size={14} />
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Ask Agent..."
                            style={{
                                width: '100%',
                                padding: '10px 12px 10px 42px',
                                borderRadius: '24px',
                                border: '1px solid #E6E6E0',
                                outline: 'none',
                                fontSize: '0.875rem',
                                color: 'var(--text-primary)',
                                backgroundColor: '#FFFFFF'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'var(--accent-primary)';
                                setTimeout(() => {
                                    if (scrollRef.current) {
                                        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                                    }
                                }, 300);
                            }}
                            onBlur={(e) => e.target.style.borderColor = '#E6E6E0'}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        className="interactive-bar"
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--accent-primary)',
                            color: 'white',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

