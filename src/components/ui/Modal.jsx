import { X } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

export function Modal({ isOpen, onClose, children }) {
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
    const [isKeyboardUp, setIsKeyboardUp] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const handleResize = () => {
            if (window.visualViewport) {
                const height = window.visualViewport.height;
                setViewportHeight(height);

                // Detect keyboard by comparing visual viewport to window inner height
                // If visual viewport is significantly smaller than innerHeight, keyboard is likely up
                setIsKeyboardUp(height < window.innerHeight * 0.85);
            } else {
                setViewportHeight(window.innerHeight);
            }
        };

        window.visualViewport?.addEventListener('resize', handleResize);
        window.visualViewport?.addEventListener('scroll', handleResize);
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.visualViewport?.removeEventListener('resize', handleResize);
            window.visualViewport?.removeEventListener('scroll', handleResize);
            window.removeEventListener('resize', handleResize);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
            height: `${viewportHeight}px`,
            transition: 'height 0.2s ease-out',
            overflow: 'hidden'
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'var(--bg-app)',
                width: '100%',
                // On mobile when keyboard is up, take more space
                maxHeight: isKeyboardUp ? '100%' : '90%',
                borderTopLeftRadius: isKeyboardUp ? '0' : 'var(--radius-xl)',
                borderTopRightRadius: isKeyboardUp ? '0' : 'var(--radius-xl)',
                padding: '0', // Manage padding in children for better scroll control
                position: 'relative',
                animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
            }} onClick={e => e.stopPropagation()}>

                <button onClick={onClose} style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid #E6E6E0',
                    borderRadius: '50%',
                    padding: 8,
                    zIndex: 100,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
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
