import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { X, ChevronDown, ChevronRight, LogOut } from 'lucide-react';
import { navigationItems } from './Sidebar.jsx';
import { BtrcLogo } from './BtrcLogo.jsx';
import { useAuth } from '../../features/auth/AuthContext.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';
import { useOverlayPresence } from '../../system/useOverlayPresence.js';

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const MobileNavigationDrawer = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = usePreferences();
  const [openSubmenus, setOpenSubmenus] = useState({});
  const presence = useOverlayPresence(isOpen);
  const closeRef = useRef(null);
  const panelRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    previousFocusRef.current = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => closeRef.current?.focus());

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key === 'Tab') {
        const focusables = panelRef.current ? [...panelRef.current.querySelectorAll(focusableSelector)] : [];
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) onClose();
  }, [location.pathname, location.search]);

  const toggleSubmenu = (path) => setOpenSubmenus((prev) => ({ ...prev, [path]: !prev[path] }));

  if (!presence.mounted) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex" role="dialog" aria-modal="true" aria-label={t('Navigation')}>
      <button data-state={presence.state} type="button" onClick={onClose} className="motion-overlay-backdrop fixed inset-0 bg-[rgba(32,35,56,0.35)] backdrop-blur-xs" aria-label={t('Close navigation')} />
      <div data-state={presence.state} ref={panelRef} className="motion-nav-drawer relative w-[86%] max-w-sm bg-white text-[var(--color-text-primary)] flex flex-col h-[100dvh] z-10 shadow-[var(--shadow-overlay)]">
        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <BtrcLogo className="h-8 w-8" showText />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]"
            aria-label={t('Close navigation')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-3 bg-[var(--color-background-subtle)] border-b border-[var(--color-border)]">
          <p className="type-label font-semibold">{user?.fullName || t('BTRC Operator')}</p>
          <p className="type-meta text-[var(--color-text-secondary)] mt-0.5">{user?.role || t('Super Admin')}</p>
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain p-3 space-y-1" aria-label={t('Navigation')}>
          {navigationItems.map((item) => {
            if (item.type === 'section') {
              return (
                <div key={item.name} className="px-3 pt-3 pb-1 first:pt-0">
                  <p className="type-meta font-semibold text-[var(--color-text-muted)]">{t(item.name)}</p>
                </div>
              );
            }

            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const activeSection = hasChildren ? location.pathname.startsWith(item.path) : location.pathname === item.path;
            const submenuOpen = openSubmenus[item.path] ?? activeSection;

            if (hasChildren) {
              return (
                <div key={item.path} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => toggleSubmenu(item.path)}
                    className={'w-full min-h-11 flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-md)] type-nav font-medium transition-colors ' +
                      (activeSection ? 'bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)]')}
                    aria-expanded={submenuOpen}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <p>{t(item.name)}</p>
                    </div>
                    {submenuOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>

                  {submenuOpen && (
                    <div className="pl-6 space-y-1 border-l border-[var(--color-border)] ml-4 py-1">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        const activeChild = child.exact ? location.pathname === child.path : location.pathname.startsWith(child.path);
                        return (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            end={child.exact}
                            className={'min-h-11 flex items-center gap-2 px-2.5 py-2.5 rounded-[var(--radius-md)] type-nav transition-colors ' +
                              (activeChild ? 'bg-[var(--color-primary)] text-white font-semibold' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)]')}
                          >
                            <ChildIcon className="w-3.5 h-3.5" />
                            <p>{t(child.name)}</p>
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.to || item.path}
                className={({ isActive }) =>
                  'min-h-11 flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-md)] type-nav font-medium transition-colors ' +
                  (isActive ? 'bg-[var(--color-primary)] text-white font-semibold' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)]')
                }
              >
                <Icon className="w-4 h-4" />
                <p>{t(item.name)}</p>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 pb-[max(12px,env(safe-area-inset-bottom))] border-t border-[var(--color-border)]">
          <button
            type="button"
            onClick={logout}
            className="w-full min-h-11 flex items-center justify-center gap-2 px-3 rounded-[var(--radius-md)] bg-[var(--color-error-bg)] text-[var(--color-error)] border border-[var(--color-error-border)] type-nav font-medium hover:bg-[var(--color-error-bg)]"
          >
            <LogOut className="w-4 h-4" />
            <p>{t('Sign Out')}</p>
          </button>
        </div>
      </div>
    </div>
  );
};
