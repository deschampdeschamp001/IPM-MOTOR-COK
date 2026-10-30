import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X } from 'lucide-react';

export interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  kicker?: React.ReactNode;
  icon?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  hideCloseButton?: boolean;
  isSubmitting?: boolean;
  headerRight?: React.ReactNode;
}

const MAX_WIDTH_CLASSES: Record<string, string> = {
  sm: 'md:max-w-md',
  md: 'md:max-w-lg',
  lg: 'md:max-w-2xl',
  xl: 'md:max-w-3xl',
  '2xl': 'md:max-w-4xl',
  '3xl': 'md:max-w-5xl',
  '4xl': 'md:max-w-6xl',
  '5xl': 'md:max-w-7xl',
};

export const ResponsiveModal: React.FC<ResponsiveModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  kicker,
  icon,
  maxWidth = 'xl',
  children,
  footer,
  className = '',
  bodyClassName = '',
  closeOnBackdrop = true,
  closeOnEsc = true,
  hideCloseButton = false,
  isSubmitting = false,
  headerRight,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dragStartYRef = useRef<number | null>(null);
  const currentDragYRef = useRef<number>(0);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Prevent background scroll while open
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen || !closeOnEsc || isSubmitting) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEsc, isSubmitting, onClose]);

  // Touch Drag down gesture on mobile bottom sheet
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Only allow drag if scrolled to the very top of content or dragging handle
    const scrollContainer = contentRef.current;
    if (scrollContainer && scrollContainer.scrollTop > 5) {
      dragStartYRef.current = null;
      return;
    }

    dragStartYRef.current = e.touches[0].clientY;
    currentDragYRef.current = 0;
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (dragStartYRef.current === null) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - dragStartYRef.current;

    // Only allow dragging downwards
    if (diff > 0) {
      currentDragYRef.current = diff;
      setDragOffset(diff);
    } else {
      currentDragYRef.current = 0;
      setDragOffset(0);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (dragStartYRef.current === null) return;

    const threshold = 90; // pixels to trigger dismiss
    if (currentDragYRef.current > threshold && !isSubmitting) {
      onClose();
    }

    dragStartYRef.current = null;
    currentDragYRef.current = 0;
    setIsDragging(false);
    setDragOffset(0);
  }, [isSubmitting, onClose]);

  if (!isOpen) return null;

  const widthClass = MAX_WIDTH_CLASSES[maxWidth] || 'md:max-w-3xl';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center items-center overflow-x-hidden overflow-y-auto"
    >
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={() => {
          if (closeOnBackdrop && !isSubmitting) {
            onClose();
          }
        }}
        aria-hidden="true"
      />

      {/* Modal Container:
          - Mobile / Tablet (< md): Draggable Bottom Sheet pinned to bottom, 100% width, rounded top
          - Desktop (>= md): Horizontal centered modal with elegant rounded corners and shadow
      */}
      <div
        ref={modalRef}
        style={{
          transform: dragOffset > 0 ? `translateY(${dragOffset}px)` : undefined,
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`relative z-10 w-full ${widthClass}
          /* Mobile / Tablet Bottom Sheet */
          rounded-t-[26px] md:rounded-2xl rounded-b-none md:rounded-b-2xl
          max-h-[92vh] md:max-h-[88vh]
          bg-white dark:bg-[#121214] text-zinc-900 dark:text-white
          border border-zinc-200/90 dark:border-zinc-800
          shadow-2xl flex flex-col overflow-hidden
          transition-colors duration-200
          animate-in slide-in-from-bottom-6 md:slide-in-from-bottom-2 md:zoom-in-95 duration-250
          ${className}`}
      >
        {/* Mobile Drag Handle (Header Top) */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="md:hidden pt-3 pb-1 flex items-center justify-center cursor-grab active:cursor-grabbing select-none w-full shrink-0"
        >
          <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full transition-transform" />
        </div>

        {/* Header (when title, subtitle, or kicker is provided) */}
        {(title || kicker || !hideCloseButton) && (
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="px-5 sm:px-7 pt-2 sm:pt-5 pb-4 border-b border-zinc-200 dark:border-zinc-800/80 flex items-start justify-between gap-4 shrink-0"
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {icon && (
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-[#e10600] flex items-center justify-center shrink-0 mt-0.5">
                  {icon}
                </div>
              )}
              <div className="flex-1 min-w-0">
                {kicker && (
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#e10600] mb-0.5 truncate">
                    {kicker}
                  </span>
                )}
                {title && (
                  <h3 className="font-heading font-bold text-lg sm:text-xl md:text-2xl text-zinc-900 dark:text-white leading-tight">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-light leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {headerRight}
              {!hideCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  aria-label="Fermer la fenêtre"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <div
          ref={contentRef}
          className={`flex-1 overflow-y-auto overscroll-contain p-5 sm:p-7 md:p-8 ${bodyClassName}`}
        >
          {children}
        </div>

        {/* Optional Footer (Sticky at bottom on Mobile, aligned on Desktop) */}
        {footer && (
          <div className="px-5 sm:px-7 py-3 sm:py-4 border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-900/60 flex flex-wrap items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
