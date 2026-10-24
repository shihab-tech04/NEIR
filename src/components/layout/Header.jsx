import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, KeyRound, LogOut, Menu, Settings2, User } from 'lucide-react';
import { BtrcLogo } from './BtrcLogo.jsx';
import { useAuth } from '../../features/auth/AuthContext.jsx';
import { useToast } from '../feedback/Toast.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';
import { PreferencesPanel } from '../settings/PreferencesPanel.jsx';
import { useOverlayPresence } from '../../system/useOverlayPresence.js';

export const Header = ({
  onToggleSidebar,
  onOpenMobileNav,
  isSidebarCollapsed,
}) => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const { language, t } = usePreferences();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const preferencesRef = useRef(null);
  const preferencesPresence = useOverlayPresence(preferencesOpen);
  const notificationsPresence = useOverlayPresence(notificationsOpen);
  const profilePresence = useOverlayPresence(profileMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) setProfileMenuOpen(false);
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) setNotificationsOpen(false);
      if (preferencesRef.current && !preferencesRef.current.contains(event.target)) setPreferencesOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    logout();
    addToast('Signed out successfully.', 'info');
    navigate('/login');
  };

  useEffect(() => {
    const anyPopupOpen = preferencesOpen || notificationsOpen || profileMenuOpen;
    if (!anyPopupOpen || !window.matchMedia('(max-width: 767px)').matches) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [preferencesOpen, notificationsOpen, profileMenuOpen]);

  const utilityButton = 'w-11 h-11 md:w-10 md:h-10 flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary-dark)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-colors cursor-pointer';

  return (
    <header className="h-16 bg-white text-[var(--color-text-primary)] border-b border-[var(--color-border)] px-3 sm:px-5 flex items-center justify-between sticky top-0 z-30 select-none">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className={'hidden lg:flex ' + utilityButton}
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={onOpenMobileNav}
          className={'lg:hidden ' + utilityButton}
          aria-label={t('Navigation')}
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/dashboard" className="flex items-center min-w-0 min-h-11" aria-label={t('Dashboard')}>
          <BtrcLogo className="h-9 w-9" showText compactOnNarrow />
        </Link>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <div ref={preferencesRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setPreferencesOpen((open) => !open);
              setNotificationsOpen(false);
              setProfileMenuOpen(false);
            }}
            className={utilityButton + ' gap-1.5 px-2 md:w-auto md:min-w-10'}
            aria-label={t('Preferences')}
            aria-expanded={preferencesOpen}
            title={t('Preferences')}
          >
            <Settings2 className="w-[18px] h-[18px]" />
            <p className="hidden md:inline type-meta font-semibold">
              {language === 'bn' ? 'বাংলা' : 'EN'}
            </p>
          </button>
          {preferencesPresence.mounted && (
            <>
              <button
                type="button"
                onClick={() => setPreferencesOpen(false)}
                data-state={preferencesPresence.state}
                className="motion-overlay-backdrop fixed inset-0 z-40 bg-[rgba(32,35,56,0.30)] backdrop-blur-xs md:hidden"
                aria-label={t('Close preferences')}
              />
              <div data-state={preferencesPresence.state} className="motion-dropdown-panel mobile-bottom-sheet mobile-bottom-sheet-surface fixed inset-x-0 bottom-0 z-50 md:absolute md:inset-auto md:right-0 md:mt-2">
                <PreferencesPanel />
              </div>
            </>
          )}
        </div>

        <div ref={notificationsRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen((open) => !open);
              setPreferencesOpen(false);
              setProfileMenuOpen(false);
            }}
            className={utilityButton}
            aria-label={t('View notifications')}
            aria-expanded={notificationsOpen}
          >
            <Bell className="w-[18px] h-[18px]" />
          </button>

          {notificationsPresence.mounted && (
            <>
              <button
                type="button"
                onClick={() => setNotificationsOpen(false)}
                data-state={notificationsPresence.state}
                className="motion-overlay-backdrop fixed inset-0 z-40 bg-[rgba(32,35,56,0.30)] backdrop-blur-xs md:hidden"
                aria-label={t('Close notifications')}
              />
              <div data-state={notificationsPresence.state} className="motion-dropdown-panel mobile-bottom-sheet mobile-bottom-sheet-surface fixed inset-x-0 bottom-0 z-50 w-full bg-white text-[var(--color-text-primary)] rounded-t-[20px] rounded-b-none border border-[var(--color-border)] border-x-0 border-b-0 py-2 max-md:pb-[max(8px,env(safe-area-inset-bottom))] shadow-[var(--shadow-overlay)] md:absolute md:inset-auto md:right-0 md:mt-2 md:w-72 md:rounded-xl md:border md:shadow-[var(--shadow-lg)]">
                <div className="px-4 py-2.5 border-b border-[var(--color-border)]">
                  <p className="type-label font-semibold">{t('Notifications')}</p>
                </div>
                <div className="px-4 py-5 type-body-sm text-[var(--color-text-secondary)]">
                  {t('No new notifications.')}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="w-px h-5 bg-[var(--color-border)] mx-1 hidden md:block" />

        <div ref={profileMenuRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileMenuOpen((open) => !open);
              setPreferencesOpen(false);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 min-h-11 md:min-h-9 px-2 py-1 rounded-lg hover:bg-[var(--color-primary-light)] transition-colors text-left cursor-pointer"
            aria-expanded={profileMenuOpen}
          >
            <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] flex items-center justify-center type-meta font-bold border border-[var(--color-border)]">
              <p>{user?.fullName?.charAt(0)?.toUpperCase() || 'A'}</p>
            </div>
            <div className="hidden md:flex flex-col">
              <p className="type-label font-semibold leading-tight truncate max-w-[150px]">
                {user?.fullName || t('Admin user')}
              </p>
              <p className="type-meta text-[var(--color-text-secondary)] leading-tight truncate max-w-[150px]">
                {user?.role || 'Admin'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--color-text-secondary)] hidden md:block" />
          </button>

          {profilePresence.mounted && (
            <>
              <button
                type="button"
                onClick={() => setProfileMenuOpen(false)}
                data-state={profilePresence.state}
                className="motion-overlay-backdrop fixed inset-0 z-40 bg-[rgba(32,35,56,0.30)] backdrop-blur-xs md:hidden"
                aria-label={t('Close profile menu')}
              />
              <div data-state={profilePresence.state} className="motion-dropdown-panel mobile-bottom-sheet mobile-bottom-sheet-surface fixed inset-x-0 bottom-0 z-50 w-full bg-white rounded-t-[20px] rounded-b-none border border-[var(--color-border)] border-x-0 border-b-0 py-1.5 shadow-[var(--shadow-overlay)] md:absolute md:inset-auto md:right-0 md:mt-2 md:w-60 md:rounded-xl md:border md:shadow-[var(--shadow-lg)]">
                <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-background-subtle)]">
                  <p className="type-label font-semibold truncate">{user?.fullName || t('Admin user')}</p>
                  <p className="type-meta text-[var(--color-text-secondary)] truncate mt-0.5">
                    {user?.email || user?.username || 'NEIR Admin'}
                  </p>
                </div>

                <div className="py-1 type-body-sm">
                  <Link
                    to="/office/users"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[var(--color-primary-light)]"
                  >
                    <User className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    <p>{t('User directory')}</p>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      addToast('Password management is not available from this menu.', 'info');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-[var(--color-primary-light)] text-left cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    <p>{t('Change password')}</p>
                  </button>
                </div>

                <div className="border-t border-[var(--color-border)] py-1 pb-[max(4px,env(safe-area-inset-bottom))]">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-[var(--color-error-bg)] text-[var(--color-error)] type-label text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <p>{t('Sign out')}</p>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
