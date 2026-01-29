import { X } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

export function Modal({ isOpen, onClose, children }) {
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
    const [isKeyboardUp, setIsKeyboardUp] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        // Prevent background scrolling and interaction
        const originalStyle = window.getComputedStyle(document.body).overflow;
        const originalHeight = window.getComputedStyle(document.body).height;
        const originalPosition = window.getComputedStyle(document.body).position;
        const originalTop = window.getComputedStyle(document.body).top;
        const scrollY = window.scrollY;

        document.body.style.overflow = 'hidden';
        document.body.style.height = '100%';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.touchAction = 'none';

        const handleResize = () => {
            if (window.visualViewport) {
                const height = window.visualViewport.height;
                setViewportHeight(height);
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
            document.body.style.overflow = originalStyle;
            document.body.style.height = originalHeight;
            document.body.style.position = originalPosition;
            document.body.style.top = originalTop;
            document.body.style.touchAction = '';
            window.scrollTo(0, scrollY);
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
            transition: 'height 0.1s ease-out',
            overflow: 'hidden',
            touchAction: 'none' // Prevent dragging the backdrop
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'var(--bg-app)',
                width: '100%',
                maxHeight: isKeyboardUp ? '100%' : '90%',
                borderTopLeftRadius: isKeyboardUp ? '0' : 'var(--radius-xl)',
                borderTopRightRadius: isKeyboardUp ? '0' : 'var(--radius-xl)',
                padding: '0',
                position: 'relative',
                animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                overscrollBehavior: 'contain' // Prevents scroll chaining to background
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
