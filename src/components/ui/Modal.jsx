import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Modal({ isOpen, onClose, children }) {
    const [viewportHeight, setViewportHeight] = useState('100svh');
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        if (!isOpen) return;

        const handleResize = () => {
            if (window.visualViewport) {
                const totalHeight = window.innerHeight;
                const visibleHeight = window.visualViewport.height;
                const kHeight = totalHeight - visibleHeight;
                setKeyboardHeight(kHeight > 100 ? kHeight : 0);
                setViewportHeight(`${visibleHeight}px`);
            }
        };

        window.visualViewport?.addEventListener('resize', handleResize);
        handleResize(); // Initial check
        return () => window.visualViewport?.removeEventListener('resize', handleResize);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'flex-end',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
            transition: 'bottom 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'var(--bg-app)',
                width: '100%',
                maxHeight: `calc(${viewportHeight} - 20px)`,
                borderTopLeftRadius: 'var(--radius-xl)',
                borderTopRightRadius: 'var(--radius-xl)',
                padding: 'var(--space-6)',
                position: 'relative',
                marginBottom: keyboardHeight > 0 ? keyboardHeight : 0,
                animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                overflowY: 'auto',
                transition: 'margin-bottom 0.2s ease-out, max-height 0.2s ease-out'
            }} onClick={e => e.stopPropagation()}>

                <button onClick={onClose} style={{
                    position: 'absolute',
                    top: 'var(--space-4)',
                    right: 'var(--space-4)',
                    background: 'var(--bg-card)',
                    border: 'none',
                    borderRadius: '50%',
                    padding: 8,
                    zIndex: 10,
                    cursor: 'pointer'
                }}>
                    <X size={20} color="var(--text-muted)" />
                </button>

                {children}
            </div>
            <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
