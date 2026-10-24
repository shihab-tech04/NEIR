import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header.jsx';
import { Sidebar } from './Sidebar.jsx';
import { MobileNavigationDrawer } from './MobileNavigationDrawer.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const AppShell = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { t } = usePreferences();

  return (
    <div className="h-[100dvh] overflow-hidden flex flex-col bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <Header
        onToggleSidebar={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
        onOpenMobileNav={() => setIsMobileNavOpen(true)}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      <div className="flex-1 flex min-h-0 overflow-hidden">
        <Sidebar isCollapsed={isSidebarCollapsed} />

        <MobileNavigationDrawer
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
        />

        <div className="flex-1 min-w-0 flex flex-col min-h-0 overflow-hidden">
          <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
            <div className="w-full p-4 sm:p-5 lg:p-5 xl:p-6">
              <Outlet />
            </div>
          </main>

          <footer className="shrink-0 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 sm:px-5 lg:px-6 py-2.5 max-md:pb-[max(10px,env(safe-area-inset-bottom))] text-right type-meta text-[var(--color-text-secondary)]">
            <p>{t('Powered by')} <strong className="font-semibold text-[var(--color-text-primary)]">Synesis IT</strong></p>
          </footer>
        </div>
      </div>
    </div>
  );
};
